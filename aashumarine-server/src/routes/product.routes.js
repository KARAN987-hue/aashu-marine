import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getCategories,
  getManufacturers,
  getRelatedProducts
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadProductImage, uploadProductImages, uploadProductMedia, compressUploadedImages, handleMulterError } from '../middleware/upload.js';


const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering and pagination
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/categories
 * @desc    Get all product categories
 * @access  Public
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/products/manufacturers
 * @desc    Get all manufacturers
 * @access  Public
 */
router.get('/manufacturers', getManufacturers);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   GET /api/products/:id/related
 * @desc    Get related products based on keywords with fallback logic
 * @access  Public
 */
router.get('/:id/related', getRelatedProducts);

/**
 * @route   POST /api/products
 * @desc    Create new product (supports multiple images)
 * @access  Private (admin only)
 */
router.post('/', authenticate, authorize(['admin', 'super_admin']), uploadProductMedia, compressUploadedImages, createProduct, handleMulterError);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (supports adding multiple images)
 * @access  Private (admin only)
 */
router.put('/:id', authenticate, authorize(['admin', 'super_admin']), uploadProductMedia, compressUploadedImages, updateProduct, handleMulterError);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (admin only)
 */
router.delete('/:id', authenticate, authorize(['admin', 'super_admin']), deleteProduct);

/**
 * @route   DELETE /api/products/:id/images
 * @desc    Delete individual image from product
 * @access  Private (admin only)
 */
router.delete('/:id/images', authenticate, authorize(['admin', 'super_admin']), deleteProductImage);

export default router;
