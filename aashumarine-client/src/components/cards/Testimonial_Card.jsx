import React from 'react';
import PropTypes from 'prop-types';
import './Testimonial_Card.css';

/**
 * Truncates text to a maximum number of words and appends ellipsis if truncated
 * @param {string} text - The text to truncate
 * @param {number} maxWords - Maximum number of words (default: 24)
 * @returns {string} - Truncated text with ellipsis if needed
 */
const truncateText = (text, maxWords = 24) => {
  if (!text) return '';
  
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  
  return words.slice(0, maxWords).join(' ') + '...';
};

/**
 * Testimonial_Card component displays a single customer testimonial
 * with truncated text, customer name, company, and rating
 * 
 * Requirements: 3.1, 3.3, 3.4
 */
const Testimonial_Card = ({ 
  name, 
  company, 
  text, 
  rating,
  maxWords = 24 
}) => {
  const truncatedText = truncateText(text, maxWords);
  
  return (
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p className="testimonial-text">"{truncatedText}"</p>
      </div>
      <div className="testimonial-author">
        <div className="author-info">
          <p className="author-name">{name}</p>
          {company && (
            <p className="author-company">{company}</p>
          )}
        </div>
        {rating && (
          <div 
            className="testimonial-rating" 
            role="img" 
            aria-label={`Rating: ${rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={`star ${index < rating ? 'filled' : 'empty'}`}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Testimonial_Card.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string,
  text: PropTypes.string.isRequired,
  rating: PropTypes.number,
  maxWords: PropTypes.number
};

export default Testimonial_Card;
export { truncateText };
