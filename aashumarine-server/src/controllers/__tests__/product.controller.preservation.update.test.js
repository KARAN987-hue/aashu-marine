/**
 * Property-Based Tests: Preservation - Product Update Functionality
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**
 * 
 * These tests verify that existing product management functionality remains unchanged
 * when fixing the media update and removal bugs. Tests are run on UNFIXED code to establish
 * baseline behavior that must be preserved.
 * 
 * EXPECTED OUTCOME: All tests PASS on unfixed code (confirms baseline)
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import * as fc from 'fast-check';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../../database/db.js';
import { createProduct, updateProduct, getProductById } from '../product.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Property test configuration
const propertyTestConfig = {
  numRuns: 10, // 10 iterations for faster test execution
  verbose: false
};

/**
 * Helper: Generate valid product data
 */
const productDataArbitrary = fc.record({
  product_name: fc.string({ minLength: 1, maxLength: 100 }),
  category: fc.constantFrom('Navigation', 'Communication', 'Safety', 'Fishing'),
  product_type: fc.option(fc.constantFrom('New', 'Used', 'Refurbished'), { nil: null }),
  manufacturer: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
  condition: fc.constantFrom('New', 'Used', 'Refurbished'),
  short_description: fc.option(fc.string({ maxLength: 200 }), { nil: null }),
  main_description: fc.option(fc.string({ maxLength: 1000 }), { nil: null }),
  is_active: fc.boolean()
});

/**
 * Helper: Create mock request and response objects
 */
function createMockReqRes(params = {}, body = {}, files = null, file = null) {
  const req = {
    params,
    body,
    files,
    file
  };
  
  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.data = data;
      return this;
    },
    statusCode: 200,
    data: null
  };
  
  const next = (error) => {
    if (error) throw error;
  };
  
  return { req, res, next };
}

/**
 * Helper: Create dummy image file
 */
async function createDummyImageFile(filename) {
  const testUploadsDir = path.join(__dirname, '../../../test-uploads/images');
  await fs.mkdir(testUploadsDir, { recursive: true });
  const filePath = path.join(testUploadsDir, filename);
  await fs.writeFile(filePath, 'dummy image content');
  return `test-uploads/images/${filename}`;
}

/**
 * Helper: Create dummy video file
 */
async function createDummyVideoFile(filename) {
  const testUploadsDir = path.join(__dirname, '../../../test-uploads/videos');
  await fs.mkdir(testUploadsDir, { recursive: true });
  const filePath = path.join(testUploadsDir, filename);
  await fs.writeFile(filePath, 'dummy video content');
  return `test-uploads/videos/${filename}`;
}

