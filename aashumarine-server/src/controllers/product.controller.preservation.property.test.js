/**
 * Property-Based Tests: Preservation - Image Functionality Unchanged
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 * 
 * These tests verify that existing image functionality remains unchanged
 * when fixing the video bug. Tests are run on UNFIXED code to establish
 * baseline behavior that must be preserved.
 * 
 * EXPECTED OUTCOME: All tests PASS on unfixed code (confirms baseline)
 */

import fc from 'fast-check';
import request from 'supertest';
import express from 'express';
import productRoutes from '../routes/product.routes.js';
import db from '../database/db.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

// Property test configuration
const propertyTestConfig = {
  numRuns: 20, // 20 iterations for faster test execution
  verbose: false
};

/**
 * Helper: Generate valid product data with images only (no videos)
 */
const productWithImagesArbitrary = fc.record({
  product_name: fc.string({ minLength: 1, maxLength: 100 }),
  category: fc.constantFrom('Navigation', 'Communication', 'Safety', 'Fishing'),
  product_type: fc.option(fc.constantFrom('New', 'Used', 'Refurbished'), { nil: null }),
  manufacturer: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
  condition: fc.constantFrom('New', 'Used', 'Refurbished'),
  short_description: fc.option(fc.string({ maxLength: 200 }), { nil: null }),
  is_active: fc.boolean()
});

/**
 * Helper: Clean up test products
 */
const cleanupTestProducts = async (productIds) => {
  if (productIds.length === 0) return;
  
  const placeholders = productIds.map(() => '?').join(',');
  await db.query(`DELETE FROM products WHERE id IN (${placeholders})`, productIds);
};

