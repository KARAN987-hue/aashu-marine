import express from 'express';
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial
} from '../controllers/testimonial.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/testimonials
 * @desc    Get all testimonials (public: approved only, admin: all)
 * @access  Public (with optional auth)
 */
router.get('/', optionalAuth, getAllTestimonials);

/**
 * @route   GET /api/testimonials/:id
 * @desc    Get single testimonial by ID
 * @access  Public
 */
router.get('/:id', getTestimonialById);

/**
 * @route   POST /api/testimonials
 * @desc    Create new testimonial
 * @access  Public (requires approval) / Private (admin - auto-approved)
 */
router.post('/', optionalAuth, createTestimonial);

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update testimonial
 * @access  Private (admin only)
 */
router.put('/:id', authenticate, authorize(['admin', 'super_admin']), updateTestimonial);

/**
 * @route   PUT /api/testimonials/:id/approve
 * @desc    Approve testimonial
 * @access  Private (admin only)
 */
router.put('/:id/approve', authenticate, authorize(['admin', 'super_admin']), approveTestimonial);

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Delete testimonial
 * @access  Private (admin only)
 */
router.delete('/:id', authenticate, authorize(['admin', 'super_admin']), deleteTestimonial);

export default router;
