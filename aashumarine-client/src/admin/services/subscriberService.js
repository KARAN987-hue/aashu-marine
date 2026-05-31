import { apiClient } from './api';

/**
 * Subscriber Service for Admin Panel
 * 
 * Handles all newsletter subscriber-related API calls with authentication.
 * Uses the centralized apiClient for consistent error handling.
 */
export const subscriberService = {
  /**
   * Get all subscribers with filters and pagination
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Subscribers array and pagination info
   */
  async getAll(filters = {}) {
    // Remove undefined/null values from filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    return await apiClient.get('/newsletter', cleanFilters);
  },

  /**
   * Delete subscriber
   * @param {number} id - Subscriber ID
   * @returns {Promise<Object>} Success message
   */
  async delete(id) {
    return await apiClient.delete(`/newsletter/${id}`);
  },
};