describe('Property 2: Preservation - Image Functionality Unchanged', () => {
  let createdProductIds = [];

  afterEach(async () => {
    // Clean up test products after each test
    await cleanupTestProducts(createdProductIds);
    createdProductIds = [];
  });

  afterAll(async () => {
    // Ensure database connection is closed
    await db.end();
  });

  /**
   * Property 2.1: Image Upload and Retrieval Preservation
   * 
   * For any product created with images only (no videos),
   * the system SHALL return all image fields correctly:
   * - images: array of image paths
   * - imageUrls: array of full image URLs
   * - thumbnails: array of thumbnail paths
   * - thumbnailUrls: array of full thumbnail URLs
   * - imageUrl: first image URL (backward compatibility)
   * - thumbnailUrl: first thumbnail URL (backward compatibility)
   * 
   * **Validates: Requirements 3.1, 3.2**
   */
  test('Property 2.1: Products with images return all image fields correctly', async () => {
    await fc.assert(
      fc.asyncProperty(productWithImagesArbitrary, async (productData) => {
        // Create product with images (simulated - no actual file upload in property test)
        const mockImagePaths = ['uploads/products/test-image-1.jpg', 'uploads/products/test-image-2.jpg'];
        const mockThumbnailPaths = ['uploads/products/thumb_test-image-1.jpg', 'uploads/products/thumb_test-image-2.jpg'];

        const [result] = await db.query(
          `INSERT INTO products (
            product_name, images, thumbnails, category, \`condition\`, is_active
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            productData.product_name,
            JSON.stringify(mockImagePaths),
            JSON.stringify(mockThumbnailPaths),
            productData.category,
            productData.condition,
            productData.is_active ? 1 : 0
          ]
        );

        const productId = result.insertId;
        createdProductIds.push(productId);

        // Retrieve product via GET /api/products/:id
        const response = await request(app)
          .get(`/api/products/${productId}`)
          .expect(200);

        const product = response.body.product;

        // Verify all image fields are present and correct
        expect(product).toHaveProperty('images');
        expect(product).toHaveProperty('imageUrls');
        expect(product).toHaveProperty('thumbnails');
        expect(product).toHaveProperty('thumbnailUrls');
        expect(product).toHaveProperty('imageUrl');
        expect(product).toHaveProperty('thumbnailUrl');

        // Verify images array is parsed correctly
        expect(Array.isArray(product.images)).toBe(true);
        expect(product.images.length).toBe(2);
        expect(product.images).toEqual(mockImagePaths);

        // Verify imageUrls array is generated correctly
        expect(Array.isArray(product.imageUrls)).toBe(true);
        expect(product.imageUrls.length).toBe(2);
        product.imageUrls.forEach(url => {
          expect(url).toMatch(/^http:\/\/localhost:5000\/uploads\/products\//);
        });

        // Verify thumbnails array is parsed correctly
        expect(Array.isArray(product.thumbnails)).toBe(true);
        expect(product.thumbnails.length).toBe(2);
        expect(product.thumbnails).toEqual(mockThumbnailPaths);

        // Verify thumbnailUrls array is generated correctly
        expect(Array.isArray(product.thumbnailUrls)).toBe(true);
        expect(product.thumbnailUrls.length).toBe(2);
        product.thumbnailUrls.forEach(url => {
          expect(url).toMatch(/^http:\/\/localhost:5000\/uploads\/products\/thumb_/);
        });

        // Verify backward compatibility fields
        expect(product.imageUrl).toMatch(/^http:\/\/localhost:5000\/uploads\/products\/test-image-1\.jpg$/);
        expect(product.thumbnailUrl).toMatch(/^http:\/\/localhost:5000\/uploads\/products\/thumb_test-image-1\.jpg$/);
      }),
      propertyTestConfig
    );
  });

  /**
   * Property 2.2: Products Without Videos Function Normally
   * 
   * For any product without videos (videos = null or empty array),
   * the system SHALL return all product data correctly including
   * all image fields, and the product SHALL function normally.
   * 
   * **Validates: Requirements 3.2, 3.3**
   */
  test('Property 2.2: Products without videos return all fields correctly', async () => {
    await fc.assert(
      fc.asyncProperty(productWithImagesArbitrary, async (productData) => {
        // Create product without videos (videos = null)
        const mockImagePaths = ['uploads/products/test-image.jpg'];
        const mockThumbnailPaths = ['uploads/products/thumb_test-image.jpg'];

        const [result] = await db.query(
          `INSERT INTO products (
            product_name, images, thumbnails, videos, category, \`condition\`, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            productData.product_name,
            JSON.stringify(mockImagePaths),
            JSON.stringify(mockThumbnailPaths),
            null, // No videos
            productData.category,
            productData.condition,
            productData.is_active ? 1 : 0
          ]
        );

        const productId = result.insertId;
        createdProductIds.push(productId);

        // Retrieve product via GET /api/products
        const listResponse = await request(app)
          .get('/api/products')
          .query({ page: 1, limit: 100, is_active: productData.is_active })
          .expect(200);

        const productInList = listResponse.body.products.find(p => p.id === productId);
        expect(productInList).toBeDefined();

        // Verify all image fields are present
        expect(productInList).toHaveProperty('images');
        expect(productInList).toHaveProperty('imageUrls');
        expect(productInList).toHaveProperty('thumbnails');
        expect(productInList).toHaveProperty('thumbnailUrls');
        expect(productInList).toHaveProperty('imageUrl');
        expect(productInList).toHaveProperty('thumbnailUrl');

        // Verify image data is correct
        expect(productInList.images).toEqual(mockImagePaths);
        expect(productInList.imageUrls.length).toBe(1);
        expect(productInList.thumbnails).toEqual(mockThumbnailPaths);
        expect(productInList.thumbnailUrls.length).toBe(1);

        // Retrieve same product via GET /api/products/:id
        const detailResponse = await request(app)
          .get(`/api/products/${productId}`)
          .expect(200);

        const productDetail = detailResponse.body.product;

        // Verify consistency between list and detail endpoints
        expect(productDetail.images).toEqual(productInList.images);
        expect(productDetail.imageUrls).toEqual(productInList.imageUrls);
        expect(productDetail.thumbnails).toEqual(productInList.thumbnails);
        expect(productDetail.thumbnailUrls).toEqual(productInList.thumbnailUrls);
      }),
      propertyTestConfig
    );
  });

  /**
   * Property 2.3: Image-Only Operations Produce Consistent Results
   * 
   * For any product operation involving only images (no videos),
   * the system SHALL produce consistent results across multiple
   * retrievals and the image data SHALL remain unchanged.
   * 
   * **Validates: Requirements 3.1, 3.2**
   */
  test('Property 2.3: Image data remains consistent across multiple retrievals', async () => {
    await fc.assert(
      fc.asyncProperty(
        productWithImagesArbitrary,
        fc.integer({ min: 1, max: 5 }), // Number of images
        async (productData, numImages) => {
          // Create mock image paths
          const mockImagePaths = Array.from({ length: numImages }, (_, i) => 
            `uploads/products/test-image-${i + 1}.jpg`
          );
          const mockThumbnailPaths = Array.from({ length: numImages }, (_, i) => 
            `uploads/products/thumb_test-image-${i + 1}.jpg`
          );

          const [result] = await db.query(
            `INSERT INTO products (
              product_name, images, thumbnails, category, \`condition\`, is_active
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              productData.product_name,
              JSON.stringify(mockImagePaths),
              JSON.stringify(mockThumbnailPaths),
              productData.category,
              productData.condition,
              productData.is_active ? 1 : 0
            ]
          );

          const productId = result.insertId;
          createdProductIds.push(productId);

          // Retrieve product multiple times
          const response1 = await request(app).get(`/api/products/${productId}`).expect(200);
          const response2 = await request(app).get(`/api/products/${productId}`).expect(200);
          const response3 = await request(app).get(`/api/products/${productId}`).expect(200);

          // Verify image data is identical across all retrievals
          expect(response1.body.product.images).toEqual(response2.body.product.images);
          expect(response2.body.product.images).toEqual(response3.body.product.images);
          expect(response1.body.product.imageUrls).toEqual(response2.body.product.imageUrls);
          expect(response2.body.product.imageUrls).toEqual(response3.body.product.imageUrls);
          expect(response1.body.product.thumbnails).toEqual(response2.body.product.thumbnails);
          expect(response2.body.product.thumbnails).toEqual(response3.body.product.thumbnails);
          expect(response1.body.product.thumbnailUrls).toEqual(response2.body.product.thumbnailUrls);
          expect(response2.body.product.thumbnailUrls).toEqual(response3.body.product.thumbnailUrls);

          // Verify correct number of images
          expect(response1.body.product.images.length).toBe(numImages);
          expect(response1.body.product.imageUrls.length).toBe(numImages);
          expect(response1.body.product.thumbnails.length).toBe(numImages);
          expect(response1.body.product.thumbnailUrls.length).toBe(numImages);
        }
      ),
      propertyTestConfig
    );
  });

  /**
   * Property 2.4: Empty Image Arrays Handled Correctly
   * 
   * For any product with no images (empty array or null),
   * the system SHALL return empty arrays for image fields
   * and null for backward compatibility fields.
   * 
   * **Validates: Requirements 3.2, 3.3**
   */
  test('Property 2.4: Products without images return empty arrays', async () => {
    await fc.assert(
      fc.asyncProperty(productWithImagesArbitrary, async (productData) => {
        // Create product without images
        const [result] = await db.query(
          `INSERT INTO products (
            product_name, images, thumbnails, category, \`condition\`, is_active
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            productData.product_name,
            null, // No images
            null, // No thumbnails
            productData.category,
            productData.condition,
            productData.is_active ? 1 : 0
          ]
        );

        const productId = result.insertId;
        createdProductIds.push(productId);

        // Retrieve product
        const response = await request(app)
          .get(`/api/products/${productId}`)
          .expect(200);

        const product = response.body.product;

        // Verify empty arrays for image fields
        expect(product.images).toEqual([]);
        expect(product.imageUrls).toEqual([]);
        expect(product.thumbnails).toEqual([]);
        expect(product.thumbnailUrls).toEqual([]);

        // Verify null for backward compatibility fields
        expect(product.imageUrl).toBeNull();
        expect(product.thumbnailUrl).toBeNull();
      }),
      propertyTestConfig
    );
  });
});
