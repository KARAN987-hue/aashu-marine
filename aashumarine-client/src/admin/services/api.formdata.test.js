import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './api';

describe('API Client - FormData Handling', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn();
    localStorage.setItem('jwt_token', 'test-token');
  });

  it('should not set Content-Type header for FormData in POST request', async () => {
    const formData = new FormData();
    formData.append('product_name', 'Test Product');
    formData.append('image', new Blob(['test'], { type: 'image/jpeg' }));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await apiClient.post('/products', formData);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: formData,
        headers: expect.not.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    // Verify Authorization header is still set
    const callArgs = global.fetch.mock.calls[0][1];
    expect(callArgs.headers.Authorization).toBe('Bearer test-token');
  });

  it('should not set Content-Type header for FormData in PUT request', async () => {
    const formData = new FormData();
    formData.append('product_name', 'Updated Product');
    formData.append('image', new Blob(['test'], { type: 'image/jpeg' }));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await apiClient.put('/products/1', formData);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'PUT',
        body: formData,
        headers: expect.not.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should set Content-Type to application/json for regular objects in POST', async () => {
    const data = { product_name: 'Test Product' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await apiClient.post('/products', data);

    const callArgs = global.fetch.mock.calls[0][1];
    expect(callArgs.headers['Content-Type']).toBe('application/json');
    expect(callArgs.body).toBe(JSON.stringify(data));
  });

  it('should set Content-Type to application/json for regular objects in PUT', async () => {
    const data = { product_name: 'Updated Product' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await apiClient.put('/products/1', data);

    const callArgs = global.fetch.mock.calls[0][1];
    expect(callArgs.headers['Content-Type']).toBe('application/json');
    expect(callArgs.body).toBe(JSON.stringify(data));
  });
});
