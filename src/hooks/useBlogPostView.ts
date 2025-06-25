
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a session ID that persists during the browser session
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('blog_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('blog_session_id', sessionId);
  }
  return sessionId;
};

export const useBlogPostView = (postId: string | undefined) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    const trackView = async () => {
      if (!postId || hasTracked.current) return;

      // Prevent tracking the same post multiple times in this session
      const viewedPosts = JSON.parse(sessionStorage.getItem('viewed_posts') || '[]');
      if (viewedPosts.includes(postId)) {
        return;
      }

      try {
        const sessionId = getSessionId();
        const referrer = document.referrer || '';

        const { error } = await supabase.functions.invoke('increment-blog-view', {
          body: {
            post_id: postId,
            session_id: sessionId,
            referrer: referrer
          }
        });

        if (error) {
          console.error('Failed to track blog post view:', error);
          // Don't throw error, just log it - view tracking shouldn't break the page
        } else {
          // Mark this post as viewed in this session
          viewedPosts.push(postId);
          sessionStorage.setItem('viewed_posts', JSON.stringify(viewedPosts));
          hasTracked.current = true;
          console.log('Blog post view tracked successfully');
        }
      } catch (error) {
        console.error('Error tracking blog post view:', error);
        // Don't throw error, just log it - view tracking shouldn't break the page
      }
    };

    // Add a small delay to ensure the page has loaded properly
    const timer = setTimeout(trackView, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [postId]);
};
