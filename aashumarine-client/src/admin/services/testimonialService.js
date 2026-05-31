import { apiClient } from './api';

/**
 * Testimonial Service for Admin Panel
 * 
 * Handles all testimonial-related API calls with authentication.
 * Uses the centralized apiClient for consistent error handling.
 */
export const testimonialService = {
  /**
   * Get all testimonials with filters and pagination
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Testimonials array and pagination info
   */
  async getAll(filters = {}) {
    // Remove undefined/null values from filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    return await apiClient.get('/testimonials', cleanFilters);
  },

  /**
   * Get single testimonial by ID
   * @param {number} id - Testimonial ID
   * @returns {Promise<Object>} Testimonial object
   */
  async getById(id) {
    const response = await apiClient.get(`/testimonials/${id}`);
    return response.testimonial;
  },

  /**
   * Create new testimonial
   * @param {Object} data - Testimonial data
   * @returns {Promise<Object>} Created testimonial
   */
  async create(data) {
    const response = await apiClient.post('/testimonials', data);
    return response.testimonial;
  },

  /**
   * Update existing testimonial
   * @param {number} id - Testimonial ID
   * @param {Object} data - Updated testimonial data
   * @returns {Promise<Object>} Updated testimonial
   */
  async update(id, data) {
    const response = await apiClient.put(`/testimonials/${id}`, data);
    return response.testimonial;
  },

  /**
   * Approve testimonial
   * @param {number} id - Testimonial ID
   * @returns {Promise<Object>} Updated testimonial
   */
  async approve(id) {
    const response = await apiClient.put(`/testimonials/${id}/approve`);
    return response.testimonial;
  },

  /**
   * Delete testimonial
   * @param {number} id - Testimonial ID
   * @returns {Promise<Object>} Success message
   */
  async delete(id) {
    return await apiClient.delete(`/testimonials/${id}`);
  },
};
