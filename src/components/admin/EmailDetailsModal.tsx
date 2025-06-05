
import { useEffect } from "react";
import { Mail, Paperclip, Download, X, Clock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMarkEmailAsRead, type EmailMessage } from "@/hooks/useEmailAccounts";

interface EmailDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: EmailMessage | null;
}

const EmailDetailsModal = ({ open, onOpenChange, email }: EmailDetailsModalProps) => {
  const markAsRead = useMarkEmailAsRead();

  useEffect(() => {
    if (open && email && !email.is_read) {
      markAsRead.mutate({ messageId: email.id, isRead: true });
    }
  }, [open, email, markAsRead]);

  if (!email) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Mail className="w-5 h-5 text-purple-600" />
            <span className="truncate">{email.subject}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4">
          {/* Email Header */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{email.sender_name || email.sender_email}</span>
                  {!email.is_read && (
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {formatDate(email.received_date)}
                </div>

                {email.has_attachments && email.email_attachments && (
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {email.email_attachments.length} attachment(s)
                    </span>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Attachments */}
          {email.has_attachments && email.email_attachments && email.email_attachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments
              </h3>
              <div className="grid gap-2">
                {email.email_attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{attachment.filename}</p>
                        <p className="text-xs text-gray-600">
                          {attachment.content_type} • {formatFileSize(attachment.size_bytes)}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Email Body */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  {email.full_body ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {email.full_body}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 italic">
                      {email.body_preview || "No content available"}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDetailsModal;
