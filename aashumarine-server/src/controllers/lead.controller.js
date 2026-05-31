import db from '../database/db.js';
import { validateRequiredFields, validatePagination, isValidEmail, sanitizeString } from '../utils/validation.js';

/**
 * Get all contact leads (admin only)
 */
export const getAllLeads = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { page: validPage, limit: validLimit, offset } = validatePagination(page, limit);

    let query = 'SELECT * FROM contact_leads';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Add pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(validLimit, offset);

    const [leads] = await db.query(query, params);

    res.json({
      leads,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages: Math.ceil(total / validLimit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single lead by ID
 */
export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [leads] = await db.query(
      'SELECT * FROM contact_leads WHERE id = ?',
      [id]
    );

    if (leads.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ lead: leads[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new contact lead (public endpoint)
 */
export const createLead = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      source = 'Contact Page'
    } = req.body;

    // Validate required fields
    const validation = validateRequiredFields(req.body, ['name', 'email', 'message']);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: `Missing required fields: ${validation.missing.join(', ')}` 
      });
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Invalid email format' 
      });
    }

    // Insert lead
    const [result] = await db.query(
      `INSERT INTO contact_leads (name, email, phone, message, source) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        sanitizeString(name),
        email,
        phone,
        sanitizeString(message),
        source
      ]
    );

    res.status(201).json({
      message: 'Contact form submitted successfully',
      lead: {
        id: result.insertId,
        name,
        email,
        phone,
        message,
        source
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update lead status
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'contacted', 'converted', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const [result] = await db.query(
      'UPDATE contact_leads SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Get updated lead
    const [leads] = await db.query('SELECT * FROM contact_leads WHERE id = ?', [id]);

    res.json({
      message: 'Lead status updated successfully',
      lead: leads[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete lead
 */
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM contact_leads WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get lead statistics
 */
export const getLeadStats = async (req, res, next) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_leads,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
      FROM contact_leads
    `);

    res.json({ stats: stats[0] });
  } catch (error) {
    next(error);
  }
};
