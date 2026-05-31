/**
 * Public Product API Service
 * 
 * Handles public product API calls (no authentication required).
 * Provides methods for fetching products, categories, and manufacturers.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 * @throws {Error} API error with message
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Public Product API Service
 */
export const productApi = {
  /**
   * Get all products with optional filters
   * @param {Object} filters - Filter parameters
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @param {string} filters.search - Search term
   * @param {string} filters.category - Category filter
   * @param {string} filters.manufacturer - Manufacturer filter
   * @param {string} filters.condition - Condition filter
   * @returns {Promise<Object>} Products array and pagination info
   */
  async getAll(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return apiRequest(`/products${queryString ? '?' + queryString : ''}`);
  },

  /**
   * Get single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getById(id) {
    return apiRequest(`/products/${id}`);
  },

  /**
   * Get all product categories
   * @returns {Promise<Object>} Categories array
   */
  async getCategories() {
    return apiRequest('/products/categories');
  },

  /**
   * Get all manufacturers
   * @returns {Promise<Object>} Manufacturers array
   */
  async getManufacturers() {
    return apiRequest('/products/manufacturers');
  },
};

export default productApi;
