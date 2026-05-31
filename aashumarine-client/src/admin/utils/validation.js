/**
 * Validation utility functions for form inputs
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} - Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validates numeric field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} - Error message or null if valid
 */
export const validateNumeric = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    return null; // Allow empty values (use validateRequired separately if needed)
  }
  
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return `${fieldName} must be a valid number`;
  }
  
  return null;
};

/**
 * Validates rating value (1-5)
 * @param {any} value - Rating value to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateRating = (value) => {
  if (value === null || value === undefined || value === '') {
    return null; // Allow empty values
  }
  
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'Rating must be a valid number';
  }
  
  if (numValue < 1 || numValue > 5) {
    return 'Rating must be between 1 and 5';
  }
  
  return null;
};

/**
 * Validates product data
 * @param {object} data - Product data to validate
 * @returns {object} - Object with field names as keys and error messages as values
 */
export const validateProduct = (data) => {
  const errors = {};

  // Required fields
  const productNameError = validateRequired(data.product_name, 'Product name');
  if (productNameError) errors.product_name = productNameError;

  const categoryError = validateRequired(data.category, 'Category');
  if (categoryError) errors.category = categoryError;

  const manufacturerError = validateRequired(data.manufacturer, 'Manufacturer');
  if (manufacturerError) errors.manufacturer = manufacturerError;

  const conditionError = validateRequired(data.condition, 'Condition');
  if (conditionError) errors.condition = conditionError;

  // Numeric fields
  const priceError = validateNumeric(data.price, 'Price');
  if (priceError) errors.price = priceError;

  const stockError = validateNumeric(data.stock_quantity, 'Stock quantity');
  if (stockError) errors.stock_quantity = stockError;

  return errors;
};

/**
 * Validates testimonial data
 * @param {object} data - Testimonial data to validate
 * @returns {object} - Object with field names as keys and error messages as values
 */
export const validateTestimonial = (data) => {
  const errors = {};

  // Required fields
  const nameError = validateRequired(data.name, 'Name');
  if (nameError) errors.name = nameError;

  const textError = validateRequired(data.text, 'Feedback text');
  if (textError) errors.text = textError;

  const ratingError = validateRequired(data.rating, 'Rating');
  if (ratingError) {
    errors.rating = ratingError;
  } else {
    // Validate rating range
    const ratingRangeError = validateRating(data.rating);
    if (ratingRangeError) errors.rating = ratingRangeError;
  }

  return errors;
};

/**
 * Validates password change data
 * @param {object} data - Password change data to validate
 * @returns {object} - Object with field names as keys and error messages as values
 */
export const validatePasswordChange = (data) => {
  const errors = {};

  // Required fields
  const currentPasswordError = validateRequired(data.currentPassword, 'Current password');
  if (currentPasswordError) errors.currentPassword = currentPasswordError;

  const newPasswordError = validateRequired(data.newPassword, 'New password');
  if (newPasswordError) {
    errors.newPassword = newPasswordError;
  } else if (data.newPassword.length < 6) {
    errors.newPassword = 'New password must be at least 6 characters';
  }

  const confirmPasswordError = validateRequired(data.confirmPassword, 'Confirm password');
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

/**
 * Checks if an errors object has any errors
 * @param {object} errors - Errors object
 * @returns {boolean} - True if there are errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
