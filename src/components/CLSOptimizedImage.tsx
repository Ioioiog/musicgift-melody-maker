
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface CLSOptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const CLSOptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  onLoad,
  onError
}: CLSOptimizedImageProps) => {
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

  const aspectRatio = (height / width) * 100;

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      style={{
        width: '100%',
        paddingBottom: `${aspectRatio}%`,
        contain: 'layout style',
        contentVisibility: 'auto',
        containIntrinsicSize: `${width}px ${height}px`
      }}
    >
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{
            contain: 'strict'
          }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      {hasError ? (
        <div 
          className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500"
        >
          Image not available
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            contain: 'layout style',
            aspectRatio: `${width}/${height}`
          }}
        />
      )}
    </div>
  );
};

export default CLSOptimizedImage;
