import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Product_Detail_Page from './Product_Detail_Page';
import { productApi } from '../services/productApi';

/**
 * Integration tests for Product_Detail_Page thumbnail functionality
 * Validates: Requirements 10.3, 10.4
 */

vi.mock('../services/productApi');
vi.mock('../services/publicApi');

describe('Product_Detail_Page - Thumbnail Integration', () => {
  const mockProduct = {
    id: 1,
    product_name: 'Test Product',
    category: 'Test Category',
    imageUrls: [
      'http://localhost:3000/uploads/full-image1.jpg',
      'http://localhost:3000/uploads/full-image2.jpg'
    ],
    thumbnailUrls: [
      'http://localhost:3000/uploads/thumb-image1.jpg',
      'http://localhost:3000/uploads/thumb-image2.jpg'
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses thumbnails in ProductGallery - Requirement 10.4', async () => {
    productApi.getById.mockResolvedValue({ product: mockProduct });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<Product_Detail_Page />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Verify ProductGallery uses thumbnail (check the first image in gallery)
    const galleryImage = screen.getByAltText(/Test Product - Image 1 of 2/i);
    expect(galleryImage.src).toContain('thumb-image1.jpg');
  });

  it('uses full images in LightboxViewer - Requirement 10.3', async () => {
    const user = userEvent.setup();
    productApi.getById.mockResolvedValue({ product: mockProduct });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<Product_Detail_Page />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Click on gallery image to open lightbox
    const galleryImage = screen.getByAltText(/Test Product - Image 1 of 2/i);
    await user.click(galleryImage);

    // Wait for lightbox to open and verify it uses full-resolution image
    await waitFor(() => {
      const lightboxImages = screen.getAllByAltText(/Test Product - Image/i);
      // Find the lightbox image (there will be 2: one in gallery, one in lightbox)
      const lightboxImage = lightboxImages.find(img => img.src.includes('full-image1.jpg'));
      expect(lightboxImage).toBeDefined();
    });
  });

  it('falls back to full images when thumbnails not available', async () => {
    const productWithoutThumbnails = {
      ...mockProduct,
      thumbnailUrls: []
    };
    productApi.getById.mockResolvedValue({ product: productWithoutThumbnails });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<Product_Detail_Page />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Verify ProductGallery falls back to full images
    const galleryImage = screen.getByAltText(/Test Product - Image 1 of 2/i);
    expect(galleryImage.src).toContain('full-image1.jpg');
  });
});
