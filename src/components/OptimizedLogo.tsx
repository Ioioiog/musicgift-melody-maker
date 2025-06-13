
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
  // Use the new colorful MusicGift logo
  const logoSrc = "/lovable-uploads/980af2e4-e2b9-40ac-9432-710c55cd00a8.png";
  
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
          console.warn('Logo failed to load:', logoSrc);
          // Fallback to a simple text logo if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.logo-fallback')) {
            const fallback = document.createElement('div');
            fallback.className = 'logo-fallback text-2xl font-bold text-purple-600';
            fallback.textContent = 'MusicGift.ro';
            parent.appendChild(fallback);
          }
        }}
      />
    </picture>
  );
};

export default OptimizedLogo;
