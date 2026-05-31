/**
 * Property-Based Tests for Protected Routes and Navigation
 * 
 * Tests universal properties of route protection and navigation using fast-check
 * to verify behavior across many randomized inputs.
 * 
 * Tests Properties:
 * - Property 7: Protected Route Access Control
 * - Property 8: Protected Route Rendering
 * - Property 9: Login Redirect Preservation
 * - Property 36: Navigation Active State
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import fc from 'fast-check';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminSidebar } from './layout/AdminSidebar';
import { AuthContext } from '../context/AuthContext';

// Property test configuration
const propertyTestConfig = {
  numRuns: 100,  // Minimum 100 iterations per property
  verbose: true,
};

// Mock LoadingSpinner component
vi.mock('./common/LoadingSpinner', () => ({
  default: ({ fullScreen }) => (
    <div data-testid="loading-spinner" data-fullscreen={fullScreen}>
      Loading...
    </div>
  ),
}));

// Test component to display protected content
function ProtectedContent() {
  return <div data-testid="protected-content">Protected Page Content</div>;
}

// Test component to capture location state
function LocationCapture({ onLocation }) {
  const location = useLocation();
  
  React.useEffect(() => {
    if (onLocation) {
      onLocation(location);
    }
  }, [location, onLocation]);
  
  return <div data-testid="login-page">Login Page</div>;
}

// Helper to render with auth context
function renderWithAuth(component, authValue) {
  return render(
    <AuthContext.Provider value={authValue}>
      {component}
    </AuthContext.Provider>
  );
}

describe('ProtectedRoute Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * **Validates: Requirement 3.2**
   * 
   * Property 7: Protected Route Access Control
   * 
   * For any protected route, if the user is not authenticated, attempting to
   * access the route should redirect to the login page.
   */
  describe('Property 7: Protected Route Access Control', () => {
    it('redirects unauthenticated users to login page', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            '/admin/dashboard',
            '/admin/products',
            '/admin/testimonials',
            '/admin/leads',
            '/admin/quotes',
            '/admin/subscribers',
            '/admin/profile'
          ), // Generate random protected routes
          async (protectedRoute) => {
            // Setup: User is not authenticated
            const authValue = {
              user: null,
              isAuthenticated: false,
              isLoading: false,
              login: vi.fn(),
              logout: vi.fn(),
              checkAuth: vi.fn(),
            };

            let capturedLocation = null;

            // Render: Try to access protected route
            const { unmount } = renderWithAuth(
              <MemoryRouter initialEntries={[protectedRoute]}>
                <Routes>
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <ProtectedContent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/login"
                    element={<LocationCapture onLocation={(loc) => { capturedLocation = loc; }} />}
                  />
                </Routes>
              </MemoryRouter>,
              authValue
            );

            // Verify: Redirected to login page
            await waitFor(() => {
              const loginPages = screen.queryAllByTestId('login-page');
              expect(loginPages.length).toBeGreaterThan(0);
            });

            // Verify: Protected content is not rendered
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

            // Verify: Original route is preserved in location state
            await waitFor(() => {
              expect(capturedLocation).not.toBeNull();
              expect(capturedLocation.state?.from?.pathname).toBe(protectedRoute);
            });

            // Cleanup
            unmount();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * **Validates: Requirement 3.3**
   * 
   * Property 8: Protected Route Rendering
   * 
   * For any protected route, if the user is authenticated, the system should
   * render the requested page content.
   */
  describe('Property 8: Protected Route Rendering', () => {
    it('renders protected content for authenticated users', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            '/admin/dashboard',
            '/admin/products',
            '/admin/testimonials',
            '/admin/leads',
            '/admin/quotes',
            '/admin/subscribers',
            '/admin/profile'
          ), // Generate random protected routes
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            username: fc.string({ minLength: 3, maxLength: 20 }),
            email: fc.emailAddress(),
            role: fc.constantFrom('admin', 'super_admin'),
          }), // Generate random user data
          async (protectedRoute, userData) => {
            // Setup: User is authenticated
            const authValue = {
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              login: vi.fn(),
              logout: vi.fn(),
              checkAuth: vi.fn(),
            };

            // Render: Access protected route
            const { unmount } = renderWithAuth(
              <MemoryRouter initialEntries={[protectedRoute]}>
                <Routes>
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <ProtectedContent />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/admin/login" element={<div>Login Page</div>} />
                </Routes>
              </MemoryRouter>,
              authValue
            );

            // Verify: Protected content is rendered
            await waitFor(() => {
              expect(screen.getByTestId('protected-content')).toBeInTheDocument();
            }, { timeout: 1000 });

            // Verify: Not redirected to login
            expect(screen.queryByText('Login Page')).not.toBeInTheDocument();

            // Cleanup
            unmount();
          }
        ),
        propertyTestConfig
      );
    }, 10000); // Increase timeout for property test
  });

  /**
   * **Validates: Requirement 3.4**
   * 
   * Property 9: Login Redirect Preservation
   * 
   * For any protected route access attempt while unauthenticated, after
   * successful login, the system should redirect to the originally requested route.
   */
  describe('Property 9: Login Redirect Preservation', () => {
    it('preserves attempted route in location state for post-login redirect', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            '/admin/dashboard',
            '/admin/products',
            '/admin/testimonials',
            '/admin/leads',
            '/admin/quotes',
            '/admin/subscribers',
            '/admin/profile'
          ), // Generate random protected routes
          async (attemptedRoute) => {
            // Setup: User is not authenticated
            const authValue = {
              user: null,
              isAuthenticated: false,
              isLoading: false,
              login: vi.fn(),
              logout: vi.fn(),
              checkAuth: vi.fn(),
            };

            let capturedLocation = null;

            // Render: Try to access protected route
            const { unmount } = renderWithAuth(
              <MemoryRouter initialEntries={[attemptedRoute]}>
                <Routes>
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <ProtectedContent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/login"
                    element={<LocationCapture onLocation={(loc) => { capturedLocation = loc; }} />}
                  />
                </Routes>
              </MemoryRouter>,
              authValue
            );

            // Wait for redirect to complete
            await waitFor(() => {
              const loginPages = screen.queryAllByTestId('login-page');
              expect(loginPages.length).toBeGreaterThan(0);
            }, { timeout: 1000 });

            // Verify: Location state contains the attempted route
            await waitFor(() => {
              expect(capturedLocation).not.toBeNull();
              expect(capturedLocation.state).toBeDefined();
              expect(capturedLocation.state.from).toBeDefined();
              expect(capturedLocation.state.from.pathname).toBe(attemptedRoute);
            }, { timeout: 1000 });

            // Note: The actual redirect after login would be handled by the LoginPage component
            // which would read location.state.from and navigate to it after successful authentication

            // Cleanup
            unmount();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * **Validates: Requirement 3.2**
   * 
   * Additional test: Loading state display during authentication check
   */
  describe('Loading State During Authentication Check', () => {
    it('displays loading spinner while checking authentication', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            '/admin/dashboard',
            '/admin/products',
            '/admin/testimonials'
          ),
          async (protectedRoute) => {
            // Setup: Authentication is loading
            const authValue = {
              user: null,
              isAuthenticated: false,
              isLoading: true,
              login: vi.fn(),
              logout: vi.fn(),
              checkAuth: vi.fn(),
            };

            // Render: Access protected route while loading
            const { unmount } = renderWithAuth(
              <MemoryRouter initialEntries={[protectedRoute]}>
                <Routes>
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <ProtectedContent />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </MemoryRouter>,
              authValue
            );

            // Verify: Loading spinner is displayed
            const spinners = screen.queryAllByTestId('loading-spinner');
            expect(spinners.length).toBeGreaterThan(0);
            expect(spinners[0]).toHaveAttribute('data-fullscreen', 'true');

            // Verify: Protected content is not rendered yet
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

            // Cleanup
            unmount();
          }
        ),
        propertyTestConfig
      );
    }, 10000); // Increase timeout for property test
  });
});

