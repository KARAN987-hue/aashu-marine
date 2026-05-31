/**
 * LoginPage Component
 * 
 * Admin login page for authentication.
 * Provides email/password form with validation and error handling.
 * Redirects to dashboard on successful login or if already authenticated.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Redirect to dashboard if already authenticated (Requirement 1.8)
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  /**
   * Validate email format (Requirement 1.6)
   */
  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  /**
   * Validate password is not empty (Requirement 1.7)
   */
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    return '';
  };

  /**
   * Validate all form fields
   */
  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    return !emailError && !passwordError;
  };

  /**
   * Handle input changes
   */
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
    
    // Clear auth error when user modifies form
    if (authError) {
      setAuthError('');
    }
  };

  /**
   * Handle form submission (Requirements 1.2, 1.3, 1.4, 1.5)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous auth error
    setAuthError('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Attempt login (Requirement 1.2)
      await login(formData.email, formData.password);
      
      // On success, redirect to dashboard or preserved route (Requirement 1.4)
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      // Display error message on authentication failure (Requirement 1.5)
      setAuthError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return null;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <header className="login-header">
            <h1>Admin Login</h1>
            <p>Sign in to access the admin panel</p>
          </header>
          
          <form onSubmit={handleSubmit} className="login-form" noValidate aria-labelledby="login-heading">
            <h2 id="login-heading" className="visually-hidden">Login Form</h2>
            
            {authError && (
              <div className="login-error-banner" role="alert" aria-live="assertive">
                {authError}
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              disabled={isSubmitting}
              placeholder="admin@example.com"
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              disabled={isSubmitting}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-required="true"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            
            <Button
              type="submit"
              variant="primary"
              size="large"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              style={{ width: '100%' }}
              aria-label={isSubmitting ? 'Signing in, please wait' : 'Sign in to admin panel'}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
