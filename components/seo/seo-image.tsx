import React, { Suspense } from 'react';
import Image from 'next/image';

export interface SEOImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * SEO-optimized Image Component
 * Extends Next.js Image with SEO best practices
 */
export function SEOImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
}: SEOImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={sizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  );
}

export interface LazyImageProps extends Omit<SEOImageProps, 'priority'> {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Lazy Loading Image Component with Intersection Observer
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  threshold = 0.1,
  rootMargin = '50px',
}: LazyImageProps) {
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={imgRef} className={className}>
      {isInView ? (
        <SEOImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: height,
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={`Loading ${alt}`}
        >
          <div className="animate-pulse bg-gray-300 rounded w-16 h-16" />
        </div>
      )}
    </div>
  );
}

/**
 * Generate optimized image URLs for different breakpoints
 */
export function generateImageSizes(baseWidth: number) {
  const breakpoints = [320, 640, 768, 1024, 1280, 1536];
  
  return breakpoints
    .filter(bp => bp <= baseWidth * 2) // Don't upscale beyond 2x
    .map(bp => `(max-width: ${bp}px) ${bp}px`)
    .join(', ') + `, ${baseWidth}px`;
}

/**
 * Create a simple blur data URL for placeholder
 */
export function createBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a simple gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | 'auto';
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Responsive Image Component with automatic sizing
 */
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = 'auto',
  sizes = '100vw',
  priority = false,
  className,
}: ResponsiveImageProps) {
  const aspectRatios = {
    square: 1,
    '16:9': 16 / 9,
    '4:3': 4 / 3,
    '3:2': 3 / 2,
    auto: undefined,
  };

  const ratio = aspectRatios[aspectRatio];

  return (
    <div className={`relative ${className || ''}`}>
      <Image
        src={src}
        alt={alt}
        fill={ratio !== undefined}
        width={ratio === undefined ? 800 : undefined}
        height={ratio === undefined ? 600 : undefined}
        sizes={sizes}
        priority={priority}
        style={{
          objectFit: 'cover',
          ...(ratio && { aspectRatio: ratio }),
        }}
      />
    </div>
  );
}

export interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  spacing?: number;
}

/**
 * SEO-optimized Image Gallery Component
 */
export function ImageGallery({
  images,
  columns = 3,
  spacing = 4,
}: ImageGalleryProps) {
  return (
    <div
      className={`grid gap-${spacing}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {images.map((image, index) => (
        <figure key={index} className="group">
          <Suspense
            fallback={
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded" />
            }
          >
            <LazyImage
              src={image.src}
              alt={image.alt}
              width={400}
              height={300}
              className="rounded-lg transition-transform group-hover:scale-105"
              sizes={`(max-width: 768px) 50vw, ${100 / columns}vw`}
            />
          </Suspense>
          {image.caption && (
            <figcaption className="mt-2 text-sm text-gray-600 text-center">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/**
 * Performance monitoring for images
 */
export function useImagePerformance() {
  const [metrics, setMetrics] = React.useState({
    lcp: 0,
    cls: 0,
    totalImages: 0,
    loadedImages: 0,
  });

  React.useEffect(() => {
    // Monitor Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceNavigationTiming;
        setMetrics(prev => ({ ...prev, lcp: lastEntry.loadEventEnd }));
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value: number;
          };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        lcpObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  return metrics;
}