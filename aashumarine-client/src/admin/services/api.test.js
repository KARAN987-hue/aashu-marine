import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiClient, ApiError } from './api';

describe('API Client', () => {
  let originalFetch;
  let originalLocalStorage;
  let originalLocation;

  beforeEach(() => {
    // Mock fetch
    originalFetch = global.fetch;
    global.fetch = vi.fn();

    // Mock localStorage
    originalLocalStorage = global.localStorage;
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    // Mock window.location
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.localStorage = originalLocalStorage;
    window.location = originalLocation;
    vi.clearAllMocks();
  });

  describe('ApiError', () => {
    it('should create an error with message, status, and data', () => {
      const error = new ApiError('Test error', 400, { field: 'email' });
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.data).toEqual({ field: 'email' });
      expect(error.name).toBe('ApiError');
    });
  });

  describe('request method', () => {
    it('should include JWT token in Authorization header when token exists', async () => {
      localStorage.getItem.mockReturnValue('test-token');
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await apiClient.request('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    it('should not include Authorization header when no token exists', async () => {
      localStorage.getItem.mockReturnValue(null);
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await apiClient.request('/test');

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.headers['Authorization']).toBeUndefined();
    });

    it('should handle 401 response by clearing token and redirecting', async () => {
      localStorage.getItem.mockReturnValue('test-token');
      global.fetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(apiClient.request('/test')).rejects.toThrow('Unauthorized');
      expect(localStorage.removeItem).toHaveBeenCalledWith('jwt_token');
      expect(window.location.href).toBe('/admin/login');
    });

    it('should throw ApiError with response message on error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' }),
      });

      await expect(apiClient.request('/test')).rejects.toThrow(ApiError);
      await expect(apiClient.request('/test')).rejects.toThrow('Bad request');
    });

    it('should throw network error on fetch failure', async () => {
      global.fetch.mockRejectedValue(new Error('Network failure'));

      await expect(apiClient.request('/test')).rejects.toThrow(ApiError);
      await expect(apiClient.request('/test')).rejects.toThrow('Network error. Please check your connection.');
    });

    it('should return response data on success', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test data' }),
      });

      const result = await apiClient.request('/test');
      expect(result).toEqual({ data: 'test data' });
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });
    });

    it('should make GET request with query parameters', async () => {
      await apiClient.get('/test', { page: 1, limit: 10 });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test?page=1&limit=10'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should make POST request with body', async () => {
      const data = { name: 'Test' };
      await apiClient.post('/test', data);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
        })
      );
    });

    it('should make PUT request with body', async () => {
      const data = { name: 'Updated' };
      await apiClient.put('/test', data);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(data),
        })
      );
    });

    it('should make DELETE request', async () => {
      await apiClient.delete('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('Base URL configuration', () => {
    it('should use environment variable for base URL', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await apiClient.get('/test');

      const calledUrl = global.fetch.mock.calls[0][0];
      expect(calledUrl).toMatch(/^http:\/\/localhost:3000\/api\/test/);
    });
  });
});
