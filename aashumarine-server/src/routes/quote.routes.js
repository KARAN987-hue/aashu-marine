import express from 'express';
import {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuoteStatus,
  deleteQuote,
  getQuoteStats
} from '../controllers/quote.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/quotes
 * @desc    Get all quote requests
 * @access  Private (admin only)
 */
router.get('/', authenticate, authorize(['admin', 'super_admin']), getAllQuotes);

/**
 * @route   GET /api/quotes/stats
 * @desc    Get quote statistics
 * @access  Private (admin only)
 */
router.get('/stats', authenticate, authorize(['admin', 'super_admin']), getQuoteStats);

/**
 * @route   GET /api/quotes/:id
 * @desc    Get single quote by ID
 * @access  Private (admin only)
 */
router.get('/:id', authenticate, authorize(['admin', 'super_admin']), getQuoteById);

/**
 * @route   POST /api/quotes
 * @desc    Create new quote request
 * @access  Public
 */
router.post('/', createQuote);

/**
 * @route   PUT /api/quotes/:id/status
 * @desc    Update quote status
 * @access  Private (admin only)
 */
router.put('/:id/status', authenticate, authorize(['admin', 'super_admin']), updateQuoteStatus);

/**
 * @route   DELETE /api/quotes/:id
 * @desc    Delete quote request
 * @access  Private (admin only)
 */
router.delete('/:id', authenticate, authorize(['admin', 'super_admin']), deleteQuote);

export default router;
