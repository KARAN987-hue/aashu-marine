/**
 * Property-Based Tests for API Client
 * 
 * Tests universal properties of the API client using fast-check
 * to verify behavior across many randomized inputs.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { apiClient, ApiError } from './api';

// Property test configuration
const propertyTestConfig = {
  numRuns: 100,  // Minimum 100 iterations per property
  verbose: true,
};

describe('API Client Property Tests', () => {
  let originalFetch;
  let originalLocation;

  beforeEach(() => {
    // Save original fetch and location
    originalFetch = global.fetch;
    originalLocation = window.location;
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock window.location
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    // Restore original fetch and location
    global.fetch = originalFetch;
    window.location = originalLocation;
    
    // Clear localStorage after each test
    localStorage.clear();
  });

  /**
   * **Validates: Requirements 2.4, 40.2**
   * 
   * Property 6: Authorization Header Inclusion
   * 
   * For any API request to a protected endpoint, if the user is authenticated,
   * the request should include the JWT token in the Authorization header.
   */
  describe('Property 6: Authorization Header Inclusion', () => {
    it('includes JWT token in Authorization header for authenticated requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 20, maxLength: 200 }), // Generate random JWT tokens
          fc.constantFrom('/products', '/users', '/orders', '/dashboard'), // Generate random endpoints
          async (token, endpoint) => {
            // Setup: Store token in localStorage
            localStorage.setItem('jwt_token', token);
            
            // Mock fetch to capture request
            const mockFetch = vi.fn().mockResolvedValue({
              ok: true,
              status: 200,
              json: async () => ({ success: true }),
            });
            global.fetch = mockFetch;
            
            // Execute: Make API request
            await apiClient.get(endpoint);
            
            // Verify: Authorization header includes the token
            const callArgs = mockFetch.mock.calls[0];
            const headers = callArgs[1].headers;
            
            expect(headers['Authorization']).toBe(`Bearer ${token}`);
            
            // Cleanup
            localStorage.removeItem('jwt_token');
          }
        ),
        propertyTestConfig
      );
    });

    it('does not include Authorization header when no token exists', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('/products', '/users', '/orders'),
          async (endpoint) => {
            // Setup: Ensure no token in localStorage
            localStorage.removeItem('jwt_token');
            
            // Mock fetch
            const mockFetch = vi.fn().mockResolvedValue({
              ok: true,
              status: 200,
              json: async () => ({ success: true }),
            });
            global.fetch = mockFetch;
            
            // Execute: Make API request
            await apiClient.get(endpoint);
            
            // Verify: No Authorization header
            const callArgs = mockFetch.mock.calls[0];
            const headers = callArgs[1].headers;
            
            expect(headers['Authorization']).toBeUndefined();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * **Validates: Requirements 40.2, 40.3, 40.5**
   * 
   * Property 35: API Error Response Handling
   * 
   * For any API request that returns an error response, the API client should
   * throw an appropriate error with the status code and error message.
   */
  describe('Property 35: API Error Response Handling', () => {
    it('throws ApiError with correct status and message for HTTP errors', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 400, max: 599 }), // Generate error status codes
          fc.string({ minLength: 1, maxLength: 100 }), // Generate error messages
          fc.constantFrom('/products', '/users', '/orders'),
          async (statusCode, errorMessage, endpoint) => {
            // Skip 401 as it has special handling
            if (statusCode === 401) return;
            
            // Mock fetch to return error response
            const mockFetch = vi.fn().mockResolvedValue({
              ok: false,
              status: statusCode,
              json: async () => ({ message: errorMessage }),
            });
            global.fetch = mockFetch;
            
            // Execute and verify: Should throw ApiError
            try {
              await apiClient.get(endpoint);
              // Should not reach here
              expect.fail('Expected ApiError to be thrown');
            } catch (error) {
              expect(error).toBeInstanceOf(ApiError);
              expect(error.status).toBe(statusCode);
              
              // API client has predefined messages for specific status codes
              if (statusCode === 403) {
                expect(error.message).toBe("You don't have permission to perform this action.");
              } else if (statusCode === 404) {
                expect(error.message).toBe('Resource not found.');
              } else if (statusCode === 500) {
                expect(error.message).toBe('Server error. Please try again later.');
              } else {
                expect(error.message).toBe(errorMessage);
              }
            }
          }
        ),
        propertyTestConfig
      );
    });

    it('throws ApiError with network error message for fetch failures', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('/products', '/users', '/orders'),
          async (endpoint) => {
            // Mock fetch to throw network error
            const mockFetch = vi.fn().mockRejectedValue(new Error('Network failure'));
            global.fetch = mockFetch;
            
            // Execute and verify: Should throw ApiError with network error message
            try {
              await apiClient.get(endpoint);
              expect.fail('Expected ApiError to be thrown');
            } catch (error) {
              expect(error).toBeInstanceOf(ApiError);
              expect(error.status).toBe(0);
              expect(error.message).toBe('Network error. Please check your connection.');
            }
          }
        ),
        propertyTestConfig
      );
    });

    it('handles 401 errors by clearing token and redirecting', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 20, maxLength: 200 }), // Generate JWT token
          fc.constantFrom('/products', '/users', '/orders'),
          async (token, endpoint) => {
            // Setup: Store token
            localStorage.setItem('jwt_token', token);
            
            // Mock fetch to return 401
            const mockFetch = vi.fn().mockResolvedValue({
              ok: false,
              status: 401,
              json: async () => ({ message: 'Unauthorized' }),
            });
            global.fetch = mockFetch;
            
            // Execute and verify
            try {
              await apiClient.get(endpoint);
              expect.fail('Expected ApiError to be thrown');
            } catch (error) {
              expect(error).toBeInstanceOf(ApiError);
              expect(error.status).toBe(401);
              expect(error.message).toBe('Unauthorized');
              
              // Verify token was removed
              expect(localStorage.getItem('jwt_token')).toBeNull();
              
              // Verify redirect was attempted
              expect(window.location.href).toBe('/admin/login');
            }
            
            // Cleanup
            localStorage.clear();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * **Validates: Requirements 40.5**
   * 
   * Property 40: API Client Base URL Configuration
   * 
   * For any API request made through the API client, the request URL should
   * use the base URL from environment configuration.
   */
  describe('Property 40: API Client Base URL Configuration', () => {
    it('constructs request URLs using the configured base URL', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('/products', '/users', '/orders', '/dashboard', '/settings'),
          async (endpoint) => {
            // Mock fetch
            const mockFetch = vi.fn().mockResolvedValue({
              ok: true,
              status: 200,
              json: async () => ({ success: true }),
            });
            global.fetch = mockFetch;
            
            // Execute: Make API request
            await apiClient.get(endpoint);
            
            // Verify: URL includes base URL
            const callArgs = mockFetch.mock.calls[0];
            const requestUrl = callArgs[0];
            
            // The base URL should be either from env or default
            const expectedBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
            expect(requestUrl).toBe(`${expectedBaseUrl}${endpoint}`);
          }
        ),
        propertyTestConfig
      );
    });

    it('correctly appends query parameters to base URL', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('/products', '/users', '/orders'),
          fc.record({
            page: fc.integer({ min: 1, max: 100 }),
            limit: fc.integer({ min: 1, max: 100 }),
          }),
          async (endpoint, params) => {
            // Mock fetch
            const mockFetch = vi.fn().mockResolvedValue({
              ok: true,
              status: 200,
              json: async () => ({ success: true }),
            });
            global.fetch = mockFetch;
            
            // Execute: Make API request with params
            await apiClient.get(endpoint, params);
            
            // Verify: URL includes base URL and query params
            const callArgs = mockFetch.mock.calls[0];
            const requestUrl = callArgs[0];
            
            const expectedBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
            const queryString = new URLSearchParams(params).toString();
            expect(requestUrl).toBe(`${expectedBaseUrl}${endpoint}?${queryString}`);
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * Additional property: HTTP method correctness
   * 
   * Verifies that each API client method uses the correct HTTP method
   */
  describe('HTTP Method Correctness', () => {
    it('uses correct HTTP methods for each operation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('/products', '/users', '/orders'),
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            value: fc.integer({ min: 0, max: 1000 }),
          }),
          async (endpoint, data) => {
            const mockFetch = vi.fn().mockResolvedValue({
              ok: true,
              status: 200,
              json: async () => ({ success: true }),
            });
            global.fetch = mockFetch;
            
            // Test GET
            await apiClient.get(endpoint);
            expect(mockFetch.mock.calls[0][1].method).toBe('GET');
            
            mockFetch.mockClear();
            
            // Test POST
            await apiClient.post(endpoint, data);
            expect(mockFetch.mock.calls[0][1].method).toBe('POST');
            expect(mockFetch.mock.calls[0][1].body).toBe(JSON.stringify(data));
            
            mockFetch.mockClear();
            
            // Test PUT
            await apiClient.put(endpoint, data);
            expect(mockFetch.mock.calls[0][1].method).toBe('PUT');
            expect(mockFetch.mock.calls[0][1].body).toBe(JSON.stringify(data));
            
            mockFetch.mockClear();
            
            // Test DELETE
            await apiClient.delete(endpoint);
            expect(mockFetch.mock.calls[0][1].method).toBe('DELETE');
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * Additional property: Content-Type header
   * 
   * Verifies that all requests include the correct Content-Type header
   */
  describe('Content-Type Header', () => {
    it('includes Content-Type: application/json header in all requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('/products', '/users', '/orders'),
          async (endpoint) => {
            const mockFetch = vi.fn().mockResolvedValue({
              ok: true,
              status: 200,
              json: async () => ({ success: true }),
            });
            global.fetch = mockFetch;
            
            await apiClient.get(endpoint);
            
            const headers = mockFetch.mock.calls[0][1].headers;
            expect(headers['Content-Type']).toBe('application/json');
          }
        ),
        propertyTestConfig
      );
    });
  });
});
