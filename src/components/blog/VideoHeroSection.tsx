
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Eye, Youtube, Play } from "lucide-react";
import { convertToYouTubeEmbed, getYouTubeThumbnail } from "@/utils/youtubeUtils";

interface VideoHeroSectionProps {
  post: {
    id: string;
    title: string;
    youtube_url?: string;
    category: string;
    author: string;
    published_at?: string;
    created_at: string;
    read_time?: number;
    views?: number;
    image_url?: string;
  };
}

const VideoHeroSection: React.FC<VideoHeroSectionProps> = ({ post }) => {
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const thumbnailUrl = post.youtube_url ? getYouTubeThumbnail(post.youtube_url) : '';

  // If no YouTube URL, don't render anything
  if (!post.youtube_url) {
    return null;
  }

  return (
    <div className="mb-12">
      {/* Video Container - Exactly like YouTube */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        {!isVideoLoaded ? (
          // YouTube-like Thumbnail
          <div 
            className="relative w-full h-full cursor-pointer group"
            onClick={() => setIsVideoLoaded(true)}
          >
            <img 
              src={thumbnailUrl || post.image_url || '/uploads/background.webp'} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            
            {/* YouTube-style Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-700">
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>
            
            {/* Duration Badge (YouTube-style) */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
              {post.read_time}:00
            </div>
          </div>
        ) : (
          // Actual Video Embed
          <iframe
            src={convertToYouTubeEmbed(post.youtube_url)}
            title={post.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
      
      {/* Transparent Metadata Section */}
      {!isVideoLoaded && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              {post.category}
            </Badge>
            <Badge className="bg-red-500 text-white border-0 flex items-center gap-1">
              <Youtube className="w-3 h-3" />
              Video
            </Badge>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-white/80 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(post.published_at || post.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {post.read_time} min read
            </div>
            {post.views !== undefined && post.views > 0 && (
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {post.views} views
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoHeroSection;
