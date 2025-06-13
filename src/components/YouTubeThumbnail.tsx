
import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { getYouTubeThumbnail, getYouTubeWatchUrl } from '@/utils/youtubeUtils';

interface YouTubeThumbnailProps {
  url: string;
  title: string;
  className?: string;
  openInNewTab?: boolean;
}

const YouTubeThumbnail: React.FC<YouTubeThumbnailProps> = ({ 
  url, 
  title, 
  className = "", 
  openInNewTab = true 
}) => {
  const thumbnailUrl = getYouTubeThumbnail(url, 'maxres');
  const watchUrl = getYouTubeWatchUrl(url);

  if (!thumbnailUrl) return null;

  const handleClick = () => {
    if (openInNewTab) {
      window.open(watchUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = watchUrl;
    }
  };

  return (
    <div 
      className={`relative group overflow-hidden rounded-xl bg-gray-50 cursor-pointer h-full ${className}`}
      onClick={handleClick}
    >
      {/* Thumbnail Image */}
      <img 
        src={thumbnailUrl} 
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* External Link Icon */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
        <ExternalLink className="w-4 h-4 text-red-600" />
      </div>
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
          <Play className="w-6 h-6 text-gray-800" />
        </div>
      </div>
      
      {/* YouTube Branding */}
      <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
        YouTube
      </div>
    </div>
  );
};

export default YouTubeThumbnail;
