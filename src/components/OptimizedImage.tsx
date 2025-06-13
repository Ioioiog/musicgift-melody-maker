
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate WebP version if available
  const webpSrc = src.includes('/lovable-uploads/') 
    ? src 
    : src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  return (
    <picture className={className}>
      {/* WebP source for modern browsers */}
      <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
      
      {/* Fallback image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'opacity-50',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined
        }}
      />
    </picture>
  );
};

export default OptimizedImage;
