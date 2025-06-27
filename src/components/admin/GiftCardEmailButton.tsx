
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GiftCardEmailButtonProps {
  giftCardId: string;
  recipientEmail: string;
  size?: 'sm' | 'default';
  variant?: 'ghost' | 'outline' | 'default';
}

const GiftCardEmailButton = ({ 
  giftCardId, 
  recipientEmail, 
  size = 'sm', 
  variant = 'outline' 
}: GiftCardEmailButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-gift-card-email', {
        body: { giftCardId }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email Sent Successfully",
        description: `Gift card email has been resent to ${recipientEmail}`,
      });
    } catch (error) {
      console.error('Error resending gift card email:', error);
      toast({
        title: "Email Send Failed",
        description: "There was an error sending the gift card email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleResendEmail}
      disabled={isLoading}
      className="flex items-center gap-1"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mail className="h-4 w-4" />
      )}
      {size !== 'sm' && (isLoading ? 'Sending...' : 'Resend Email')}
    </Button>
  );
};

export default GiftCardEmailButton;
