
import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AdvancedOptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const AdvancedOptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  onLoad,
  onError
}: AdvancedOptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Generate multiple format sources with different qualities
  const generateSources = useCallback(() => {
    const baseSrc = src.replace(/\.(jpg|jpeg|png)$/i, '');
    const extension = src.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';
    
    const sources = [];
    
    // WebP source with multiple sizes
    sources.push({
      srcSet: `${baseSrc}.webp 1x, ${baseSrc}@2x.webp 2x`,
      type: 'image/webp'
    });
    
    // AVIF source (if available)
    sources.push({
      srcSet: `${baseSrc}.avif 1x, ${baseSrc}@2x.avif 2x`,
      type: 'image/avif'
    });
    
    // Fallback to original format
    sources.push({
      srcSet: `${src} 1x, ${baseSrc}@2x${extension} 2x`,
      type: `image/${extension.slice(1)}`
    });
    
    return sources;
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setCurrentSrc(src);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(src);
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [src, priority]);

  const aspectRatio = (height / width) * 100;

  if (hasError) {
    return (
      <div 
        className={cn("bg-gray-200 flex items-center justify-center text-gray-500", className)}
        style={{ 
          width: '100%',
          paddingBottom: `${aspectRatio}%`,
          position: 'relative'
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-sm">
          Image unavailable
        </span>
      </div>
    );
  }

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
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}

      <picture>
        {generateSources().map((source, index) => (
          <source 
            key={index}
            srcSet={source.srcSet} 
            type={source.type}
            sizes={sizes}
          />
        ))}
        <img
          ref={imgRef}
          src={currentSrc || src}
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
      </picture>
    </div>
  );
};

export default AdvancedOptimizedImage;
