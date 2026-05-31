import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import LightboxViewer from './LightboxViewer';
import './ProductGallery.css';

/**
 * ProductGallery component displays an auto-scrolling image/video gallery for products
 * Features:
 * - Auto-advances every 5 seconds (configurable)
 * - CSS scroll-snap for smooth transitions
 * - Navigation arrows with pause on interaction
 * - Thumbnail navigation below main image
 * - Keyboard navigation (arrow keys)
 * - Lightbox modal on image click
 * - Video playback support with auto-scroll pause
 * - Lazy loading for images
 * - Full accessibility support
 * 
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9
 */
const ProductGallery = ({
  images,
  video,      // Keep for backward compatibility
  videos,     // Add new prop for multiple videos
  productName,
  autoScrollInterval = 5000,
  onImageClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const intervalRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const videoRef = useRef(null);

  // Normalize images to array format and combine with video
  const imageArray = Array.isArray(images) ? images : images ? [images] : [];
  let videoArray = [];
  if (videos && Array.isArray(videos)) {
    videoArray = videos;
  } else if (video) {
    videoArray = [video];
  }
  // Combine videos and images into mediaItems (videos first, then images)
  const videoItems = videoArray.map(url => ({ type: 'video', url }));
  const imageItems = imageArray.map(url => ({ type: 'image', url }));
  const mediaItems = [...videoItems, ...imageItems];

  const hasMultipleItems = mediaItems.length > 1;

  // Placeholder SVG for missing images
  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='%23999'%3ENo Image Available%3C/text%3E%3C/svg%3E`;

  // Scroll to specific index using scroll-snap
  const scrollToIndex = useCallback((index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.offsetWidth;
      container.scrollTo({
        left: itemWidth * index,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  }, []);

  // Auto-advance functionality (Requirement 9.5)
  useEffect(() => {
    // Only auto-advance if there are multiple items, not paused, and video is not playing
    if (!hasMultipleItems || isPaused || isVideoPlaying) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % mediaItems.length;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, autoScrollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasMultipleItems, isPaused, isVideoPlaying, mediaItems.length, autoScrollInterval, scrollToIndex]);

  // Handle keyboard navigation (Requirement 9.4)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasMultipleItems) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? mediaItems.length - 1 : currentIndex - 1;
        scrollToIndex(prevIndex);
        setIsPaused(true); // Pause on interaction (Requirement 9.7)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % mediaItems.length;
        scrollToIndex(nextIndex);
        setIsPaused(true); // Pause on interaction (Requirement 9.7)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasMultipleItems, mediaItems.length, scrollToIndex]);

  // Handle video play/pause events (Requirement 9.8)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    const handleEnded = () => setIsVideoPlaying(false);

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Navigation arrow handlers (Requirement 9.4, 9.7)
  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? mediaItems.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
    setIsPaused(true); // Pause on arrow click
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % mediaItems.length;
    scrollToIndex(nextIndex);
    setIsPaused(true); // Pause on arrow click
  };

  // Thumbnail click handler (Requirement 9.4)
  const handleThumbnailClick = (index) => {
    scrollToIndex(index);
    setIsPaused(true); // Pause on interaction
  };

  // Image click handler for lightbox (Requirement 9.6)
  const handleImageClick = (index) => {
    if (onImageClick) {
      onImageClick(index);
    }
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Video interaction handler (Requirement 11.5)
  const handleVideoInteraction = () => {
    if (!videoLoaded) {
      setVideoLoaded(true);
    }
  };

  // Close lightbox (Requirement 9.9)
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  // If no media items, show placeholder
  if (mediaItems.length === 0) {
    return (
      <div className="product-gallery">
        <div className="gallery-main-container">
          <img
            src={placeholderSvg}
            alt={`${productName} - No image available`}
            className="gallery-image"
          />
        </div>
      </div>
    );
  }

  // Get only image items for lightbox
  // OLD:
  const imageOnlyItems = mediaItems.filter(item => item.type === 'image').map(item => item.url);

  // NEW - pass all media items instead of filtering:
  // (Remove this line entirely, we'll pass mediaItems directly)

  return (
    <div className="product-gallery">
      {/* Main gallery with scroll-snap (Requirement 9.3) */}
      <div className="gallery-main-wrapper">
        {/* Previous arrow (Requirement 9.4) */}
        {hasMultipleItems && (
          <button
            className="gallery-arrow gallery-arrow-prev"
            onClick={handlePrevious}
            aria-label="Previous image"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Scroll container with CSS scroll-snap (Requirement 9.3) */}
        <div
          className="gallery-scroll-container"
          ref={scrollContainerRef}
          role="region"
          aria-label="Product images"
        >
          {mediaItems.map((item, index) => (
            <div key={index} className="gallery-slide">
              {item.type === 'video' ? (
                // Video support with deferred loading (Requirements 9.8, 11.5)
                <div className="gallery-video-container">
                  {!videoLoaded ? (
                    // Video poster with play button overlay
                    <div
                      className="gallery-video-poster"
                      onClick={handleVideoInteraction}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleVideoInteraction();
                        }
                      }}
                      aria-label="Load and play video"
                    >
                      <div className="video-poster-overlay">
                        <svg
                          className="video-play-icon"
                          width="80"
                          height="80"
                          viewBox="0 0 80 80"
                          fill="none"
                        >
                          <circle cx="40" cy="40" r="40" fill="rgba(0, 0, 0, 0.7)" />
                          <polygon points="30,20 30,60 60,40" fill="white" />
                        </svg>
                        <span className="video-poster-text">Click to load video</span>
                      </div>
                    </div>
                  ) : (
                    // Actual video element loaded on interaction
                    <video
                      ref={videoRef}
                      className="gallery-video"
                      controls
                      preload="metadata"
                      autoPlay
                      aria-label={`${productName} product video`}
                    >
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : (
                // Image with lazy loading (Requirement 9.9)
                <img
                  src={item.url}
                  alt={`${productName} - Image ${index + 1} of ${mediaItems.length}`}
                  className="gallery-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onClick={() => handleImageClick(index)}
                  style={{ cursor: 'pointer' }}
                  onError={(e) => { e.target.src = placeholderSvg; }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Next arrow (Requirement 9.4) */}
        {hasMultipleItems && (
          <button
            className="gallery-arrow gallery-arrow-next"
            onClick={handleNext}
            aria-label="Next image"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail navigation (Requirement 9.4) */}
      {hasMultipleItems && (
        <div className="gallery-thumbnails" role="tablist" aria-label="Image thumbnails">
          {mediaItems.map((item, index) => (
            <button
              key={index}
              className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={item.type === 'video' ? `View video` : `View image ${index + 1} of ${mediaItems.length}`}
              aria-selected={index === currentIndex}
              role="tab"
              type="button"
            >
              {item.type === 'video' ? (
                <div className="thumbnail-video-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt=""
                  loading="lazy"
                  onError={(e) => { e.target.src = placeholderSvg; }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Aria-live region for screen reader announcements */}
      {hasMultipleItems && (
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing {mediaItems[currentIndex].type === 'video' ? 'video' : `image ${currentIndex + 1}`} of {mediaItems.length}
        </div>
      )}

      {/* Lightbox modal (Requirement 9.6, 9.9) */}
      {mediaItems.length > 0 && (
        <LightboxViewer
          mediaItems={mediaItems}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={handleCloseLightbox}
          productName={productName}
        />
      )}

    </div>
  );
};

ProductGallery.propTypes = {
  images: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  video: PropTypes.string,  // Single video (backward compatibility)
  videos: PropTypes.arrayOf(PropTypes.string),  // Multiple videos
  productName: PropTypes.string.isRequired,
  autoScrollInterval: PropTypes.number,
  onImageClick: PropTypes.func
};


export default ProductGallery;
