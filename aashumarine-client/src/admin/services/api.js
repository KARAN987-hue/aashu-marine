/**
 * API Client for Admin Panel
 * 
 * Provides centralized HTTP request handling with:
 * - Automatic JWT token management
 * - Structured error handling
 * - 401 automatic redirect to login
 * - Environment-based base URL configuration
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Custom error class for API errors
 * Provides structured error information including status code and response data
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * API Client class
 * Handles all HTTP requests with authentication and error handling
 */
class ApiClient {
  /**
   * Make an HTTP request
   * @param {string} url - The endpoint URL (relative to BASE_URL)
   * @param {object} options - Fetch options
   * @returns {Promise<any>} Response data
   * @throws {ApiError} On request failure
   */
  async request(url, options = {}) {
    const token = localStorage.getItem('jwt_token');
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    const headers = {};
    
    // Only set Content-Type if body is not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Merge with any provided headers
    Object.assign(headers, options.headers);

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };
// --
    try {
      const response = await fetch(`${BASE_URL}${url}`, config);
      
      // Handle 401 Unauthorized - clear token and redirect to login (Requirement 35.2)
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/admin/login';
        throw new ApiError('Unauthorized', 401);
      }

      // Handle 403 Forbidden (Requirement 35.3)
      if (response.status === 403) {
        throw new ApiError("You don't have permission to perform this action.", 403);
      }

      // Handle 404 Not Found (Requirement 35.4)
      if (response.status === 404) {
        throw new ApiError('Resource not found.', 404);
      }

      // Handle 500 Internal Server Error (Requirement 35.5)
      if (response.status === 500) {
        throw new ApiError('Server error. Please try again later.', 500);
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors with specific messages (Requirement 35.6)
        throw new ApiError(
          data.message || 'Request failed',
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Handle network errors (Requirement 35.1)
      throw new ApiError('Network error. Please check your connection.', 0);
    }
  }

  /**
   * Make a GET request
   * @param {string} url - The endpoint URL
   * @param {object} params - Query parameters
   * @returns {Promise<any>} Response data
   */
  get(url, params) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(url + queryString, { method: 'GET' });
  }

  /**
   * Make a POST request
   * @param {string} url - The endpoint URL
   * @param {object|FormData} data - Request body data
   * @returns {Promise<any>} Response data
   */
  post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  /**
   * Make a PUT request
   * @param {string} url - The endpoint URL
   * @param {object|FormData} data - Request body data
   * @returns {Promise<any>} Response data
   */
  put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  /**
   * Make a DELETE request
   * @param {string} url - The endpoint URL
   * @returns {Promise<any>} Response data
   */
  delete(url) {
    return this.request(url, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export ApiError for use in other modules
export { ApiError };
