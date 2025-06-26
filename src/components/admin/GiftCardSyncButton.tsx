
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CheckCircle } from "lucide-react";

interface GiftCardSyncButtonProps {
  giftCardId?: string;
  onSyncComplete?: () => void;
}

const GiftCardSyncButton = ({ giftCardId, onSyncComplete }: GiftCardSyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    
    try {
      let result;
      
      if (giftCardId) {
        // Sync single gift card
        const { data, error } = await supabase.functions.invoke('gift-card-smartbill-sync', {
          body: { giftCardId }
        });
        
        if (error) throw error;
        result = data;
      } else {
        // Bulk sync all pending gift cards
        const { data, error } = await supabase.functions.invoke('gift-card-bulk-sync');
        
        if (error) throw error;
        result = data;
      }

      toast({
        title: "Sync Completed",
        description: result.message || "Gift card status synchronized successfully",
      });

      if (onSyncComplete) {
        onSyncComplete();
      }

    } catch (error: any) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to synchronize gift card status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading}
      variant={giftCardId ? "outline" : "default"}
      size="sm"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      {giftCardId ? "Sync Status" : "Sync All Pending"}
    </Button>
  );
};

export default GiftCardSyncButton;
