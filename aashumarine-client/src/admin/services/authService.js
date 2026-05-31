/**
 * Authentication Service
 * 
 * Provides authentication-related API calls:
 * - Login with email and password
 * - Get user profile
 * - Change password
 * 
 * Requirements: 1.2, 2.1, 33.1
 */

import { apiClient } from './api';

/**
 * Authentication service methods
 */
export const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: object}>} Login response with JWT token and user data
   * @throws {ApiError} On login failure
   */
  async login(email, password) {
    return await apiClient.post('/auth/login', { email, password });
  },

  /**
   * Get authenticated user profile
   * Requires valid JWT token in localStorage
   * @returns {Promise<object>} User profile data
   * @throws {ApiError} On request failure or invalid token
   */
  async getProfile() {
    return await apiClient.get('/auth/profile');
  },

  /**
   * Change user password
   * Requires valid JWT token in localStorage
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   * @throws {ApiError} On request failure or validation error
   */
  async changePassword(currentPassword, newPassword) {
    return await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
