/**
 * LoginPage Property-Based Tests
 * 
 * Property-based tests for the LoginPage component using fast-check.
 * Tests universal properties across randomized inputs.
 * 
 * Note: These tests use reduced iterations (20) for practical execution time
 * while still providing good coverage of the input space.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import fc from 'fast-check';
import { AuthContext } from '../context/AuthContext';
import LoginPage from './LoginPage';

// Property test configuration - reduced iterations for practical execution time
const propertyTestConfig = {
  numRuns: 20,
  verbose: true,
};

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

describe('LoginPage Property-Based Tests', () => {
  const mockLogin = vi.fn();
  const mockAuthContext = {
    login: mockLogin,
    isAuthenticated: false,
    isLoading: false,
    user: null,
    logout: vi.fn(),
    checkAuth: vi.fn(),
  };

  const renderLoginPage = (authContext = mockAuthContext) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    cleanup();
  });

  /**
   * Property 1: Authentication Token Storage
   * 
   * For any successful login with valid credentials, the JWT token returned by the API
   * should be stored in localStorage and the user should be redirected to the dashboard.
   * 
   * **Validates: Requirements 1.2, 1.3, 1.4**
   */
  it('Property 1: stores JWT token and redirects on successful login', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 6, maxLength: 15 }).filter(s => !/[{}\[\]\\]/.test(s) && s.trim().length > 0),
        fc.string({ minLength: 20, maxLength: 50 }),
        async (email, password, token) => {
          // Setup for this iteration
          cleanup();
          vi.clearAllMocks();
          localStorage.clear();
          mockNavigate.mockClear();

          // Mock successful login
          mockLogin.mockImplementation(async () => {
            localStorage.setItem('jwt_token', token);
          });

          const user = userEvent.setup();
          renderLoginPage();

          // Fill in form
          await user.type(screen.getByLabelText(/email/i), email);
          await user.type(screen.getByLabelText(/password/i), password);
          await user.click(screen.getByRole('button', { name: /sign in/i }));

          // Wait for login to complete
          await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(email, password);
          }, { timeout: 3000 });

          // Verify token is stored
          expect(localStorage.getItem('jwt_token')).toBe(token);

          // Verify redirect to dashboard
          await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true });
          }, { timeout: 3000 });
        }
      ),
      propertyTestConfig
    );
  }, 120000); // 2 minute timeout

  /**
   * Property 2: Authentication Failure Handling
   * 
   * For any login attempt with invalid credentials, the system should display an error
   * message and not store any token in localStorage.
   * 
   * **Validates: Requirements 1.5**
   */
  it('Property 2: displays error and does not store token on failed login', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 6, maxLength: 15 }).filter(s => !/[{}\[\]\\]/.test(s) && s.trim().length > 0),
        fc.constantFrom('Invalid credentials', 'Authentication failed', 'Incorrect email or password'),
        async (email, password, errorMessage) => {
          // Setup for this iteration
          cleanup();
          vi.clearAllMocks();
          localStorage.clear();
          mockNavigate.mockClear();

          // Mock failed login
          mockLogin.mockRejectedValue(new Error(errorMessage));

          const user = userEvent.setup();
          renderLoginPage();

          // Fill in form
          await user.type(screen.getByLabelText(/email/i), email);
          await user.type(screen.getByLabelText(/password/i), password);
          await user.click(screen.getByRole('button', { name: /sign in/i }));

          // Wait for error to appear
          await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
          }, { timeout: 3000 });

          // Verify no token is stored
          expect(localStorage.getItem('jwt_token')).toBeNull();

          // Verify no redirect occurred
          expect(mockNavigate).not.toHaveBeenCalled();
        }
      ),
      propertyTestConfig
    );
  }, 120000); // 2 minute timeout

  /**
   * Property 3: Email Validation
   * 
   * For any string input to an email field, the system should only accept strings that
   * match valid email format (contains @ symbol with text before and after, and a domain extension).
   * 
   * **Validates: Requirements 1.6**
   */
  it('Property 3: validates email format correctly - valid emails', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 6, maxLength: 15 }).filter(s => !/[{}\[\]\\]/.test(s) && s.trim().length > 0),
        async (validEmail, password) => {
          // Setup for this iteration
          cleanup();
          vi.clearAllMocks();
          mockNavigate.mockClear();

          const user = userEvent.setup();
          renderLoginPage();

          // Fill in form with valid email
          await user.type(screen.getByLabelText(/email/i), validEmail);
          await user.type(screen.getByLabelText(/password/i), password);
          await user.click(screen.getByRole('button', { name: /sign in/i }));

          // Should not show email validation error
          await waitFor(() => {
            expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
          }, { timeout: 2000 });
        }
      ),
      propertyTestConfig
    );
  }, 120000); // 2 minute timeout

  /**
   * Property 3b: Email Validation - invalid emails
   * 
   * **Validates: Requirements 1.6**
   */
  it('Property 3b: validates email format correctly - invalid emails', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 15 }).filter(s => !s.includes('@') && !/[{}\[\]\\]/.test(s)),
        async (invalidEmail) => {
          // Setup for this iteration
          cleanup();
          vi.clearAllMocks();
          mockNavigate.mockClear();

          const user = userEvent.setup();
          renderLoginPage();

          // Fill in form with invalid email
          await user.type(screen.getByLabelText(/email/i), invalidEmail);
          await user.click(screen.getByRole('button', { name: /sign in/i }));

          // Should show email validation error
          await waitFor(() => {
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
          }, { timeout: 2000 });

          // Should not call login
          expect(mockLogin).not.toHaveBeenCalled();
        }
      ),
      propertyTestConfig
    );
  }, 120000); // 2 minute timeout

  /**
   * Property 18: Required Field Validation
   * 
   * For any form with required fields, attempting to submit the form with empty required
   * fields should prevent submission and display validation error messages.
   * 
   * **Validates: Requirements 1.7, 37.1**
   */
  it('Property 18: prevents submission with empty email field', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 6, maxLength: 15 }).filter(s => !/[{}\[\]\\]/.test(s) && s.trim().length > 0),
        async (password) => {
          // Setup for this iteration
          cleanup();
          vi.clearAllMocks();
          mockNavigate.mockClear();

          const user = userEvent.setup();
          renderLoginPage();

          // Fill in only password, leave email empty
          await user.type(screen.getByLabelText(/password/i), password);
          await user.click(screen.getByRole('button', { name: /sign in/i }));

          // Should show email required error
          await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
          }, { timeout: 2000 });

          // Should not call login
          expect(mockLogin).not.toHaveBeenCalled();
        }
      ),
      propertyTestConfig
    );
  }, 120000); // 2 minute timeout

  /**
   * Property 18b: Required Field Validation - empty password
   * 
   * **Validates: Requirements 1.7, 37.1**
   */
  it('Property 18b: prevents submission with empty password field', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Setup for this iteration
          cleanup();
          vi.clearAllMocks();
          mockNavigate.mockClear();

          const user = userEvent.setup();
          renderLoginPage();

          // Fill in only email, leave password empty
          await user.type(screen.getByLabelText(/email/i), email);
          await user.click(screen.getByRole('button', { name: /sign in/i }));

          // Should show password required error
          await waitFor(() => {
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
          }, { timeout: 2000 });

          // Should not call login
          expect(mockLogin).not.toHaveBeenCalled();
        }
      ),
      propertyTestConfig
    );
  }, 120000); // 2 minute timeout
});
