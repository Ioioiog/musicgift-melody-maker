
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Clock, Eye, Youtube, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

interface VideoCardProps {
  post: {
    id: string;
    title: string;
    excerpt?: string;
    category: string;
    author: string;
    published_at?: string;
    created_at: string;
    read_time?: number;
    views?: number;
    slug: string;
    youtube_url: string;
    image_url?: string;
  };
  size?: 'small' | 'medium' | 'large';
}

const VideoCard: React.FC<VideoCardProps> = ({ post, size = 'medium' }) => {
  const thumbnailUrl = getYouTubeThumbnail(post.youtube_url);
  
  const sizeClasses = {
    small: 'h-24',
    medium: 'h-32',
    large: 'h-48'
  };
  
  const titleClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
      <div className="relative overflow-hidden">
        <img 
          src={thumbnailUrl || post.image_url || '/uploads/background.webp'} 
          alt={post.title} 
          className={`w-full ${sizeClasses[size]} object-cover group-hover:scale-110 transition-transform duration-700`}
        />
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
        
        {/* Video Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          Video
        </div>
        
        {/* Category and Video Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className="bg-white/90 text-gray-800 border-0 backdrop-blur-sm font-medium text-xs px-2 py-1">
            {post.category}
          </Badge>
          <Badge className="bg-red-600 text-white border-0 backdrop-blur-sm font-medium text-xs px-2 py-1 flex items-center gap-1">
            <Youtube className="w-2 h-2" />
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2 p-4">
        <CardTitle className={`${titleClasses[size]} group-hover:text-purple-300 transition-colors duration-300 leading-snug text-white line-clamp-2`}>
          {post.title}
        </CardTitle>
        <CardDescription className="text-gray-300 text-xs leading-relaxed line-clamp-2">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 p-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(post.published_at || post.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {post.read_time} min
            </div>
          </div>
          {post.views && post.views > 0 && (
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {post.views}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-400">
            <User className="w-3 h-3 mr-1" />
            {post.author}
          </div>
          
          <Link to={`/blog/${post.slug}`}>
            <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-white/10 font-medium p-1 text-xs">
              Watch
              <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
