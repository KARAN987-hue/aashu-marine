import { useState } from 'react';
import './Quote_Request_Form.css';

const Quote_Request_Form = ({ onSubmit, productName, productId, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true
    });

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, prepare data with source information
      const quoteData = {
        ...formData,
        source: `Product Detail - ${productName}`,
        productId: productId
      };

      // Call onSubmit callback
      onSubmit(quoteData);

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      // Clear errors and touched state
      setErrors({});
      setTouched({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="quote-request-form-container">
      <h3 className="quote-form-heading">Request a Quote</h3>
      <form className="quote-request-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="quote-name">
            Name <span aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="quote-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name && touched.name ? 'error' : ''}
            aria-required="true"
            aria-invalid={errors.name && touched.name ? 'true' : 'false'}
            aria-describedby={errors.name && touched.name ? 'quote-name-error' : undefined}
          />
          {errors.name && touched.name && (
            <span className="error-message" id="quote-name-error" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="quote-email">
            Email <span aria-label="required">*</span>
          </label>
          <input
            type="email"
            id="quote-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? 'error' : ''}
            aria-required="true"
            aria-invalid={errors.email && touched.email ? 'true' : 'false'}
            aria-describedby={errors.email && touched.email ? 'quote-email-error' : undefined}
          />
          {errors.email && touched.email && (
            <span className="error-message" id="quote-email-error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="quote-phone">Phone</label>
          <input
            type="tel"
            id="quote-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="false"
          />
        </div>

        <div className="form-group">
          <label htmlFor="quote-message">Message</label>
          <textarea
            id="quote-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="3"
            aria-required="false"
          />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Request Quote'}
        </button>
      </form>
    </div>
  );
};

export default Quote_Request_Form;