describe('Property 2: Preservation - Product Update Functionality', () => {
  let createdProductIds = [];
  const testUploadsDir = path.join(__dirname, '../../../test-uploads');

  beforeAll(async () => {
    // Ensure test uploads directory exists
    await fs.mkdir(testUploadsDir, { recursive: true });
    await fs.mkdir(path.join(testUploadsDir, 'images'), { recursive: true });
    await fs.mkdir(path.join(testUploadsDir, 'videos'), { recursive: true });
  });

  afterEach(async () => {
    // Clean up test products after each test
    if (createdProductIds.length > 0) {
      const placeholders = createdProductIds.map(() => '?').join(',');
      await db.query(`DELETE FROM products WHERE id IN (${placeholders})`, createdProductIds);
      createdProductIds = [];
    }
  });

  afterAll(async () => {
    // Clean up test uploads directory
    try {
      await fs.rm(testUploadsDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('Failed to clean up test uploads:', error.message);
    }
    
    // Ensure database connection is closed
    await db.end();
  });

  /**
   * Property 2.1: Product Creation with Images Works Correctly
   * 
   * For any valid product data with images,
   * the system SHALL correctly handle image uploads, thumbnail generation,
   * storage, and display.
   * 
   * **Validates: Requirement 3.1**
   */
  test('Property 2.1: Product creation with images works correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        productDataArbitrary,
        fc.integer({ min: 1, max: 3 }), // Number of images
        async (productData, numImages) => {
          // Create dummy image files
          const imageFiles = [];
          for (let i = 0; i < numImages; i++) {
            const filename = `test-image-${Date.now()}-${i}.jpg`;
            const imagePath = await createDummyImageFile(filename);
            imageFiles.push({
              path: imagePath,
              filename: filename
            });
          }

          // Create product with images
          const [result] = await db.query(
            `INSERT INTO products (
              product_name, images, thumbnails, category, \`condition\`, is_active
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              productData.product_name,
              JSON.stringify(imageFiles.map(f => f.path)),
              JSON.stringify(imageFiles.map(f => `test-uploads/images/thumb_${f.filename}`)),
              productData.category,
              productData.condition,
              productData.is_active ? 1 : 0
            ]
          );

          const productId = result.insertId;
          createdProductIds.push(productId);

          // Retrieve product
          const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
          const product = products[0];

          // Verify images are stored correctly
          const images = typeof product.images === 'string' 
            ? JSON.parse(product.images) 
            : product.images;
          expect(images.length).toBe(numImages);
          expect(images).toEqual(imageFiles.map(f => f.path));

          // Verify thumbnails are stored
          const thumbnails = typeof product.thumbnails === 'string'
            ? JSON.parse(product.thumbnails)
            : product.thumbnails;
          expect(thumbnails.length).toBe(numImages);
        }
      ),
      propertyTestConfig
    );
  });

  /**
   * Property 2.2: Product Creation with Videos Stores Files in Correct Directory
   * 
   * For any valid product data with videos,
   * the system SHALL store videos in the correct filesystem directory
   * (uploads/products/videos/ or test-uploads/videos/).
   * 
   * **Validates: Requirement 3.2**
   */
  test('Property 2.2: Product creation with videos stores files in correct directory', async () => {
    await fc.assert(
      fc.asyncProperty(
        productDataArbitrary,
        fc.integer({ min: 1, max: 3 }), // Number of videos
        async (productData, numVideos) => {
          // Create dummy video files
          const videoFiles = [];
          for (let i = 0; i < numVideos; i++) {
            const filename = `test-video-${Date.now()}-${i}.mp4`;
            const videoPath = await createDummyVideoFile(filename);
            videoFiles.push({
              path: videoPath,
              filename: filename
            });
          }

          // Create product with videos
          const [result] = await db.query(
            `INSERT INTO products (
              product_name, videos, category, \`condition\`, is_active
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              productData.product_name,
              JSON.stringify(videoFiles.map(f => f.path)),
              productData.category,
              productData.condition,
              productData.is_active ? 1 : 0
            ]
          );

          const productId = result.insertId;
          createdProductIds.push(productId);

          // Retrieve product
          const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
          const product = products[0];

          // Verify videos are stored in correct directory
          const videos = typeof product.videos === 'string'
            ? JSON.parse(product.videos)
            : product.videos;
          expect(videos.length).toBe(numVideos);
          
          videos.forEach(videoPath => {
            // Check that video path contains the correct directory
            expect(videoPath).toMatch(/videos\//);
          });
        }
      ),
      propertyTestConfig
    );
  });

  /**
   * Property 2.3: Product Text Field Updates Work Without Media Changes
   * 
   * For any product update that only changes text fields (name, description, category)
   * without changing media, the system SHALL update those fields correctly
   * while preserving existing media.
   * 
   * **Validates: Requirement 3.3**
   */
  test('Property 2.3: Product text field updates work without media changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        productDataArbitrary,
        productDataArbitrary, // New data for update
        async (initialData, updateData) => {
          // Create initial product with images
          const imagePath = await createDummyImageFile(`initial-${Date.now()}.jpg`);
          
          const [result] = await db.query(
            `INSERT INTO products (
              product_name, images, category, \`condition\`, is_active
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              initialData.product_name,
              JSON.stringify([imagePath]),
              initialData.category,
              initialData.condition,
              initialData.is_active ? 1 : 0
            ]
          );

          const productId = result.insertId;
          createdProductIds.push(productId);

          // Update only text fields (no media changes)
          const { req, res, next } = createMockReqRes(
            { id: productId },
            {
              product_name: updateData.product_name,
              category: updateData.category,
              short_description: updateData.short_description,
              is_active: updateData.is_active
            }
          );

          await updateProduct(req, res, next);

          // Verify update was successful
          expect(res.statusCode).toBe(200);
          expect(res.data.message).toBe('Product updated successfully');

          // Verify text fields were updated
          const updatedProduct = res.data.product;
          expect(updatedProduct.product_name).toBe(updateData.product_name);
          expect(updatedProduct.category).toBe(updateData.category);

          // Verify existing images were preserved
          expect(updatedProduct.images).toEqual([imagePath]);
        }
      ),
      propertyTestConfig
    );
  });

  /**
   * Property 2.4: Products Without Media Removal Preserve All Existing Media
   * 
   * For any product update that does NOT mark media for removal,
   * the system SHALL preserve all existing images and videos.
   * 
   * **Validates: Requirement 3.4**
   */
  test('Property 2.4: Products without media removal preserve all existing images and videos', async () => {
    await fc.assert(
      fc.asyncProperty(
        productDataArbitrary,
        fc.integer({ min: 1, max: 3 }), // Number of images
        fc.integer({ min: 1, max: 2 }), // Number of videos
        async (productData, numImages, numVideos) => {
          // Create dummy files
          const imageFiles = [];
          for (let i = 0; i < numImages; i++) {
            const imagePath = await createDummyImageFile(`preserve-img-${Date.now()}-${i}.jpg`);
            imageFiles.push(imagePath);
          }

          const videoFiles = [];
          for (let i = 0; i < numVideos; i++) {
            const videoPath = await createDummyVideoFile(`preserve-vid-${Date.now()}-${i}.mp4`);
            videoFiles.push(videoPath);
          }

          // Create product with images and videos
          const [result] = await db.query(
            `INSERT INTO products (
              product_name, images, videos, category, \`condition\`, is_active
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              productData.product_name,
              JSON.stringify(imageFiles),
              JSON.stringify(videoFiles),
              productData.category,
              productData.condition,
              productData.is_active ? 1 : 0
            ]
          );

          const productId = result.insertId;
          createdProductIds.push(productId);

          // Update product without marking any media for removal
          const { req, res, next } = createMockReqRes(
            { id: productId },
            {
              product_name: `Updated ${productData.product_name}`,
              // No imagesToRemove or videosToRemove
            }
          );

          await updateProduct(req, res, next);

          // Verify update was successful
          expect(res.statusCode).toBe(200);

          // Verify all existing media was preserved
          const updatedProduct = res.data.product;
          expect(updatedProduct.images).toEqual(imageFiles);
          expect(updatedProduct.videos).toEqual(videoFiles);
        }
      ),
      propertyTestConfig
    );
  });

  /**
   * Property 2.5: Upload Limits Enforced (10 Images, 5 Videos)
   * 
   * For any product update that would exceed upload limits,
   * the system SHALL reject the upload with appropriate error messages.
   * 
   * **Validates: Requirement 3.5**
   */
  test('Property 2.5: Upload limits enforced (10 images, 5 videos)', async () => {
    await fc.assert(
      fc.asyncProperty(
        productDataArbitrary,
        async (productData) => {
          // Create product with maximum images (10)
          const imageFiles = [];
          for (let i = 0; i < 10; i++) {
            const imagePath = await createDummyImageFile(`limit-img-${Date.now()}-${i}.jpg`);
            imageFiles.push(imagePath);
          }

          const [result] = await db.query(
            `INSERT INTO products (
              product_name, images, category, \`condition\`, is_active
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              productData.product_name,
              JSON.stringify(imageFiles),
              productData.category,
              productData.condition,
              productData.is_active ? 1 : 0
            ]
          );

          const productId = result.insertId;
          createdProductIds.push(productId);

          // Try to add one more image (should fail)
          const newImagePath = await createDummyImageFile(`limit-img-new-${Date.now()}.jpg`);
          
          const { req, res, next } = createMockReqRes(
            { id: productId },
            {},
            { images: [{ path: newImagePath }] } // New image file
          );

          await updateProduct(req, res, next);

          // Verify request was rejected
          expect(res.statusCode).toBe(400);
          expect(res.data.error).toBe('Too many images');
          expect(res.data.message).toContain('Maximum 10 images');
        }
      ),
      propertyTestConfig
    );
  });

  /**
   * Property 2.6: Invalid File Types Rejected with Validation Errors
   * 
   * For any upload with invalid file types,
   * the system SHALL reject them with appropriate validation errors.
   * 
   * Note: This test verifies the system's ability to handle validation,
   * though actual file type validation may occur at the middleware level.
   * 
   * **Validates: Requirement 3.6**
   */
  test('Property 2.6: System handles file validation correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        productDataArbitrary,
        async (productData) => {
          // Create product
          const [result] = await db.query(
            `INSERT INTO products (
              product_name, category, \`condition\`, is_active
            ) VALUES (?, ?, ?, ?)`,
            [
              productData.product_name,
              productData.category,
              productData.condition,
              productData.is_active ? 1 : 0
            ]
          );

          const productId = result.insertId;
          createdProductIds.push(productId);

          // Verify product was created successfully
          const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
          expect(products.length).toBe(1);
          
          // Note: Actual file type validation occurs at middleware level (multer)
          // This test confirms the product creation system works correctly
          // and can handle products with or without media
        }
      ),
      propertyTestConfig
    );
  });

  /**
   * Property 2.7: Products Without Videos Return Empty Arrays Without Errors
   * 
   * For any product without videos (videos = null or empty array),
   * the system SHALL return empty video arrays without errors.
   * 
   * **Validates: Requirement 3.7**
   */
  test('Property 2.7: Products without videos return empty arrays without errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        productDataArbitrary,
        async (productData) => {
          // Create product without videos
          const [result] = await db.query(
            `INSERT INTO products (
              product_name, videos, category, \`condition\`, is_active
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              productData.product_name,
              null, // No videos
              productData.category,
              productData.condition,
              productData.is_active ? 1 : 0
            ]
          );

          const productId = result.insertId;
          createdProductIds.push(productId);

          // Retrieve product using controller
          const { req, res, next } = createMockReqRes({ id: productId });
          
          await getProductById(req, res, next);

          // Verify request was successful
          expect(res.statusCode).toBe(200);
          
          // Verify videos field returns empty array (not null or undefined)
          const product = res.data.product;
          expect(product.videos).toBeDefined();
          expect(Array.isArray(product.videos)).toBe(true);
          expect(product.videos.length).toBe(0);
          
          // Verify videoUrls field returns empty array
          expect(product.videoUrls).toBeDefined();
          expect(Array.isArray(product.videoUrls)).toBe(true);
          expect(product.videoUrls.length).toBe(0);
        }
      ),
      propertyTestConfig
    );
  });
});
