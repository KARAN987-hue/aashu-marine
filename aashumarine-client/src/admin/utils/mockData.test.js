import { describe, it, expect } from 'vitest';
import {
  generateMockProducts,
  generateMockTestimonials,
  generateMockLeads,
  generateMockQuotes,
  generateMockSubscribers,
  generateMockDashboardStats,
  generateMockRecentActivity,
} from './mockData';

/**
 * Tests for mock data generators
 * Validates: Task 22.2 - Create mock data generators for testing
 */
describe('Mock Data Generators', () => {
  describe('generateMockProducts', () => {
    it('generates the specified number of products', () => {
      const products = generateMockProducts(20);
      expect(products).toHaveLength(20);
    });

    it('generates at least 20 products by default', () => {
      const products = generateMockProducts();
      expect(products.length).toBeGreaterThanOrEqual(20);
    });

    it('generates products with all required fields', () => {
      const products = generateMockProducts(5);
      
      products.forEach(product => {
        expect(product).toHaveProperty('product_id');
        expect(product).toHaveProperty('product_name');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('product_type');
        expect(product).toHaveProperty('manufacturer');
        expect(product).toHaveProperty('condition');
        expect(product).toHaveProperty('model');
        expect(product).toHaveProperty('short_description');
        expect(product).toHaveProperty('main_description');
        expect(product).toHaveProperty('search_keyword');
        expect(product).toHaveProperty('owner');
        expect(product).toHaveProperty('is_active');
        expect(product).toHaveProperty('image_url');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('stock_quantity');
        expect(product).toHaveProperty('created_at');
        expect(product).toHaveProperty('updated_at');
      });
    });

    it('generates products with valid data types', () => {
      const products = generateMockProducts(5);
      
      products.forEach(product => {
        expect(typeof product.product_id).toBe('number');
        expect(typeof product.product_name).toBe('string');
        expect(typeof product.is_active).toBe('boolean');
        expect(typeof product.price).toBe('number');
        expect(typeof product.stock_quantity).toBe('number');
      });
    });

    it('generates products with unique IDs', () => {
      const products = generateMockProducts(20);
      const ids = products.map(p => p.product_id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(products.length);
    });
  });

  describe('generateMockTestimonials', () => {
    it('generates the specified number of testimonials', () => {
      const testimonials = generateMockTestimonials(10);
      expect(testimonials).toHaveLength(10);
    });

    it('generates at least 10 testimonials by default', () => {
      const testimonials = generateMockTestimonials();
      expect(testimonials.length).toBeGreaterThanOrEqual(10);
    });

    it('generates testimonials with all required fields', () => {
      const testimonials = generateMockTestimonials(5);
      
      testimonials.forEach(testimonial => {
        expect(testimonial).toHaveProperty('testimonial_id');
        expect(testimonial).toHaveProperty('name');
        expect(testimonial).toHaveProperty('company');
        expect(testimonial).toHaveProperty('text');
        expect(testimonial).toHaveProperty('rating');
        expect(testimonial).toHaveProperty('is_approved');
        expect(testimonial).toHaveProperty('created_at');
      });
    });

    it('generates testimonials with ratings between 1 and 5', () => {
      const testimonials = generateMockTestimonials(10);
      
      testimonials.forEach(testimonial => {
        expect(testimonial.rating).toBeGreaterThanOrEqual(1);
        expect(testimonial.rating).toBeLessThanOrEqual(5);
      });
    });

    it('generates testimonials with unique IDs', () => {
      const testimonials = generateMockTestimonials(10);
      const ids = testimonials.map(t => t.testimonial_id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(testimonials.length);
    });
  });

  describe('generateMockLeads', () => {
    it('generates the specified number of leads', () => {
      const leads = generateMockLeads(15);
      expect(leads).toHaveLength(15);
    });

    it('generates at least 15 leads by default', () => {
      const leads = generateMockLeads();
      expect(leads.length).toBeGreaterThanOrEqual(15);
    });

    it('generates leads with all required fields', () => {
      const leads = generateMockLeads(5);
      
      leads.forEach(lead => {
        expect(lead).toHaveProperty('lead_id');
        expect(lead).toHaveProperty('name');
        expect(lead).toHaveProperty('email');
        expect(lead).toHaveProperty('phone');
        expect(lead).toHaveProperty('message');
        expect(lead).toHaveProperty('source');
        expect(lead).toHaveProperty('status');
        expect(lead).toHaveProperty('created_at');
      });
    });

    it('generates leads with valid email format', () => {
      const leads = generateMockLeads(10);
      
      leads.forEach(lead => {
        expect(lead.email).toMatch(/@/);
        expect(lead.email).toMatch(/\./);
      });
    });

    it('generates leads with valid status values', () => {
      const leads = generateMockLeads(15);
      const validStatuses = ['new', 'contacted', 'converted', 'closed'];
      
      leads.forEach(lead => {
        expect(validStatuses).toContain(lead.status);
      });
    });

    it('generates leads with unique IDs', () => {
      const leads = generateMockLeads(15);
      const ids = leads.map(l => l.lead_id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(leads.length);
    });
  });

  describe('generateMockQuotes', () => {
    it('generates the specified number of quotes', () => {
      const quotes = generateMockQuotes(15);
      expect(quotes).toHaveLength(15);
    });

    it('generates at least 15 quotes by default', () => {
      const quotes = generateMockQuotes();
      expect(quotes.length).toBeGreaterThanOrEqual(15);
    });

    it('generates quotes with all required fields', () => {
      const quotes = generateMockQuotes(5);
      
      quotes.forEach(quote => {
        expect(quote).toHaveProperty('quote_id');
        expect(quote).toHaveProperty('customer_name');
        expect(quote).toHaveProperty('email');
        expect(quote).toHaveProperty('phone');
        expect(quote).toHaveProperty('message');
        expect(quote).toHaveProperty('product_name');
        expect(quote).toHaveProperty('product_id');
        expect(quote).toHaveProperty('source');
        expect(quote).toHaveProperty('status');
        expect(quote).toHaveProperty('created_at');
      });
    });

    it('generates quotes with valid email format', () => {
      const quotes = generateMockQuotes(10);
      
      quotes.forEach(quote => {
        expect(quote.email).toMatch(/@/);
        expect(quote.email).toMatch(/\./);
      });
    });

    it('generates quotes with valid status values', () => {
      const quotes = generateMockQuotes(15);
      const validStatuses = ['new', 'contacted', 'converted', 'closed'];
      
      quotes.forEach(quote => {
        expect(validStatuses).toContain(quote.status);
      });
    });

    it('generates quotes with unique IDs', () => {
      const quotes = generateMockQuotes(15);
      const ids = quotes.map(q => q.quote_id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(quotes.length);
    });
  });

  describe('generateMockSubscribers', () => {
    it('generates the specified number of subscribers', () => {
      const subscribers = generateMockSubscribers(30);
      expect(subscribers).toHaveLength(30);
    });

    it('generates at least 30 subscribers by default', () => {
      const subscribers = generateMockSubscribers();
      expect(subscribers.length).toBeGreaterThanOrEqual(30);
    });

    it('generates subscribers with all required fields', () => {
      const subscribers = generateMockSubscribers(5);
      
      subscribers.forEach(subscriber => {
        expect(subscriber).toHaveProperty('subscriber_id');
        expect(subscriber).toHaveProperty('email');
        expect(subscriber).toHaveProperty('is_active');
        expect(subscriber).toHaveProperty('subscribed_at');
      });
    });

    it('generates subscribers with valid email format', () => {
      const subscribers = generateMockSubscribers(30);
      
      subscribers.forEach(subscriber => {
        expect(subscriber.email).toMatch(/@/);
        expect(subscriber.email).toMatch(/\./);
      });
    });

    it('generates subscribers with unique emails', () => {
      const subscribers = generateMockSubscribers(30);
      const emails = subscribers.map(s => s.email);
      const uniqueEmails = new Set(emails);
      expect(uniqueEmails.size).toBe(subscribers.length);
    });

    it('generates subscribers with unique IDs', () => {
      const subscribers = generateMockSubscribers(30);
      const ids = subscribers.map(s => s.subscriber_id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(subscribers.length);
    });
  });

  describe('generateMockDashboardStats', () => {
    it('generates dashboard statistics with all required fields', () => {
      const stats = generateMockDashboardStats();
      
      expect(stats).toHaveProperty('totalProducts');
      expect(stats).toHaveProperty('pendingTestimonials');
      expect(stats).toHaveProperty('newLeads');
      expect(stats).toHaveProperty('newQuotes');
      expect(stats).toHaveProperty('activeSubscribers');
    });

    it('generates statistics with valid numeric values', () => {
      const stats = generateMockDashboardStats();
      
      expect(typeof stats.totalProducts).toBe('number');
      expect(typeof stats.pendingTestimonials).toBe('number');
      expect(typeof stats.newLeads).toBe('number');
      expect(typeof stats.newQuotes).toBe('number');
      expect(typeof stats.activeSubscribers).toBe('number');
      
      expect(stats.totalProducts).toBeGreaterThanOrEqual(0);
      expect(stats.pendingTestimonials).toBeGreaterThanOrEqual(0);
      expect(stats.newLeads).toBeGreaterThanOrEqual(0);
      expect(stats.newQuotes).toBeGreaterThanOrEqual(0);
      expect(stats.activeSubscribers).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generateMockRecentActivity', () => {
    it('generates recent activity with all required fields', () => {
      const activity = generateMockRecentActivity();
      
      expect(activity).toHaveProperty('recentLeads');
      expect(activity).toHaveProperty('recentQuotes');
      expect(activity).toHaveProperty('recentTestimonials');
    });

    it('generates exactly 5 items for each activity type', () => {
      const activity = generateMockRecentActivity();
      
      expect(activity.recentLeads).toHaveLength(5);
      expect(activity.recentQuotes).toHaveLength(5);
      expect(activity.recentTestimonials).toHaveLength(5);
    });

    it('sorts recent activity by date (newest first)', () => {
      const activity = generateMockRecentActivity();
      
      // Check leads are sorted
      for (let i = 0; i < activity.recentLeads.length - 1; i++) {
        const current = new Date(activity.recentLeads[i].created_at);
        const next = new Date(activity.recentLeads[i + 1].created_at);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
      
      // Check quotes are sorted
      for (let i = 0; i < activity.recentQuotes.length - 1; i++) {
        const current = new Date(activity.recentQuotes[i].created_at);
        const next = new Date(activity.recentQuotes[i + 1].created_at);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
      
      // Check testimonials are sorted
      for (let i = 0; i < activity.recentTestimonials.length - 1; i++) {
        const current = new Date(activity.recentTestimonials[i].created_at);
        const next = new Date(activity.recentTestimonials[i + 1].created_at);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });
  });
});
