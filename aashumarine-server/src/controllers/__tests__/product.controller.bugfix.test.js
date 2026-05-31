import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import * as fc from 'fast-check';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../../database/db.js';
import { updateProduct } from '../product.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Bug Condition Exploration Test for Product Media Update and Removal
 * 
 * **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6**
 * 
 * This test explores the bug condition where:
 * - Images marked for removal are NOT deleted from database and filesystem
 * - Videos marked for removal are NOT deleted from database and filesystem
 * - New images are NOT added to existing product's image collection
 * - New videos are NOT added to existing product's video collection
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
 */

// Helper to create mock request and response objects
function createMockReqRes(params = {}, body = {}, files = null) {
  const req = {
    params,
    body,
    files,
    file: null
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

describe('Property 1: Fault Condition - Media Update and Removal Failures', () => {
  let testProductId;
  const testUploadsDir = path.join(__dirname, '../../../test-uploads');
  
  beforeAll(async () => {
    // Ensure test uploads directory exists
    await fs.mkdir(testUploadsDir, { recursive: true });
    await fs.mkdir(path.join(testUploadsDir, 'images'), { recursive: true });
    await fs.mkdir(path.join(testUploadsDir, 'videos'), { recursive: true });
  });

  afterAll(async () => {
    // Clean up test uploads directory
    try {
      await fs.rm(testUploadsDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('Failed to clean up test uploads:', error.message);
    }
  });

  beforeEach(async () => {
    // Create a test product with existing images and videos
    const testImages = [
      'test-uploads/images/existing-image-1.jpg',
      'test-uploads/images/existing-image-2.jpg'
    ];
    const testVideos = [
      'test-uploads/videos/existing-video-1.mp4'
    ];
    
    // Create dummy files for existing media - use absolute paths from project root
    const projectRoot = path.join(__dirname, '../../../');
    for (const imagePath of testImages) {
      const fullPath = path.join(projectRoot, imagePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, 'dummy image content');
    }
    
    for (const videoPath of testVideos) {
      const fullPath = path.join(projectRoot, videoPath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, 'dummy video content');
    }
    
    // Insert test product into database
    const [result] = await db.query(
      `INSERT INTO products (
        product_name, category, product_type, manufacturer, 
        \`condition\`, model, search_keyword, short_description, 
        main_description, owner, is_active, images, thumbnails, videos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Test Product',
        'Test Category',
        'Test Type',
        'Test Manufacturer',
        'New',
        'Test Model',
        'test',
        'Short description',
        'Main description',
        'Test Owner',
        1,
        JSON.stringify(testImages),
        JSON.stringify([]),
        JSON.stringify(testVideos)
      ]
    );
    
    testProductId = result.insertId;
  });

  afterEach(async () => {
    // Clean up test product
    if (testProductId) {
      await db.query('DELETE FROM products WHERE id = ?', [testProductId]);
      testProductId = null;
    }
  });

  /**
   * Property-based test: Images marked for removal should be deleted
   * 
   * This test verifies that when imagesToRemove array is provided,
   * the marked images are removed from both database and filesystem.
   */
  test('should remove images marked in imagesToRemove array', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          ['test-uploads/images/existing-image-1.jpg'],
          ['test-uploads/images/existing-image-2.jpg'],
          ['test-uploads/images/existing-image-1.jpg', 'test-uploads/images/existing-image-2.jpg']
        ),
        async (imagesToRemove) => {
          // Recreate files before each property test run
          const projectRoot = path.join(__dirname, '../../../');
          const testImages = [
            'test-uploads/images/existing-image-1.jpg',
            'test-uploads/images/existing-image-2.jpg'
          ];
          for (const imagePath of testImages) {
            const fullPath = path.join(projectRoot, imagePath);
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, 'dummy image content');
          }
          
          // Get current product state
          const [beforeProducts] = await db.query('SELECT * FROM products WHERE id = ?', [testProductId]);
          const beforeProduct = beforeProducts[0];
          const beforeImages = typeof beforeProduct.images === 'string' 
            ? JSON.parse(beforeProduct.images) 
            : beforeProduct.images;
          
          // Verify files exist before removal
          for (const imagePath of imagesToRemove) {
            const fullPath = path.join(__dirname, '../../../', imagePath);
            const exists = await fs.access(fullPath).then(() => true).catch(() => false);
            expect(exists).toBe(true);
          }
          
          // Call controller with imagesToRemove
          const { req, res, next } = createMockReqRes(
            { id: testProductId },
            { imagesToRemove: JSON.stringify(imagesToRemove) }
          );
          
          await updateProduct(req, res, next);
          
          // Get updated product
          const [afterProducts] = await db.query('SELECT * FROM products WHERE id = ?', [testProductId]);
          const afterProduct = afterProducts[0];
          const afterImages = typeof afterProduct.images === 'string'
            ? JSON.parse(afterProduct.images)
            : afterProduct.images;
          
          // ASSERTION: Images marked for removal should be deleted from database
          for (const imageToRemove of imagesToRemove) {
            expect(afterImages).not.toContain(imageToRemove);
          }
          
          // ASSERTION: Images marked for removal should be deleted from filesystem
          for (const imagePath of imagesToRemove) {
            const fullPath = path.join(__dirname, '../../../', imagePath);
            const exists = await fs.access(fullPath).then(() => true).catch(() => false);
            expect(exists).toBe(false);
          }
          
          // ASSERTION: Remaining images should be preserved
          const expectedRemainingImages = beforeImages.filter(img => !imagesToRemove.includes(img));
          expect(afterImages).toEqual(expectedRemainingImages);
        }
      ),
      { numRuns: 2 }
    );
  });

  /**
   * Property-based test: Videos marked for removal should be deleted
   * 
   * This test verifies that when videosToRemove array is provided,
   * the marked videos are removed from both database and filesystem.
   */
  test('should remove videos marked in videosToRemove array', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          ['test-uploads/videos/existing-video-1.mp4']
        ),
        async (videosToRemove) => {
          // Recreate files before each property test run
          const projectRoot = path.join(__dirname, '../../../');
          const testVideos = [
            'test-uploads/videos/existing-video-1.mp4'
          ];
          for (const videoPath of testVideos) {
            const fullPath = path.join(projectRoot, videoPath);
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, 'dummy video content');
          }
          
          // Get current product state
          const [beforeProducts] = await db.query('SELECT * FROM products WHERE id = ?', [testProductId]);
          const beforeProduct = beforeProducts[0];
          const beforeVideos = typeof beforeProduct.videos === 'string'
            ? JSON.parse(beforeProduct.videos)
            : beforeProduct.videos;
          
          // Verify files exist before removal
          for (const videoPath of videosToRemove) {
            const fullPath = path.join(__dirname, '../../../', videoPath);
            const exists = await fs.access(fullPath).then(() => true).catch(() => false);
            expect(exists).toBe(true);
          }
          
          // Call controller with videosToRemove
          const { req, res, next } = createMockReqRes(
            { id: testProductId },
            { videosToRemove: JSON.stringify(videosToRemove) }
          );
          
          await updateProduct(req, res, next);
          
          // Get updated product
          const [afterProducts] = await db.query('SELECT * FROM products WHERE id = ?', [testProductId]);
          const afterProduct = afterProducts[0];
          const afterVideos = typeof afterProduct.videos === 'string'
            ? JSON.parse(afterProduct.videos)
            : afterProduct.videos;
          
          // ASSERTION: Videos marked for removal should be deleted from database
          for (const videoToRemove of videosToRemove) {
            expect(afterVideos).not.toContain(videoToRemove);
          }
          
          // ASSERTION: Videos marked for removal should be deleted from filesystem
          for (const videoPath of videosToRemove) {
            const fullPath = path.join(__dirname, '../../../', videoPath);
            const exists = await fs.access(fullPath).then(() => true).catch(() => false);
            expect(exists).toBe(false);
          }
          
          // ASSERTION: Remaining videos should be preserved
          const expectedRemainingVideos = beforeVideos.filter(vid => !videosToRemove.includes(vid));
          expect(afterVideos).toEqual(expectedRemainingVideos);
        }
      ),
      { numRuns: 2 }
    );
  });

  /**
   * Property-based test: New images should be added to existing products
   * 
   * This test verifies that when new images are uploaded to an existing product,
   * they are added to the existing image collection.
   */
  test('should add new images to existing product image collection', async () => {
    // Create a minimal valid JPEG file (1x1 pixel red image)
    const testImagePath = path.join(testUploadsDir, 'new-test-image.jpg');
    const jpegHeader = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x03, 0xFF, 0xC4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00,
      0x7F, 0xA0, 0xFF, 0xD9
    ]);
    await fs.writeFile(testImagePath, jpegHeader);
    
    // Get current product state
    const [beforeProducts] = await db.query('SELECT * FROM products WHERE id = ?', [testProductId]);
    const beforeProduct = beforeProducts[0];
    const beforeImages = typeof beforeProduct.images === 'string'
      ? JSON.parse(beforeProduct.images)
      : beforeProduct.images;
    const beforeImageCount = beforeImages.length;
    
    // Call controller with new image file
    const { req, res, next } = createMockReqRes(
      { id: testProductId },
      {},
      { images: [{ path: testImagePath, filename: 'new-test-image.jpg' }] }
    );
    
    await updateProduct(req, res, next);
    
    // Get updated product
    const [afterProducts] = await db.query('SELECT * FROM products WHERE id = ?', [testProductId]);
    const afterProduct = afterProducts[0];
    const afterImages = typeof afterProduct.images === 'string'
      ? JSON.parse(afterProduct.images)
      : afterProduct.images;
    
    // ASSERTION: New image should be added to the collection
    expect(afterImages.length).toBe(beforeImageCount + 1);
    
    // ASSERTION: All previous images should still be present
    for (const beforeImage of beforeImages) {
      expect(afterImages).toContain(beforeImage);
    }
    
    // ASSERTION: Response should include the new image URL
    expect(res.data.product.imageUrls.length).toBe(beforeImageCount + 1);
  });

  /**
   * Property-based test: New videos should be added to existing products
   * 
   * This test verifies that when new videos are uploaded to an existing product,
   * they are added to the existing video collection.
   */
  test('should add new videos to existing product video collection', async () => {
    // Create a test video file
    const testVideoPath = path.join(testUploadsDir, 'new-test-video.mp4');
    await fs.writeFile(testVideoPath, 'test video content');
    
    // Get current product state
    const [beforeProducts] = await db.query('SELECT * FROM products WHERE id = ?', [testProductId]);
    const beforeProduct = beforeProducts[0];
    const beforeVideos = typeof beforeProduct.videos === 'string'
      ? JSON.parse(beforeProduct.videos)
      : beforeProduct.videos;
    const beforeVideoCount = beforeVideos.length;
    
    // Call controller with new video file
    const { req, res, next } = createMockReqRes(
      { id: testProductId },
      {},
      { videos: [{ path: testVideoPath, filename: 'new-test-video.mp4' }] }
    );
    
    await updateProduct(req, res, next);
    
    // Get updated product
    const [afterProducts] = await db.query('SELECT * FROM products WHERE id = ?', [testProductId]);
    const afterProduct = afterProducts[0];
    const afterVideos = typeof afterProduct.videos === 'string'
      ? JSON.parse(afterProduct.videos)
      : afterProduct.videos;
    
    // ASSERTION: New video should be added to the collection
    expect(afterVideos.length).toBe(beforeVideoCount + 1);
    
    // ASSERTION: All previous videos should still be present
    for (const beforeVideo of beforeVideos) {
      expect(afterVideos).toContain(beforeVideo);
    }
    
    // ASSERTION: Response should include the new video URL
    expect(res.data.product.videoUrls.length).toBe(beforeVideoCount + 1);
  });
});
