import { useState } from "react";
import { Mail, Plus, RefreshCw, Settings, Trash2, Eye, Paperclip, Archive, RotateCcw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  useEmailAccounts, 
  useEmailMessages, 
  useFetchEmails, 
  useDeleteEmailAccount,
  useMoveEmail,
  type EmailMessage,
  EMAIL_FOLDERS
} from "@/hooks/useEmailAccounts";
import EmailAccountForm from "./EmailAccountForm";
import EmailDetailsModal from "./EmailDetailsModal";
import EmailFolderSidebar from "./EmailFolderSidebar";
import EmailComposer from "./EmailComposer";

const EmailManagement = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('INBOX');
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showEmailDetails, setShowEmailDetails] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);

  const { data: accounts = [], isLoading: accountsLoading, error: accountsError } = useEmailAccounts();
  const { data: messages = [], isLoading: messagesLoading, error: messagesError, refetch: refetchMessages } = useEmailMessages(selectedAccountId, selectedFolder);
  const fetchEmails = useFetchEmails();
  const deleteAccount = useDeleteEmailAccount();
  const moveEmail = useMoveEmail();

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
  const currentFolder = EMAIL_FOLDERS.find(f => f.id === selectedFolder);

  const handleRefreshEmails = async () => {
    if (selectedAccountId) {
      await fetchEmails.mutateAsync({ 
        accountId: selectedAccountId,
        folder: selectedFolder,
        forceRefresh: true 
      });
      refetchMessages();
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('Are you sure you want to delete this email account?')) {
      await deleteAccount.mutateAsync(accountId);
      if (selectedAccountId === accountId) {
        setSelectedAccountId(null);
      }
    }
  };

  const handleViewEmail = (email: EmailMessage) => {
    setSelectedEmail(email);
    setShowEmailDetails(true);
  };

  const handleMoveToTrash = async (messageId: string) => {
    await moveEmail.mutateAsync({ messageId, targetFolder: 'Trash' });
  };

  const handleRestoreFromTrash = async (messageId: string) => {
    await moveEmail.mutateAsync({ messageId, targetFolder: 'INBOX' });
  };

  const handleComposeEmail = () => {
    setShowEmailComposer(true);
  };

  const handleReplyToEmail = (email: EmailMessage) => {
    setSelectedEmail(email);
    setShowEmailComposer(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmailPreview = (email: EmailMessage) => {
    const preview = email.body_preview || email.subject;
    return preview.length > 100 ? `${preview.substring(0, 100)}...` : preview;
  };

  // Show service error alert if there are connectivity issues
  const showServiceError = accountsError || messagesError;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">Email Management</h2>
          <p className="text-gray-600">Manage IMAP email accounts and view messages</p>
        </div>
      </div>

      {showServiceError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There seems to be a connectivity issue with the email service. Some features may be temporarily unavailable. 
            Please try refreshing the page or check back in a few minutes.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Client
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {currentFolder && (
                    <>
                      <span className="text-xl">{currentFolder.icon}</span>
                      {currentFolder.name}
                    </>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {selectedAccountId && (
                    <>
                      <Button
                        onClick={handleComposeEmail}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={showServiceError}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Compose
                      </Button>
                      <Button
                        onClick={handleRefreshEmails}
                        disabled={fetchEmails.isPending || showServiceError}
                        size="sm"
                        variant="outline"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${fetchEmails.isPending ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {accounts.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Account:</label>
                  <Select value={selectedAccountId || ""} onValueChange={setSelectedAccountId}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select an email account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.email_address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-0">
              {accounts.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No email accounts</h3>
                  <p className="text-gray-600 mb-4">Add an email account to start viewing messages</p>
                  <Button onClick={() => setShowAccountForm(true)} disabled={showServiceError}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Email Account
                  </Button>
                </div>
              ) : !selectedAccountId ? (
                <div className="text-center py-8 px-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an account</h3>
                  <p className="text-gray-600">Choose an email account to view messages</p>
                </div>
              ) : (
                <div className="flex h-[600px]">
                  <EmailFolderSidebar
                    accountId={selectedAccountId}
                    selectedFolder={selectedFolder}
                    onFolderSelect={setSelectedFolder}
                  />
                  
                  <div className="flex-1 flex flex-col">
                    {messagesLoading ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                        <p className="text-gray-600 ml-3">Loading messages...</p>
                      </div>
                    ) : messagesError ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Service Temporarily Unavailable</h3>
                          <p className="text-gray-600 mb-4">Unable to load messages. Please try again later.</p>
                          <Button onClick={() => refetchMessages()} variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                          </Button>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-6xl mb-4 block">{currentFolder?.icon}</span>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
                          <p className="text-gray-600 mb-4">No emails found in {currentFolder?.name}</p>
                          <Button onClick={handleRefreshEmails} disabled={fetchEmails.isPending || showServiceError}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${fetchEmails.isPending ? 'animate-spin' : ''}`} />
                            Refresh
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <ScrollArea className="flex-1">
                        <div className="p-4 space-y-2">
                          {messages.map((email) => (
                            <div
                              key={email.id}
                              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                !email.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                              }`}
                              onClick={() => handleViewEmail(email)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-sm ${!email.is_read ? 'font-semibold' : 'font-medium'}`}>
                                      {email.sender_name || email.sender_email}
                                    </span>
                                    {!email.is_read && (
                                      <Badge variant="secondary" className="text-xs">New</Badge>
                                    )}
                                    {email.has_attachments && (
                                      <Paperclip className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                  <h4 className={`text-sm truncate ${!email.is_read ? 'font-semibold' : 'font-medium'}`}>
                                    {email.subject}
                                  </h4>
                                  <p className="text-xs text-gray-600 truncate mt-1">
                                    {getEmailPreview(email)}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4">
                                  <span className="text-xs text-gray-500">
                                    {formatDate(email.received_date)}
                                  </span>
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-6 w-6 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewEmail(email);
                                      }}
                                    >
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                    
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplyToEmail(email);
                                      }}
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                    </Button>
                                    
                                    {selectedFolder === 'Trash' ? (
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRestoreFromTrash(email.id);
                                        }}
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                      </Button>
                                    ) : (
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMoveToTrash(email.id);
                                        }}
                                      >
                                        <Archive className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Email Accounts</CardTitle>
                <Button onClick={() => setShowAccountForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {accountsLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
                  <p className="text-gray-600 mt-2">Loading accounts...</p>
                </div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-8">
                  <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No email accounts</h3>
                  <p className="text-gray-600">Add an email account to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{account.email_address}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600">
                              Server: {account.imap_server}:{account.imap_port}
                            </span>
                            {account.last_sync_at && (
                              <span className="text-sm text-gray-600">
                                Last sync: {formatDate(account.last_sync_at)}
                              </span>
                            )}
                            <Badge variant={account.is_active ? "default" : "secondary"}>
                              {account.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteAccount(account.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EmailAccountForm
        open={showAccountForm}
        onOpenChange={setShowAccountForm}
      />

      <EmailDetailsModal
        open={showEmailDetails}
        onOpenChange={setShowEmailDetails}
        email={selectedEmail}
      />

      <EmailComposer
        accountId={selectedAccountId}
        open={showEmailComposer}
        onOpenChange={setShowEmailComposer}
        replyTo={selectedEmail}
      />
    </div>
  );
};

export default EmailManagement;
