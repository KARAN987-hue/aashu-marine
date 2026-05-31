import { apiClient } from './api';

/**
 * Dashboard Service
 * 
 * Handles dashboard statistics and recent activity API calls.
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics() {
    try {
      // Fetch all stats in parallel
      const [
        productsResponse,
        testimonialsResponse,
        leadsStatsResponse,
        quotesStatsResponse,
        subscribersStatsResponse
      ] = await Promise.all([
        apiClient.get('/products', { limit: 1, page: 1 }), // Get pagination info for total
        apiClient.get('/testimonials', { is_approved: false, limit: 1 }), // Pending testimonials
        apiClient.get('/leads/stats'),
        apiClient.get('/quotes/stats'),
        apiClient.get('/newsletter/stats')
      ]);

      return {
        totalProducts: productsResponse.pagination?.total || 0,
        pendingTestimonials: testimonialsResponse.pagination?.total || 0,
        newLeads: leadsStatsResponse.stats?.new || 0,
        newQuotes: quotesStatsResponse.stats?.new || 0,
        activeSubscribers: subscribersStatsResponse.stats?.active || 0
      };
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      throw error;
    }
  },

  /**
   * Get recent contact leads (5 most recent)
   * @returns {Promise<Array>} Array of recent leads
   */
  async getRecentLeads() {
    try {
      const response = await apiClient.get('/leads', { 
        limit: 5, 
        page: 1,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      return response.leads || [];
    } catch (error) {
      console.error('Failed to fetch recent leads:', error);
      throw error;
    }
  },

  /**
   * Get recent quote requests (5 most recent)
   * @returns {Promise<Array>} Array of recent quotes
   */
  async getRecentQuotes() {
    try {
      const response = await apiClient.get('/quotes', { 
        limit: 5, 
        page: 1,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      return response.quotes || [];
    } catch (error) {
      console.error('Failed to fetch recent quotes:', error);
      throw error;
    }
  },

  /**
   * Get recent testimonials (5 most recent)
   * @returns {Promise<Array>} Array of recent testimonials
   */
  async getRecentTestimonials() {
    try {
      const response = await apiClient.get('/testimonials', { 
        limit: 5, 
        page: 1,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      return response.testimonials || [];
    } catch (error) {
      console.error('Failed to fetch recent testimonials:', error);
      throw error;
    }
  }
};
