import { apiClient } from './api';

/**
 * Quote Service for Admin Panel
 * 
 * Handles all quote-related API calls with authentication.
 * Uses the centralized apiClient for consistent error handling.
 */
export const quoteService = {
  /**
   * Get all quotes with filters and pagination
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Quotes array and pagination info
   */
  async getAll(filters = {}) {
    // Remove undefined/null values from filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    return await apiClient.get('/quotes', cleanFilters);
  },

  /**
   * Get single quote by ID
   * @param {number} id - Quote ID
   * @returns {Promise<Object>} Quote object
   */
  async getById(id) {
    const response = await apiClient.get(`/quotes/${id}`);
    return response.quote;
  },

  /**
   * Update quote status
   * @param {number} id - Quote ID
   * @param {string} status - New status (new, quoted, converted, closed)
   * @returns {Promise<Object>} Updated quote
   */
  async updateStatus(id, status) {
    const response = await apiClient.put(`/quotes/${id}/status`, { status });
    return response.quote;
  },

  /**
   * Delete quote
   * @param {number} id - Quote ID
   * @returns {Promise<Object>} Success message
   */
  async delete(id) {
    return await apiClient.delete(`/quotes/${id}`);
  },
};
