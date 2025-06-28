
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate WebP srcset for better compression
  const generateSrcSet = (baseSrc: string) => {
    if (baseSrc.includes('uploads/')) {
      const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return `${webpSrc} 1x, ${baseSrc} 1x`;
    }
    return undefined;
  };

  if (hasError) {
    return (
      <div 
        className={cn("bg-gray-200 flex items-center justify-center text-gray-500", className)}
        style={{ width, height }}
      >
        Image not available
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        srcSet={generateSrcSet(src)}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          "w-full h-full object-cover"
        )}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: width && height ? `${width}px ${height}px` : '300px 200px'
        }}
      />
      
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
