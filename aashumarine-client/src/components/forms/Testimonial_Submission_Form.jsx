import { useState } from 'react';
import './Testimonial_Submission_Form.css';

/**
 * Testimonial_Submission_Form Component
 * 
 * Public form for customers to submit testimonials.
 * Includes star rating input, name, company, and feedback fields.
 * 
 * @param {Function} onSubmit - Callback function when form is submitted
 * @param {boolean} isSubmitting - Loading state during submission
 * @param {boolean} showDescription - Whether to show the description section (default true)
 */
const Testimonial_Submission_Form = ({ onSubmit, isSubmitting = false, showDescription = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    feedback: '',
    rating: 0
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hoveredRating, setHoveredRating] = useState(0);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    } else if (formData.feedback.trim().length < 10) {
      newErrors.feedback = 'Feedback must be at least 10 characters';
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));

    // Clear rating error when user selects a rating
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }

    // Mark rating as touched
    setTouched(prev => ({
      ...prev,
      rating: true
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      company: true,
      feedback: true,
      rating: true
    });

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, call onSubmit callback
      onSubmit(formData);

      // Clear form after successful submission
      setFormData({
        name: '',
        company: '',
        feedback: '',
        rating: 0
      });

      // Clear errors and touched state
      setErrors({});
      setTouched({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="testimonial-form-container">
      <form className="testimonial-submission-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
        <label htmlFor="testimonial-name">
          Name <span aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="testimonial-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.name && touched.name ? 'error' : ''}
          aria-required="true"
          aria-invalid={errors.name && touched.name ? 'true' : 'false'}
          aria-describedby={errors.name && touched.name ? 'testimonial-name-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.name && touched.name && (
          <span className="error-message" id="testimonial-name-error" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="testimonial-company">Company</label>
        <input
          type="text"
          id="testimonial-company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-required="false"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="testimonial-feedback">
          Your Feedback <span aria-label="required">*</span>
        </label>
        <textarea
          id="testimonial-feedback"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="5"
          className={errors.feedback && touched.feedback ? 'error' : ''}
          aria-required="true"
          aria-invalid={errors.feedback && touched.feedback ? 'true' : 'false'}
          aria-describedby={errors.feedback && touched.feedback ? 'testimonial-feedback-error' : undefined}
          disabled={isSubmitting}
          placeholder="Share your experience with our products and services..."
        />
        {errors.feedback && touched.feedback && (
          <span className="error-message" id="testimonial-feedback-error" role="alert">
            {errors.feedback}
          </span>
        )}
      </div>

      <div className="form-group">
        <label id="rating-label">
          Rating <span aria-label="required">*</span>
        </label>
        <div 
          className="star-rating"
          role="radiogroup"
          aria-labelledby="rating-label"
          aria-required="true"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${star <= (hoveredRating || formData.rating) ? 'filled' : ''}`}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              aria-label={`Rate ${star} out of 5 stars`}
              aria-checked={formData.rating === star}
              role="radio"
              disabled={isSubmitting}
            >
              ★
            </button>
          ))}
        </div>
        {errors.rating && touched.rating && (
          <span className="error-message" id="rating-error" role="alert">
            {errors.rating}
          </span>
        )}
      </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
        </button>
      </form>

      {showDescription && (
        <div className="testimonial-description">
          <h3>Share Your Experience</h3>
          <p>
            Your feedback helps us improve our services and assists other customers in making informed decisions.
          </p>
          <div className="description-points">
            <div className="description-point">
              <span className="point-icon">✓</span>
              <span>Share your honest experience with our products and services</span>
            </div>
            <div className="description-point">
              <span className="point-icon">✓</span>
              <span>Help other customers make informed decisions</span>
            </div>
            <div className="description-point">
              <span className="point-icon">✓</span>
              <span>Your testimonial will be reviewed before publication</span>
            </div>
          </div>
          <p className="description-note">
            All testimonials are reviewed to ensure authenticity and relevance. We appreciate your time and feedback!
          </p>
        </div>
      )}
    </div>
  );
};

export default Testimonial_Submission_Form;
