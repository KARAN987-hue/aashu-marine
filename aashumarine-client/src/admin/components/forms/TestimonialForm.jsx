import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { validateTestimonial, hasErrors } from '../../utils/validation';
import './TestimonialForm.css';

export function TestimonialForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    text: '',
    rating: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with initial data for edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        text: initialData.text || '',
        rating: initialData.rating !== undefined ? initialData.rating : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    // Validate single field on blur
    const fieldErrors = validateTestimonial({ ...formData, [name]: formData[name] });
    if (fieldErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateTestimonial(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert rating to number
      const submitData = {
        ...formData,
        rating: Number(formData.rating),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="testimonial-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <Input
            label="Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            placeholder="Enter customer name"
          />
        </div>

        <div className="form-field">
          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name (optional)"
          />
        </div>

        <div className="form-field full-width">
          <label htmlFor="text" className="form-label">
            Feedback Text *
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-textarea ${errors.text ? 'error' : ''}`}
            rows="5"
            placeholder="Enter customer feedback"
          />
          {errors.text && <span className="field-error">{errors.text}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="rating" className="form-label">
            Rating (1-5) *
          </label>
          <div className="rating-input">
            <input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errors.rating ? 'error' : ''}`}
              placeholder="1-5"
            />
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${formData.rating >= star ? 'filled' : ''}`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, rating: star }));
                    if (errors.rating) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.rating;
                        return newErrors;
                      });
                    }
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          {errors.rating && <span className="field-error">{errors.rating}</span>}
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {initialData ? 'Update Testimonial' : 'Create Testimonial'}
        </Button>
      </div>
    </form>
  );
}
