import { apiClient } from './api';

/**
 * Product Service for Admin Panel
 * 
 * Handles all product-related API calls with authentication.
 * Uses the centralized apiClient for consistent error handling.
 */
export const productService = {
  /**
   * Get all products with filters and pagination
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Products array and pagination info
   */
  async getAll(filters = {}) {
    // Remove undefined/null values from filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    return await apiClient.get('/products', cleanFilters);
  },

  /**
   * Get single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getById(id) {
    const response = await apiClient.get(`/products/${id}`);
    return response.product;
  },

  /**
   * Create new product
   * @param {Object|FormData} data - Product data (use FormData for image uploads)
   * @returns {Promise<Object>} Created product
   */
  async create(data) {
    const response = await apiClient.post('/products', data);
    return response.product;
  },

  /**
   * Update existing product
   * @param {number} id - Product ID
   * @param {Object|FormData} data - Updated product data (use FormData for image uploads)
   * @returns {Promise<Object>} Updated product
   */
  async update(id, data) {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.product;
  },

  /**
   * Delete product
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Success message
   */
  async delete(id) {
    return await apiClient.delete(`/products/${id}`);
  },

  /**
   * Get all product categories
   * @returns {Promise<Object>} Categories array
   */
  async getCategories() {
    return await apiClient.get('/products/categories');
  },

  /**
   * Get all manufacturers
   * @returns {Promise<Object>} Manufacturers array
   */
  async getManufacturers() {
    return await apiClient.get('/products/manufacturers');
  },
};
