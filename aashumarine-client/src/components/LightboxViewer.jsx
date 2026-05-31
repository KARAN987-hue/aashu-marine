import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './LightboxViewer.css';

import { createPortal } from "react-dom";

/**
 * LightboxViewer component displays images and videos in full-screen mode with navigation
 * Features:
 * - Full-screen modal overlay
 * - Close button (cross icon) in top-right corner
 * - Previous and next navigation buttons
 * - Keyboard navigation (Escape to close, arrow keys for navigation)
 * - Circular navigation (last to first, first to last)
 * - Prevents background page scrolling when open
 * - Accessible with focus management and focus trap
 * - Supports both images and videos
 */
const LightboxViewer = ({ mediaItems, images, initialIndex = 0, isOpen, onClose, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const closeButtonRef = useRef(null);
  const previousButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const videoRef = useRef(null);

  // Support both new mediaItems prop and legacy images prop
  let items = [];
  if (mediaItems && Array.isArray(mediaItems)) {
    items = mediaItems;
  } else if (images) {
    // Legacy support: convert images to mediaItems format
    const imageArray = Array.isArray(images) ? images : [images];
    items = imageArray.map(url => ({ type: 'image', url }));
  }

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Navigate to next item (circular)
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  // Navigate to previous item (circular)
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  }, [items.length]);

  // Pause video when navigating away
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'Tab':
          // Handle focus trap
          e.preventDefault();
          handleTabNavigation(e.shiftKey);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrevious]);

  // Set focus to close button when lightbox opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle Tab navigation for focus trap
  const handleTabNavigation = (shiftKey) => {
    const focusableElements = [
      closeButtonRef.current,
      previousButtonRef.current,
      nextButtonRef.current
    ].filter(Boolean);

    if (focusableElements.length === 0) return;

    const currentFocusIndex = focusableElements.findIndex(
      (el) => el === document.activeElement
    );

    let nextIndex;
    if (shiftKey) {
      nextIndex = currentFocusIndex <= 0
        ? focusableElements.length - 1
        : currentFocusIndex - 1;
    } else {
      nextIndex = currentFocusIndex >= focusableElements.length - 1
        ? 0
        : currentFocusIndex + 1;
    }

    focusableElements[nextIndex].focus();
  };

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentItem = items[currentIndex];

  return createPortal(
    <div
      className="lightbox-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      <div className="lightbox-container">
        {/* Close button */}
        <button
          ref={closeButtonRef}
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close media viewer"
          type="button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Media display */}
        <div className="lightbox-image-container">
          {currentItem && currentItem.type === 'video' ? (
            <video
              ref={videoRef}
              className="lightbox-video"
              controls
              autoPlay
              aria-label={`${productName} product video ${currentIndex + 1} of ${items.length}`}
            >
              <source src={currentItem.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={currentItem?.url}
              alt={`${productName} - Image ${currentIndex + 1} of ${items.length}`}
              className="lightbox-image"
            />
          )}
        </div>

        {/* Navigation buttons - only show if multiple items */}
        {items.length > 1 && (
          <>
            <button
              ref={previousButtonRef}
              className="lightbox-nav lightbox-nav-prev"
              onClick={handlePrevious}
              aria-label="Previous item"
              type="button"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              ref={nextButtonRef}
              className="lightbox-nav lightbox-nav-next"
              onClick={handleNext}
              aria-label="Next item"
              type="button"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Media counter */}
        {items.length > 1 && (
          <div className="lightbox-counter" aria-live="polite" aria-atomic="true">
            {currentIndex + 1} / {items.length}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

LightboxViewer.propTypes = {
  mediaItems: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['image', 'video']).isRequired,
    url: PropTypes.string.isRequired
  })),
  images: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  initialIndex: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productName: PropTypes.string.isRequired,
};

export default LightboxViewer;
