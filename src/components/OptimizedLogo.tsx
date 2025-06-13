
import React from 'react';
import { cn } from '@/lib/utils';

interface OptimizedLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  alt?: string;
}

const OptimizedLogo: React.FC<OptimizedLogoProps> = ({
  className,
  width = 180,
  height = 60,
  priority = false,
  alt = "MusicGift.ro - Cadouri Muzicale Personalizate"
}) => {
  const logoSrc = "/uploads/407b475e-cd49-4ba1-918b-57bd3fc6c955.png";
  
  return (
    <picture className={cn("block", className)}>
      {/* Modern formats with fallback */}
      <source 
        srcSet={`${logoSrc} 1x, ${logoSrc} 2x`}
        type="image/png"
      />
      <img
        src={logoSrc}
        alt={alt}
        width={width}
        height={height}
        className="h-auto max-w-full object-contain"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{
          contain: 'layout style paint',
          aspectRatio: `${width}/${height}`
        }}
        onError={(e) => {
          console.warn('Logo failed to load:', e);
        }}
      />
    </picture>
  );
};

export default OptimizedLogo;
