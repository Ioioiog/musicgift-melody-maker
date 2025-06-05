
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Send, Save, X, Plus } from "lucide-react";
import { useSendEmail, useSaveEmailDraft, EmailMessage } from "@/hooks/useEmailAccounts";
import { toast } from "sonner";

interface EmailComposerProps {
  accountId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyTo?: EmailMessage;
  draft?: any;
}

const EmailComposer = ({ 
  accountId, 
  open, 
  onOpenChange, 
  replyTo,
  draft 
}: EmailComposerProps) => {
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [bodyPlain, setBodyPlain] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [toInput, setToInput] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [bccInput, setBccInput] = useState("");

  const sendEmail = useSendEmail();
  const saveDraft = useSaveEmailDraft();

  // Initialize with reply data or draft data
  useEffect(() => {
    if (replyTo) {
      setTo([replyTo.sender_email]);
      setSubject(`Re: ${replyTo.subject}`);
      setBodyPlain(`\n\nOn ${new Date(replyTo.received_date).toLocaleString()}, ${replyTo.sender_name || replyTo.sender_email} wrote:\n> ${replyTo.body_preview || ''}`);
    } else if (draft) {
      setTo(draft.to_emails || []);
      setCc(draft.cc_emails || []);
      setBcc(draft.bcc_emails || []);
      setSubject(draft.subject || "");
      setBodyHtml(draft.body_html || "");
      setBodyPlain(draft.body_plain || "");
      if (draft.cc_emails?.length > 0) setShowCc(true);
      if (draft.bcc_emails?.length > 0) setShowBcc(true);
    }
  }, [replyTo, draft]);

  const addEmailToList = (email: string, list: string[], setList: (emails: string[]) => void) => {
    if (email && !list.includes(email)) {
      setList([...list, email]);
    }
  };

  const removeEmailFromList = (email: string, list: string[], setList: (emails: string[]) => void) => {
    setList(list.filter(e => e !== email));
  };

  const handleSend = async () => {
    if (!accountId) {
      toast.error("No email account selected");
      return;
    }

    if (to.length === 0) {
      toast.error("Please add at least one recipient");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please add a subject");
      return;
    }

    try {
      await sendEmail.mutateAsync({
        accountId,
        to,
        cc,
        bcc,
        subject,
        bodyHtml,
        bodyPlain,
        draftId: draft?.id
      });
      
      onOpenChange(false);
      // Reset form
      setTo([]);
      setCc([]);
      setBcc([]);
      setSubject("");
      setBodyHtml("");
      setBodyPlain("");
      setToInput("");
      setCcInput("");
      setBccInput("");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handleSaveDraft = async () => {
    if (!accountId) {
      toast.error("No email account selected");
      return;
    }

    try {
      await saveDraft.mutateAsync({
        accountId,
        to,
        cc,
        bcc,
        subject,
        bodyHtml,
        bodyPlain,
        id: draft?.id
      });
      
      toast.success("Draft saved");
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  const EmailChips = ({ emails, onRemove }: { emails: string[]; onRemove: (email: string) => void }) => (
    <div className="flex flex-wrap gap-1 mt-1">
      {emails.map((email) => (
        <Badge key={email} variant="secondary" className="flex items-center gap-1">
          {email}
          <X 
            className="w-3 h-3 cursor-pointer hover:text-red-600" 
            onClick={() => onRemove(email)}
          />
        </Badge>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {replyTo ? "Reply to Email" : draft ? "Edit Draft" : "Compose Email"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* To Field */}
          <div>
            <Label htmlFor="to">To</Label>
            <div className="flex gap-2">
              <Input
                id="to"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && toInput.trim()) {
                    addEmailToList(toInput.trim(), to, setTo);
                    setToInput("");
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (toInput.trim()) {
                    addEmailToList(toInput.trim(), to, setTo);
                    setToInput("");
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <EmailChips emails={to} onRemove={(email) => removeEmailFromList(email, to, setTo)} />
          </div>

          {/* CC/BCC Toggle Buttons */}
          <div className="flex gap-2">
            {!showCc && (
              <Button variant="outline" size="sm" onClick={() => setShowCc(true)}>
                + CC
              </Button>
            )}
            {!showBcc && (
              <Button variant="outline" size="sm" onClick={() => setShowBcc(true)}>
                + BCC
              </Button>
            )}
          </div>

          {/* CC Field */}
          {showCc && (
            <div>
              <Label htmlFor="cc">CC</Label>
              <div className="flex gap-2">
                <Input
                  id="cc"
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  placeholder="Enter CC email address"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && ccInput.trim()) {
                      addEmailToList(ccInput.trim(), cc, setCc);
                      setCcInput("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (ccInput.trim()) {
                      addEmailToList(ccInput.trim(), cc, setCc);
                      setCcInput("");
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowCc(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <EmailChips emails={cc} onRemove={(email) => removeEmailFromList(email, cc, setCc)} />
            </div>
          )}

          {/* BCC Field */}
          {showBcc && (
            <div>
              <Label htmlFor="bcc">BCC</Label>
              <div className="flex gap-2">
                <Input
                  id="bcc"
                  value={bccInput}
                  onChange={(e) => setBccInput(e.target.value)}
                  placeholder="Enter BCC email address"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && bccInput.trim()) {
                      addEmailToList(bccInput.trim(), bcc, setBcc);
                      setBccInput("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (bccInput.trim()) {
                      addEmailToList(bccInput.trim(), bcc, setBcc);
                      setBccInput("");
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowBcc(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <EmailChips emails={bcc} onRemove={(email) => removeEmailFromList(email, bcc, setBcc)} />
            </div>
          )}

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>

          {/* Email Body */}
          <div>
            <Label>Email Content</Label>
            <Tabs defaultValue="plain" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="plain">Plain Text</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              
              <TabsContent value="plain" className="mt-4">
                <Textarea
                  value={bodyPlain}
                  onChange={(e) => setBodyPlain(e.target.value)}
                  placeholder="Enter your message..."
                  rows={10}
                  className="resize-none"
                />
              </TabsContent>
              
              <TabsContent value="html" className="mt-4">
                <Textarea
                  value={bodyHtml}
                  onChange={(e) => setBodyHtml(e.target.value)}
                  placeholder="Enter HTML content..."
                  rows={10}
                  className="resize-none font-mono text-sm"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saveDraft.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button
              onClick={handleSend}
              disabled={sendEmail.isPending || !accountId}
            >
              <Send className="w-4 h-4 mr-2" />
              {sendEmail.isPending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailComposer;
