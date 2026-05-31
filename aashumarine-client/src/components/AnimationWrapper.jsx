import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './AnimationWrapper.css';

/**
 * AnimationWrapper - A reusable component for scroll-triggered entrance animations
 * 
 * Features:
 * - Triggers animation when element enters viewport using Intersection Observer
 * - Single trigger (doesn't re-animate on scroll)
 * - Respects prefers-reduced-motion user preferences
 * - Supports multiple animation types: fade-in, slide-up, slide-left, slide-right
 * - Configurable duration, delay, and threshold
 */
const AnimationWrapper = ({
  children,
  animationType = 'fade-in',
  duration = 600,
  delay = 0,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If user prefers reduced motion, show content immediately without animation
    if (prefersReducedMotion) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    // If already animated, don't set up observer again
    if (hasAnimated) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
            // Disconnect observer after animation triggers (single trigger)
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [threshold, hasAnimated]);

  const animationClass = isVisible ? `animation-${animationType} animation-visible` : `animation-${animationType}`;

  return (
    <div
      ref={elementRef}
      className={animationClass}
      style={{
        '--animation-duration': `${duration}ms`,
        '--animation-delay': `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

AnimationWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  animationType: PropTypes.oneOf(['fade-in', 'slide-up', 'slide-left', 'slide-right']),
  duration: PropTypes.number,
  delay: PropTypes.number,
  threshold: PropTypes.number,
};

export default AnimationWrapper;
