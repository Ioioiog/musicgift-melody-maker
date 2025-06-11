
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { GiftCard } from '@/hooks/useGiftCards';

export interface PendingGiftCard extends GiftCard {
  canReuse: boolean;
  shouldCleanup: boolean;
}

export const useGiftCardPaymentState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingGiftCards, setPendingGiftCards] = useState<PendingGiftCard[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [paymentReturn, setPaymentReturn] = useState<{
    type: 'success' | 'cancel' | 'error' | null;
    processed: boolean;
  }>({ type: null, processed: false });

  // Check for payment return parameters
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const orderId = searchParams.get('orderId');
    
    if (paymentStatus && !paymentReturn.processed) {
      setPaymentReturn({
        type: paymentStatus as 'success' | 'cancel' | 'error',
        processed: false
      });
    }
  }, [searchParams]);

  // Load pending gift cards for current user
  const loadPendingGiftCards = async () => {
    if (!user) return;

    setIsLoadingPending(true);
    try {
      const { data: giftCards, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('sender_user_id', user.id)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const pendingCards: PendingGiftCard[] = (giftCards || []).map(card => {
        const createdAt = new Date(card.created_at);
        const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        
        return {
          ...card,
          canReuse: hoursSinceCreated < 24, // Can reuse if less than 24 hours old
          shouldCleanup: hoursSinceCreated > 24 // Should cleanup if older than 24 hours
        };
      });

      setPendingGiftCards(pendingCards);

      // Auto-cleanup old pending cards
      const cardsToCleanup = pendingCards.filter(card => card.shouldCleanup);
      if (cardsToCleanup.length > 0) {
        await cleanupOldPendingCards(cardsToCleanup.map(card => card.id));
      }

    } catch (error) {
      console.error('Error loading pending gift cards:', error);
    } finally {
      setIsLoadingPending(false);
    }
  };

  // Clean up old pending gift cards
  const cleanupOldPendingCards = async (cardIds: string[]) => {
    try {
      const { error } = await supabase
        .from('gift_cards')
        .delete()
        .in('id', cardIds);

      if (error) throw error;

      console.log(`Cleaned up ${cardIds.length} old pending gift cards`);
    } catch (error) {
      console.error('Error cleaning up old pending cards:', error);
    }
  };

  // Find reusable pending gift card
  const findReusablePendingCard = (amount: number, currency: string) => {
    return pendingGiftCards.find(card => 
      card.canReuse && 
      card.gift_amount === amount && 
      card.currency === currency
    );
  };

  // Process payment return
  const processPaymentReturn = async () => {
    if (!paymentReturn.type || paymentReturn.processed) return;

    try {
      if (paymentReturn.type === 'success') {
        toast({
          title: "Payment Successful!",
          description: "Your gift card has been created and will be delivered shortly.",
        });
      } else if (paymentReturn.type === 'cancel') {
        toast({
          title: "Payment Cancelled",
          description: "Your payment was cancelled. The gift card is still saved and you can complete payment later.",
          variant: "destructive",
        });
      } else if (paymentReturn.type === 'error') {
        toast({
          title: "Payment Error",
          description: "There was an error processing your payment. Please try again.",
          variant: "destructive",
        });
      }

      // Clean up URL parameters
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('payment');
      newSearchParams.delete('orderId');
      setSearchParams(newSearchParams, { replace: true });

      setPaymentReturn(prev => ({ ...prev, processed: true }));

      // Reload pending cards to reflect any status changes
      await loadPendingGiftCards();

    } catch (error) {
      console.error('Error processing payment return:', error);
    }
  };

  // Update gift card status
  const updateGiftCardStatus = async (cardId: string, status: string, paymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('gift_cards')
        .update({ 
          status, 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', cardId);

      if (error) throw error;

      // Reload pending cards
      await loadPendingGiftCards();
    } catch (error) {
      console.error('Error updating gift card status:', error);
    }
  };

  // Load pending cards when user changes
  useEffect(() => {
    if (user) {
      loadPendingGiftCards();
    } else {
      setPendingGiftCards([]);
    }
  }, [user]);

  // Process payment return when detected
  useEffect(() => {
    if (paymentReturn.type && !paymentReturn.processed) {
      processPaymentReturn();
    }
  }, [paymentReturn.type]);

  return {
    pendingGiftCards,
    isLoadingPending,
    paymentReturn,
    findReusablePendingCard,
    loadPendingGiftCards,
    updateGiftCardStatus,
    cleanupOldPendingCards
  };
};
