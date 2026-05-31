import { apiClient } from './api';

/**
 * Lead Service for Admin Panel
 * 
 * Handles all lead-related API calls with authentication.
 * Uses the centralized apiClient for consistent error handling.
 */
export const leadService = {
  /**
   * Get all leads with filters and pagination
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Leads array and pagination info
   */
  async getAll(filters = {}) {
    // Remove undefined/null values from filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    return await apiClient.get('/leads', cleanFilters);
  },

  /**
   * Get single lead by ID
   * @param {number} id - Lead ID
   * @returns {Promise<Object>} Lead object
   */
  async getById(id) {
    const response = await apiClient.get(`/leads/${id}`);
    return response.lead;
  },

  /**
   * Update lead status
   * @param {number} id - Lead ID
   * @param {string} status - New status (new, contacted, converted, closed)
   * @returns {Promise<Object>} Updated lead
   */
  async updateStatus(id, status) {
    const response = await apiClient.put(`/leads/${id}/status`, { status });
    return response.lead;
  },

  /**
   * Delete lead
   * @param {number} id - Lead ID
   * @returns {Promise<Object>} Success message
   */
  async delete(id) {
    return await apiClient.delete(`/leads/${id}`);
  },
};
