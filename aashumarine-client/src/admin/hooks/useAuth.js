/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Provides access to user state, authentication status, and auth methods.
 * 
 * Requirements: 1.2, 2.1, 3.2, 4.2
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Access authentication context
 * @returns {object} Authentication context value
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
