
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
    if (!user) {
      setPendingGiftCards([]);
      return [];
    }

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
          canReuse: hoursSinceCreated < 2, // More permissive - 2 hours instead of 24
          shouldCleanup: hoursSinceCreated > 24 // Still cleanup after 24 hours
        };
      });

      setPendingGiftCards(pendingCards);
      return pendingCards;

    } catch (error) {
      console.error('Error loading pending gift cards:', error);
      return [];
    } finally {
      setIsLoadingPending(false);
    }
  };

  // Clean up old pending gift cards
  const cleanupOldPendingCards = async (cardIds: string[]) => {
    if (cardIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('gift_cards')
        .delete()
        .in('id', cardIds);

      if (error) throw error;

      console.log(`Cleaned up ${cardIds.length} old pending gift cards`);
      
      // Remove from local state without triggering a reload
      setPendingGiftCards(prev => prev.filter(card => !cardIds.includes(card.id)));
      
    } catch (error) {
      console.error('Error cleaning up old pending cards:', error);
    }
  };

  // Find reusable pending gift card (more permissive logic)
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
          title: "Plată Reușită!",
          description: "Gift card-ul tău a fost creat și va fi livrat în scurt timp.",
        });
      } else if (paymentReturn.type === 'cancel') {
        toast({
          title: "Plată Anulată",
          description: "Plata a fost anulată. Gift card-ul este salvat și poți finaliza plata mai târziu.",
          variant: "destructive",
        });
      } else if (paymentReturn.type === 'error') {
        toast({
          title: "Eroare la Plată",
          description: "A apărut o eroare la procesarea plății. Te rugăm să încerci din nou.",
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

      // Reload pending cards without causing infinite loops
      await loadPendingGiftCards();
    } catch (error) {
      console.error('Error updating gift card status:', error);
    }
  };

  // Load pending cards when user changes - only once per user
  useEffect(() => {
    if (user) {
      loadPendingGiftCards();
    } else {
      setPendingGiftCards([]);
    }
  }, [user?.id]); // Only depend on user ID

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
