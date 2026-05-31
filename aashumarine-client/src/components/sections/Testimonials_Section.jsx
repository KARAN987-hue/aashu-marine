import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Testimonial_Card from '../cards/Testimonial_Card';
import './Testimonials_Section.css';

/**
 * Testimonials_Section component displays customer testimonials
 * in either a grid layout or slider layout with navigation controls
 * 
 * Requirements: 3.2, 3.5
 */
const Testimonials_Section = ({ 
  testimonials = [], 
  layout = 'slider',
  maxWords = 24 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  // Calculate how many cards to show at once based on viewport
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Keyboard navigation for slider
  useEffect(() => {
    if (layout !== 'slider') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('keydown', handleKeyDown);
      return () => slider.removeEventListener('keydown', handleKeyDown);
    }
  }, [layout, currentIndex, maxIndex]);

  if (testimonials.length === 0) {
    return (
      <section className="testimonials-section" aria-labelledby="testimonials-heading">
        <div className="testimonials-container">
          <h2 id="testimonials-heading" className="testimonials-heading">TESTIMONIALS</h2>
          <p className="testimonials-empty">No testimonials available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials-section" aria-labelledby="testimonials-heading">
      <div className="testimonials-container">
        <h2 id="testimonials-heading" className="testimonials-heading">TESTIMONIALS</h2>
        <p className="testimonials-subheading">What Our Clients Say</p>
        
        {layout === 'grid' ? (
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <Testimonial_Card
                key={testimonial.id}
                name={testimonial.name}
                company={testimonial.company}
                text={testimonial.text}
                rating={testimonial.rating}
                maxWords={maxWords}
              />
            ))}
          </div>
        ) : (
          <div className="testimonials-slider-wrapper">
            <div 
              className="testimonials-slider"
              ref={sliderRef}
              tabIndex={0}
              role="region"
              aria-label="Testimonials slider"
              aria-live="polite"
            >
              <div 
                className="testimonials-slider-track"
                style={{
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
                }}
              >
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="testimonials-slider-item"
                    style={{ flex: `0 0 ${100 / cardsPerView}%` }}
                  >
                    <Testimonial_Card
                      name={testimonial.name}
                      company={testimonial.company}
                      text={testimonial.text}
                      rating={testimonial.rating}
                      maxWords={maxWords}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {testimonials.length > cardsPerView && (
              <div className="testimonials-slider-controls">
                <button
                  className="slider-control slider-control-prev"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  aria-label="Previous testimonial"
                  type="button"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <div className="slider-indicators">
                  {Array.from({ length: maxIndex + 1 }, (_, index) => (
                    <button
                      key={index}
                      className={`slider-indicator ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={index === currentIndex ? 'true' : 'false'}
                      type="button"
                    />
                  ))}
                </div>
                <button
                  className="slider-control slider-control-next"
                  onClick={handleNext}
                  disabled={currentIndex === maxIndex}
                  aria-label="Next testimonial"
                  type="button"
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

Testimonials_Section.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      company: PropTypes.string,
      text: PropTypes.string.isRequired,
      rating: PropTypes.number
    })
  ),
  layout: PropTypes.oneOf(['grid', 'slider']),
  maxWords: PropTypes.number
};

export default Testimonials_Section;
