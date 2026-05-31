/**
 * Authentication Context
 * 
 * Provides global authentication state and methods for the admin panel.
 * Manages user authentication, JWT token storage, and session persistence.
 * 
 * Requirements: 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 4.2, 4.3, 4.4
 */

import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

/**
 * Authentication context value interface:
 * {
 *   user: User | null - Current authenticated user
 *   isAuthenticated: boolean - Whether user is authenticated
 *   isLoading: boolean - Whether authentication check is in progress
 *   login: (email, password) => Promise<void> - Login method
 *   logout: () => void - Logout method
 *   checkAuth: () => Promise<void> - Check authentication status
 * }
 */
export const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the application to provide authentication context
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated by validating JWT token
   * Fetches user profile if token exists
   * Clears token if invalid or expired
   */
  const checkAuth = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      // Token is invalid or expired, clear it
      localStorage.removeItem('jwt_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user with email and password
   * Stores JWT token in localStorage on success
   * @param {string} email - User email
   * @param {string} password - User password
   * @throws {Error} On login failure
   */
  const login = async (email, password) => {
    const { token, user: userData } = await authService.login(email, password);
    localStorage.setItem('jwt_token', token);
    setUser(userData);
  };

  /**
   * Logout user
   * Clears JWT token from localStorage and resets user state
   */
  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
