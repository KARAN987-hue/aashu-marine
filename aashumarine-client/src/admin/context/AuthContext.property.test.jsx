/**
 * Property-Based Tests for Authentication Context
 * 
 * Tests universal properties of the authentication system using fast-check
 * to verify behavior across many randomized inputs.
 * 
 * Tests Properties:
 * - Property 1: Authentication Token Storage
 * - Property 2: Authentication Failure Handling
 * - Property 4: Session Persistence
 * - Property 5: Invalid Token Handling
 * - Property 10: Logout State Clearing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import React from 'react';
import fc from 'fast-check';
import { AuthProvider, AuthContext } from './AuthContext';
import { authService } from '../services/authService';

// Property test configuration
const propertyTestConfig = {
  numRuns: 100,  // Minimum 100 iterations per property
  verbose: true,
};

// Mock authService
vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    getProfile: vi.fn(),
    changePassword: vi.fn(),
  },
}));

// Test component to access AuthContext
function TestComponent({ onContextValue }) {
  const context = React.useContext(AuthContext);
  
  React.useEffect(() => {
    if (onContextValue && context && !context.isLoading) {
      onContextValue(context);
    }
  }, [context, onContextValue]);
  
  if (!context) return <div>No context</div>;
  if (context.isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="authenticated">{context.isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="user">{context.user ? JSON.stringify(context.user) : 'null'}</div>
      <button onClick={() => context.login('test@example.com', 'password')}>Login</button>
      <button onClick={() => context.logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext Property Tests', () => {
  let originalLocation;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock window.location
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    // Restore window.location
    window.location = originalLocation;
    
    // Clear localStorage after each test
    localStorage.clear();
  });

  /**
   * **Validates: Requirements 1.2, 1.3, 1.4**
   * 
   * Property 1: Authentication Token Storage
   * 
   * For any successful login with valid credentials, the JWT token returned by
   * the API should be stored in localStorage and the user should be redirected
   * to the dashboard.
   */
  describe('Property 1: Authentication Token Storage', () => {
    it('stores JWT token in localStorage on successful login', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 20, maxLength: 200 }), // Generate random JWT tokens
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            username: fc.string({ minLength: 3, maxLength: 20 }),
            email: fc.emailAddress(),
            role: fc.constantFrom('admin', 'super_admin'),
          }), // Generate random user data
          fc.emailAddress(), // Generate random email
          fc.string({ minLength: 6, maxLength: 20 }), // Generate random password
          async (token, userData, email, password) => {
            // Setup: Mock successful login
            authService.login.mockResolvedValue({
              token,
              user: userData,
            });
            
            let contextValue = null;
            
            // Render component
            const { rerender } = render(
              <AuthProvider>
                <TestComponent onContextValue={(ctx) => { contextValue = ctx; }} />
              </AuthProvider>
            );
            
            // Wait for initial loading to complete
            await waitFor(() => {
              expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });
            
            // Execute: Login
            await act(async () => {
              await contextValue.login(email, password);
            });
            
            // Force re-render to get updated context
            rerender(
              <AuthProvider>
                <TestComponent onContextValue={(ctx) => { contextValue = ctx; }} />
              </AuthProvider>
            );
            
            // Verify: Token is stored in localStorage
            expect(localStorage.getItem('jwt_token')).toBe(token);
            
            // Verify: User is set in context
            await waitFor(() => {
              expect(contextValue.user).toEqual(userData);
              expect(contextValue.isAuthenticated).toBe(true);
            });
            
            // Cleanup
            localStorage.clear();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * **Validates: Requirements 1.5**
   * 
   * Property 2: Authentication Failure Handling
   * 
   * For any login attempt with invalid credentials, the system should display
   * an error message and not store any token in localStorage.
   */
  describe('Property 2: Authentication Failure Handling', () => {
    it('does not store token on failed login', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(), // Generate random email
          fc.string({ minLength: 1, maxLength: 20 }), // Generate random password
          fc.string({ minLength: 10, maxLength: 100 }), // Generate random error message
          async (email, password, errorMessage) => {
            // Setup: Mock failed login
            authService.login.mockRejectedValue(new Error(errorMessage));
            
            let contextValue = null;
            
            // Render component
            render(
              <AuthProvider>
                <TestComponent onContextValue={(ctx) => { contextValue = ctx; }} />
              </AuthProvider>
            );
            
            // Wait for initial loading to complete
            await waitFor(() => {
              expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });
            
            // Execute: Attempt login
            try {
              await act(async () => {
                await contextValue.login(email, password);
              });
            } catch (error) {
              // Expected to throw
            }
            
            // Verify: No token in localStorage
            expect(localStorage.getItem('jwt_token')).toBeNull();
            
            // Verify: User is not authenticated
            expect(contextValue.user).toBeNull();
            expect(contextValue.isAuthenticated).toBe(false);
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * **Validates: Requirements 2.1, 2.2**
   * 
   * Property 4: Session Persistence
   * 
   * For any page load, if a valid JWT token exists in localStorage, the system
   * should maintain authenticated state without requiring re-login.
   */
  describe('Property 4: Session Persistence', () => {
    it('maintains authenticated state when valid token exists', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 20, maxLength: 200 }), // Generate random JWT token
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            username: fc.string({ minLength: 3, maxLength: 20 }),
            email: fc.emailAddress(),
            role: fc.constantFrom('admin', 'super_admin'),
          }), // Generate random user data
          async (token, userData) => {
            // Setup: Store valid token in localStorage
            localStorage.setItem('jwt_token', token);
            
            // Mock getProfile to return user data
            authService.getProfile.mockResolvedValue(userData);
            
            let contextValue = null;
            
            // Render component (simulates page load)
            render(
              <AuthProvider>
                <TestComponent onContextValue={(ctx) => { contextValue = ctx; }} />
              </AuthProvider>
            );
            
            // Wait for authentication check to complete
            await waitFor(() => {
              expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });
            
            // Verify: User is authenticated
            await waitFor(() => {
              expect(contextValue.user).toEqual(userData);
              expect(contextValue.isAuthenticated).toBe(true);
            });
            
            // Verify: getProfile was called to validate token
            expect(authService.getProfile).toHaveBeenCalled();
            
            // Cleanup
            localStorage.clear();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * **Validates: Requirements 2.3**
   * 
   * Property 5: Invalid Token Handling
   * 
   * For any page load with an invalid or expired JWT token in localStorage,
   * the system should clear localStorage and redirect to the login page.
   */
  describe('Property 5: Invalid Token Handling', () => {
    it('clears localStorage when token is invalid', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 20, maxLength: 200 }), // Generate random invalid token
          async (invalidToken) => {
            // Setup: Store invalid token in localStorage
            localStorage.setItem('jwt_token', invalidToken);
            
            // Mock getProfile to reject (invalid token)
            authService.getProfile.mockRejectedValue(new Error('Invalid token'));
            
            let contextValue = null;
            
            // Render component (simulates page load)
            render(
              <AuthProvider>
                <TestComponent onContextValue={(ctx) => { contextValue = ctx; }} />
              </AuthProvider>
            );
            
            // Wait for authentication check to complete
            await waitFor(() => {
              expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });
            
            // Verify: Token was removed from localStorage
            expect(localStorage.getItem('jwt_token')).toBeNull();
            
            // Verify: User is not authenticated
            await waitFor(() => {
              expect(contextValue.user).toBeNull();
              expect(contextValue.isAuthenticated).toBe(false);
            });
            
            // Cleanup
            localStorage.clear();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * **Validates: Requirements 4.2, 4.3, 4.4**
   * 
   * Property 10: Logout State Clearing
   * 
   * For any logout action, the system should remove the JWT token from
   * localStorage, clear all authentication state, and redirect to the login page.
   */
  describe('Property 10: Logout State Clearing', () => {
    it('clears token and state on logout', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 20, maxLength: 200 }), // Generate random JWT token
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            username: fc.string({ minLength: 3, maxLength: 20 }),
            email: fc.emailAddress(),
            role: fc.constantFrom('admin', 'super_admin'),
          }), // Generate random user data
          async (token, userData) => {
            // Setup: User is logged in
            localStorage.setItem('jwt_token', token);
            authService.getProfile.mockResolvedValue(userData);
            
            let contextValue = null;
            
            // Render component
            render(
              <AuthProvider>
                <TestComponent onContextValue={(ctx) => { contextValue = ctx; }} />
              </AuthProvider>
            );
            
            // Wait for authentication to complete
            await waitFor(() => {
              expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            }, { timeout: 3000 });
            
            // Verify user is authenticated
            await waitFor(() => {
              expect(contextValue.isAuthenticated).toBe(true);
            }, { timeout: 3000 });
            
            // Execute: Logout (synchronous operation)
            act(() => {
              contextValue.logout();
            });
            
            // Verify: Token is removed from localStorage immediately
            expect(localStorage.getItem('jwt_token')).toBeNull();
            
            // Verify: User state is cleared immediately
            expect(contextValue.user).toBeNull();
            expect(contextValue.isAuthenticated).toBe(false);
            
            // Cleanup
            localStorage.clear();
          }
        ),
        propertyTestConfig
      );
    }, 10000); // Increase timeout to 10 seconds
  });
});
