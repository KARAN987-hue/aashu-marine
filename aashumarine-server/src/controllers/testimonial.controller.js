import db from '../database/db.js';
import { validateRequiredFields, validatePagination, sanitizeString } from '../utils/validation.js';

/**
 * Get all testimonials (public - only approved)
 */
export const getAllTestimonials = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, is_approved } = req.query;
    const { page: validPage, limit: validLimit, offset } = validatePagination(page, limit);

    // Build query based on user role
    let query = 'SELECT * FROM testimonials';
    const params = [];

    // If not authenticated or not admin, only show approved
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
      query += ' WHERE is_approved = true';
    } else if (is_approved !== undefined) {
      query += ' WHERE is_approved = ?';
      params.push(is_approved === 'true' ? 1 : 0);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Add pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(validLimit, offset);

    const [testimonials] = await db.query(query, params);

    res.json({
      testimonials,
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
 * Get single testimonial by ID
 */
export const getTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [testimonials] = await db.query(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    if (testimonials.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ testimonial: testimonials[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new testimonial
 */
export const createTestimonial = async (req, res, next) => {
  try {
    const {
      name,
      company,
      text,
      rating = 5,
      is_approved = false
    } = req.body;

    // Validate required fields
    const validation = validateRequiredFields(req.body, ['name', 'text']);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation error',
        message: `Missing required fields: ${validation.missing.join(', ')}`
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Rating must be between 1 and 5'
      });
    }

    // Insert testimonial
    const [result] = await db.query(
      `INSERT INTO testimonials (name, company, text, rating, is_approved) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        sanitizeString(name),
        company ? sanitizeString(company) : null,
        sanitizeString(text),
        rating,
        is_approved
      ]
    );

    // Get created testimonial
    const [testimonials] = await db.query(
      'SELECT * FROM testimonials WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Testimonial created successfully',
      testimonial: testimonials[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update testimonial
 */
export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if testimonial exists
    const [existing] = await db.query('SELECT id FROM testimonials WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    // Build update query
    const allowedFields = ['name', 'company', 'text', 'rating', 'is_approved'];
    const updateFields = [];
    const params = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    params.push(id);

    await db.query(
      `UPDATE testimonials SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    // Get updated testimonial
    const [testimonials] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);

    res.json({
      message: 'Testimonial updated successfully',
      testimonial: testimonials[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete testimonial
 */
export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM testimonials WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve testimonial
 */
export const approveTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE testimonials SET is_approved = true WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    // Get updated testimonial
    const [testimonials] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);

    res.json({
      message: 'Testimonial approved successfully',
      testimonial: testimonials[0]
    });
  } catch (error) {
    next(error);
  }
};
