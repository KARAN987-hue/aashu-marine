import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock all admin services
vi.mock('./admin/services/authService', () => ({
  authService: {
    login: vi.fn(),
    getProfile: vi.fn(),
    changePassword: vi.fn(),
  },
}));

vi.mock('./admin/services/dashboardService', () => ({
  dashboardService: {
    getStats: vi.fn(),
    getRecentActivity: vi.fn(),
  },
}));

vi.mock('./admin/services/productService', () => ({
  productService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getCategories: vi.fn(),
    getManufacturers: vi.fn(),
  },
}));

vi.mock('./admin/services/testimonialService', () => ({
  testimonialService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    approve: vi.fn(),
  },
}));

vi.mock('./admin/services/leadService', () => ({
  leadService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('./admin/services/quoteService', () => ({
  quoteService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('./admin/services/subscriberService', () => ({
  subscriberService: {
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}));

/**
 * Integration tests for admin routing and navigation
 * Validates: Requirements 1, 3, 32
 */
describe('Admin Panel Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Route Configuration', () => {
    it('renders login page at /admin/login', () => {
      window.history.pushState({}, '', '/admin/login');
      render(<App />);
      
      expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('redirects /admin to /admin/dashboard', async () => {
      // Mock authenticated user
      localStorage.setItem('jwt_token', 'mock-token');
      const { authService } = await import('./admin/services/authService');
      authService.getProfile.mockResolvedValue({
        user_id: 1,
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
      });

      window.history.pushState({}, '', '/admin');
      render(<App />);

      await waitFor(() => {
        expect(window.location.pathname).toBe('/admin/dashboard');
      });
    });

    it('redirects unauthenticated users from protected routes to login', async () => {
      window.history.pushState({}, '', '/admin/dashboard');
      render(<App />);

      await waitFor(() => {
        expect(window.location.pathname).toBe('/admin/login');
      });
    });

    it('allows authenticated users to access protected routes', async () => {
      localStorage.setItem('jwt_token', 'mock-token');
      const { authService } = await import('./admin/services/authService');
      const { dashboardService } = await import('./admin/services/dashboardService');
      
      authService.getProfile.mockResolvedValue({
        user_id: 1,
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
      });

      dashboardService.getStats.mockResolvedValue({
        totalProducts: 50,
        pendingTestimonials: 5,
        newLeads: 10,
        newQuotes: 8,
        activeSubscribers: 100,
      });

      dashboardService.getRecentActivity.mockResolvedValue({
        recentLeads: [],
        recentQuotes: [],
        recentTestimonials: [],
      });

      window.history.pushState({}, '', '/admin/dashboard');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      });
    });
  });

  describe('Direct Route Navigation', () => {
    beforeEach(async () => {
      // Setup authenticated state
      localStorage.setItem('jwt_token', 'mock-token');
      const { authService } = await import('./admin/services/authService');
      authService.getProfile.mockResolvedValue({
        user_id: 1,
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
      });
    });

    it('can access products page directly', async () => {
      const { productService } = await import('./admin/services/productService');

      productService.getAll.mockResolvedValue({
        products: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      window.history.pushState({}, '', '/admin/products');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Products', level: 1 })).toBeInTheDocument();
      });
    });

    it('can access testimonials page directly', async () => {
      const { testimonialService } = await import('./admin/services/testimonialService');

      testimonialService.getAll.mockResolvedValue({
        testimonials: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      window.history.pushState({}, '', '/admin/testimonials');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Testimonials', level: 1 })).toBeInTheDocument();
      });
    });

    it('can access leads page directly', async () => {
      const { leadService } = await import('./admin/services/leadService');

      leadService.getAll.mockResolvedValue({
        leads: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      window.history.pushState({}, '', '/admin/leads');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Contact Leads', level: 1 })).toBeInTheDocument();
      });
    });

    it('can access quotes page directly', async () => {
      const { quoteService } = await import('./admin/services/quoteService');

      quoteService.getAll.mockResolvedValue({
        quotes: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      window.history.pushState({}, '', '/admin/quotes');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Quote Requests', level: 1 })).toBeInTheDocument();
      });
    });

    it('can access subscribers page directly', async () => {
      const { subscriberService } = await import('./admin/services/subscriberService');

      subscriberService.getAll.mockResolvedValue({
        subscribers: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      window.history.pushState({}, '', '/admin/subscribers');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /newsletter subscribers/i })).toBeInTheDocument();
      });
    });

    it('can access profile page directly', async () => {
      window.history.pushState({}, '', '/admin/profile');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
      });
    });
  });

  describe('Provider Wiring', () => {
    it('wraps app with AuthProvider', () => {
      window.history.pushState({}, '', '/admin/login');
      render(<App />);
      
      // AuthProvider should provide authentication context
      expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
    });

    it('wraps app with ToastProvider', async () => {
      const user = userEvent.setup();
      const { authService } = await import('./admin/services/authService');
      
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      window.history.pushState({}, '', '/admin/login');
      render(<App />);

      // Fill in login form with invalid credentials
      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Toast notification should appear (provided by ToastProvider)
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});
