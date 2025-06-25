
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Eye, Youtube, Play } from "lucide-react";
import { convertToYouTubeEmbed, getYouTubeThumbnail } from "@/utils/youtubeUtils";

interface VideoHeroSectionProps {
  post: {
    id: string;
    title: string;
    youtube_url: string;
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
  const thumbnailUrl = getYouTubeThumbnail(post.youtube_url);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-12">
      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        {!isVideoLoaded ? (
          // Video Thumbnail with Play Overlay
          <div 
            className="relative w-full h-full cursor-pointer group"
            onClick={() => setIsVideoLoaded(true)}
          >
            <img 
              src={thumbnailUrl || post.image_url || '/uploads/background.webp'} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500">
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>
            
            {/* Video Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-600 text-white border-0 px-3 py-1 text-sm font-medium flex items-center gap-2">
                <Youtube className="w-4 h-4" />
                Watch Video
              </Badge>
            </div>
            
            {/* Click to Play Text */}
            <div className="absolute bottom-4 left-4 text-white/90">
              <p className="text-sm font-medium">Click to play video</p>
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
      
      {/* Video Metadata Overlay */}
      {!isVideoLoaded && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              {post.category}
            </Badge>
            <Badge className="bg-red-600 text-white border-0 flex items-center gap-1">
              <Youtube className="w-3 h-3" />
              Video
            </Badge>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
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
