
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { GiftCard } from '@/hooks/useGiftCards';

export interface PendingGiftCard extends GiftCard {
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
        const minutesSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60);
        
        return {
          ...card,
          shouldCleanup: minutesSinceCreated > 3 // Cleanup after 3 minutes
        };
      });

      setPendingGiftCards(pendingCards);
      
      // Auto-cleanup old cards immediately
      const cardsToCleanup = pendingCards.filter(card => card.shouldCleanup);
      if (cardsToCleanup.length > 0) {
        // Cleanup in background without waiting
        cleanupOldPendingCards(cardsToCleanup.map(card => card.id));
      }

      return pendingCards.filter(card => !card.shouldCleanup); // Return only active cards

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

      console.log(`Cleaned up ${cardIds.length} old pending gift cards (3+ minutes old)`);
      
      // Remove from local state without triggering a reload
      setPendingGiftCards(prev => prev.filter(card => !cardIds.includes(card.id)));
      
    } catch (error) {
      console.error('Error cleaning up old pending cards:', error);
    }
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
          description: "Plata a fost anulată.",
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

  // Periodic cleanup every 2 minutes to ensure cards are cleaned up promptly
  useEffect(() => {
    if (!user) return;

    const cleanupInterval = setInterval(async () => {
      await loadPendingGiftCards(); // This will auto-cleanup old cards
    }, 2 * 60 * 1000); // Every 2 minutes

    return () => clearInterval(cleanupInterval);
  }, [user?.id]);

  return {
    pendingGiftCards,
    isLoadingPending,
    paymentReturn,
    loadPendingGiftCards,
    updateGiftCardStatus,
    cleanupOldPendingCards
  };
};
