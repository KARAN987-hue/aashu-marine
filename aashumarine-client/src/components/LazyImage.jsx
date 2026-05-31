import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './LazyImage.css';

/**
 * LazyImage component with Intersection Observer for lazy loading
 * Provides loading placeholders for better UX
 * 
 * Validates: Requirements 11.3
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderColor = '#f0f0f0',
  eager = false,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (eager || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [eager]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  // Generate placeholder SVG
  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(placeholderColor)}'/%3E%3C/svg%3E`;

  return (
    <div 
      ref={imgRef} 
      className={`lazy-image-container ${className} ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`}
      {...props}
    >
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="lazy-image-placeholder" aria-hidden="true">
          <div className="lazy-image-spinner"></div>
        </div>
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'visible' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={eager ? 'eager' : 'lazy'}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="lazy-image-error" role="img" aria-label={alt}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="sr-only">{alt}</span>
        </div>
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholderColor: PropTypes.string,
  eager: PropTypes.bool,
  onError: PropTypes.func
};

export default LazyImage;
