/**
 * Public API Service
 * 
 * Handles public API calls that don't require authentication.
 * Provides methods for contact leads, quote requests, newsletter subscriptions,
 * and public testimonial submissions.
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
      throw new Error(data.message || `API request failed with status ${response.status}`);
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
 * Public API Service
 */
export const publicApi = {
  /**
   * Submit a contact lead
   * @param {Object} leadData - Lead information
   * @param {string} leadData.name - Contact name
   * @param {string} leadData.email - Contact email
   * @param {string} [leadData.phone] - Contact phone (optional)
   * @param {string} leadData.message - Contact message
   * @returns {Promise<Object>} Response with success message
   */
  async submitLead(leadData) {
    return apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  /**
   * Submit a quote request
   * @param {Object} quoteData - Quote request information
   * @param {string} quoteData.name - Customer name
   * @param {string} quoteData.email - Customer email
   * @param {string} [quoteData.phone] - Customer phone (optional)
   * @param {string} [quoteData.message] - Additional message (optional)
   * @param {string} [quoteData.source] - Source of the quote request
   * @param {number} [quoteData.productId] - Product ID if applicable
   * @returns {Promise<Object>} Response with success message
   */
  async submitQuote(quoteData) {
    return apiRequest('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  },

  /**
   * Subscribe to newsletter
   * @param {Object} subscriptionData - Subscription information
   * @param {string} subscriptionData.email - Subscriber email
   * @returns {Promise<Object>} Response with success message
   */
  async subscribeNewsletter(subscriptionData) {
    return apiRequest('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  },

  /**
   * Submit a public testimonial
   * @param {Object} testimonialData - Testimonial information
   * @param {string} testimonialData.name - Reviewer name
   * @param {string} [testimonialData.company] - Company name (optional)
   * @param {string} testimonialData.feedback - Testimonial text
   * @param {number} testimonialData.rating - Rating (1-5)
   * @returns {Promise<Object>} Response with success message
   */
  async submitTestimonial(testimonialData) {
    // Map 'feedback' to 'text' for backend compatibility
    const { feedback, ...rest } = testimonialData;
    const backendData = {
      ...rest,
      text: feedback
    };
    
    return apiRequest('/testimonials', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  },

  /**
   * Get approved testimonials for public display
   * @param {number} [limit=10] - Maximum number of testimonials to fetch
   * @returns {Promise<Object>} Response with testimonials array
   */
  async getApprovedTestimonials(limit = 10) {
    return apiRequest(`/testimonials?is_approved=true&limit=${limit}`);
  },

  /**
   * Get related products for a specific product
   * @param {number} productId - Product ID to get related products for
   * @returns {Promise<Object>} Response with relatedProducts array
   */
  async getRelatedProducts(productId) {
    return apiRequest(`/products/${productId}/related`);
  },
};

export default publicApi;
