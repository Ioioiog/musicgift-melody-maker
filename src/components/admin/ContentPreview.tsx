
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface ContentPreviewProps {
  title: string;
  content: string;
  excerpt?: string;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ title, content, excerpt }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Eye className="w-4 h-4" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {title && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          </div>
        )}
        
        {excerpt && (
          <div>
            <p className="text-gray-600 italic border-l-4 border-blue-200 pl-4">{excerpt}</p>
          </div>
        )}
        
        {content && (
          <div 
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        
        {!title && !content && (
          <p className="text-gray-400 text-center py-8">
            Start typing to see your content preview here
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentPreview;