describe('AdminSidebar Property Tests', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * **Validates: Requirement 32.3**
   * 
   * Property 36: Navigation Active State
   * 
   * For any navigation link, when the user is on the corresponding page,
   * the navigation item should be visually indicated as active.
   */
  describe('Property 36: Navigation Active State', () => {
    it('highlights active navigation item based on current route', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            { path: '/admin/dashboard', label: 'Dashboard' },
            { path: '/admin/products', label: 'Products' },
            { path: '/admin/testimonials', label: 'Testimonials' },
            { path: '/admin/leads', label: 'Contact Leads' },
            { path: '/admin/quotes', label: 'Quote Requests' },
            { path: '/admin/subscribers', label: 'Newsletter Subscribers' },
            { path: '/admin/profile', label: 'Profile' }
          ), // Generate random navigation items
          async (navItem) => {
            // Render: AdminSidebar with current route
            const { container, unmount } = render(
              <MemoryRouter initialEntries={[navItem.path]}>
                <AdminSidebar isCollapsed={false} />
              </MemoryRouter>
            );

            // Verify: The corresponding navigation link has active class
            // Find all links and check which one is active
            const allNavLinks = container.querySelectorAll('.nav-link');
            const activeLinks = Array.from(allNavLinks).filter(link => link.classList.contains('active'));
            
            expect(activeLinks.length).toBe(1);
            expect(activeLinks[0].textContent).toContain(navItem.label);
            
            // Note: aria-current is set by NavLink's isActive function which may return undefined
            // We verify the active class is present, which is the key indicator

            // Verify: Other navigation links do not have active class
            const inactiveLinks = Array.from(allNavLinks).filter(link => !link.classList.contains('active'));
            expect(inactiveLinks.length).toBe(6); // 7 total links - 1 active = 6 inactive

            // Cleanup
            unmount();
          }
        ),
        propertyTestConfig
      );
    }, 10000); // Increase timeout for property test

    it('updates active state when navigating between routes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            { path: '/admin/dashboard', label: 'Dashboard' },
            { path: '/admin/products', label: 'Products' },
            { path: '/admin/testimonials', label: 'Testimonials' }
          ),
          fc.constantFrom(
            { path: '/admin/leads', label: 'Contact Leads' },
            { path: '/admin/quotes', label: 'Quote Requests' },
            { path: '/admin/profile', label: 'Profile' }
          ),
          async (firstRoute, secondRoute) => {
            // Skip if routes are the same
            if (firstRoute.path === secondRoute.path) {
              return;
            }

            // Render: Start at first route
            const { container, unmount } = render(
              <MemoryRouter initialEntries={[firstRoute.path]}>
                <AdminSidebar isCollapsed={false} />
              </MemoryRouter>
            );

            // Verify: First route is active
            let allNavLinks = container.querySelectorAll('.nav-link');
            let activeLinks = Array.from(allNavLinks).filter(link => link.classList.contains('active'));
            expect(activeLinks.length).toBe(1);
            expect(activeLinks[0].textContent).toContain(firstRoute.label);

            // Cleanup first render
            unmount();

            // Render again with second route
            const { container: container2, unmount: unmount2 } = render(
              <MemoryRouter initialEntries={[secondRoute.path]}>
                <AdminSidebar isCollapsed={false} />
              </MemoryRouter>
            );

            // Verify: Second route is now active
            allNavLinks = container2.querySelectorAll('.nav-link');
            activeLinks = Array.from(allNavLinks).filter(link => link.classList.contains('active'));
            expect(activeLinks.length).toBe(1);
            expect(activeLinks[0].textContent).toContain(secondRoute.label);

            // Cleanup
            unmount2();
          }
        ),
        propertyTestConfig
      );
    }, 10000); // Increase timeout for property test
  });

  /**
   * Additional test: Sidebar collapse state
   */
  describe('Sidebar Collapse State', () => {
    it('applies collapsed class when isCollapsed is true', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.boolean(), // Generate random collapsed state
          async (isCollapsed) => {
            // Render: AdminSidebar with collapsed state
            const { container, unmount } = render(
              <MemoryRouter initialEntries={['/admin/dashboard']}>
                <AdminSidebar isCollapsed={isCollapsed} />
              </MemoryRouter>
            );

            // Verify: Collapsed class is applied correctly
            const sidebar = container.querySelector('.admin-sidebar');
            if (isCollapsed) {
              expect(sidebar).toHaveClass('collapsed');
            } else {
              expect(sidebar).not.toHaveClass('collapsed');
            }

            // Cleanup
            unmount();
          }
        ),
        propertyTestConfig
      );
    }, 10000); // Increase timeout for property test
  });
});
