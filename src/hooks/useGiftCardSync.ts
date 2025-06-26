
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useGiftCardSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const syncGiftCard = async (giftCardId: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gift-card-smartbill-sync', {
        body: { giftCardId }
      });
      
      if (error) throw error;

      toast({
        title: "Sync Completed",
        description: data.message || "Gift card status synchronized successfully",
      });

      return data;

    } catch (error: any) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to synchronize gift card status",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const syncAllPendingGiftCards = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gift-card-bulk-sync');
      
      if (error) throw error;

      toast({
        title: "Bulk Sync Completed",
        description: `${data.successCount} gift cards synchronized successfully`,
      });

      return data;

    } catch (error: any) {
      console.error('Bulk sync error:', error);
      toast({
        title: "Bulk Sync Failed",
        description: error.message || "Failed to synchronize gift card statuses",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    syncGiftCard,
    syncAllPendingGiftCards,
    isLoading
  };
};
