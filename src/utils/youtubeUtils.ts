
/**
 * Utility functions for handling YouTube URLs
 */

/**
 * Extracts video ID from various YouTube URL formats
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Remove any whitespace
  url = url.trim();
  
  // Handle various YouTube URL formats
  const patterns = [
    // Standard watch URLs
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Shortened youtu.be URLs
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed URLs
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Mobile URLs
    /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // YouTube Music URLs
    /(?:music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Converts any YouTube URL to the proper embed format
 */
export const convertToYouTubeEmbed = (url: string): string => {
  if (!url) return '';
  
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return url; // Return original if can't parse
  
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Validates if a URL is a valid YouTube URL
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  if (!url) return true; // Empty is valid since it's optional
  
  const videoId = extractYouTubeVideoId(url);
  return videoId !== null;
};
