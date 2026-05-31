import express from 'express';
import {
  getAllSubscribers,
  subscribe,
  unsubscribe,
  deleteSubscriber,
  getSubscriberStats
} from '../controllers/newsletter.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/newsletter
 * @desc    Get all newsletter subscribers
 * @access  Private (admin only)
 */
router.get('/', authenticate, authorize(['admin', 'super_admin']), getAllSubscribers);

/**
 * @route   GET /api/newsletter/stats
 * @desc    Get subscriber statistics
 * @access  Private (admin only)
 */
router.get('/stats', authenticate, authorize(['admin', 'super_admin']), getSubscriberStats);

/**
 * @route   POST /api/newsletter/subscribe
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post('/subscribe', subscribe);

/**
 * @route   POST /api/newsletter/unsubscribe
 * @desc    Unsubscribe from newsletter
 * @access  Public
 */
router.post('/unsubscribe', unsubscribe);

/**
 * @route   DELETE /api/newsletter/:id
 * @desc    Delete subscriber
 * @access  Private (admin only)
 */
router.delete('/:id', authenticate, authorize(['admin', 'super_admin']), deleteSubscriber);

export default router;
