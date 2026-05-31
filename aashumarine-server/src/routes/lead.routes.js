import express from 'express';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats
} from '../controllers/lead.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/leads
 * @desc    Get all contact leads
 * @access  Private (admin only)
 */
router.get('/', authenticate, authorize(['admin', 'super_admin']), getAllLeads);

/**
 * @route   GET /api/leads/stats
 * @desc    Get lead statistics
 * @access  Private (admin only)
 */
router.get('/stats', authenticate, authorize(['admin', 'super_admin']), getLeadStats);

/**
 * @route   GET /api/leads/:id
 * @desc    Get single lead by ID
 * @access  Private (admin only)
 */
router.get('/:id', authenticate, authorize(['admin', 'super_admin']), getLeadById);

/**
 * @route   POST /api/leads
 * @desc    Create new contact lead (contact form submission)
 * @access  Public
 */
router.post('/', createLead);

/**
 * @route   PUT /api/leads/:id/status
 * @desc    Update lead status
 * @access  Private (admin only)
 */
router.put('/:id/status', authenticate, authorize(['admin', 'super_admin']), updateLeadStatus);

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete lead
 * @access  Private (admin only)
 */
router.delete('/:id', authenticate, authorize(['admin', 'super_admin']), deleteLead);

export default router;
