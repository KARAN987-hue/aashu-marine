/**
 * PasswordChangeForm Component
 * 
 * Form for changing user password with validation.
 * 
 * Requirements: 33.5, 37.6
 */

import { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { validatePasswordChange, hasErrors } from '../../utils/validation';
import './PasswordChangeForm.css';

export function PasswordChangeForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const fieldErrors = validatePasswordChange(formData);
    
    if (fieldErrors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validatePasswordChange(formData);
    
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      // Reset form on success
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      // Error handling is done by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="password-change-form" onSubmit={handleSubmit}>
      <Input
        label="Current Password"
        type="password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.currentPassword}
        required
        autoComplete="current-password"
      />

      <Input
        label="New Password"
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.newPassword}
        helpText="Must be at least 6 characters"
        required
        autoComplete="new-password"
      />

      <Input
        label="Confirm New Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.confirmPassword}
        required
        autoComplete="new-password"
      />

      <div className="password-change-form-actions">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Change Password
        </Button>
      </div>
    </form>
  );
}

export default PasswordChangeForm;
