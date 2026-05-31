import db from '../database/db.js';
import { validateRequiredFields, validatePagination, isValidEmail, sanitizeString } from '../utils/validation.js';

/**
 * Get all quote requests (admin only)
 */
export const getAllQuotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, product_id } = req.query;
    const { page: validPage, limit: validLimit, offset } = validatePagination(page, limit);

    let query = 'SELECT * FROM quote_requests';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (product_id) {
      conditions.push('product_id = ?');
      params.push(product_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Add pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(validLimit, offset);

    const [quotes] = await db.query(query, params);

    res.json({
      quotes,
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
 * Get single quote by ID
 */
export const getQuoteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [quotes] = await db.query(
      'SELECT * FROM quote_requests WHERE id = ?',
      [id]
    );

    if (quotes.length === 0) {
      return res.status(404).json({ error: 'Quote request not found' });
    }

    res.json({ quote: quotes[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new quote request (public endpoint)
 */
export const createQuote = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      product_id,
      product_name,
      source
    } = req.body;

    // Validate required fields
    const validation = validateRequiredFields(req.body, ['name', 'email']);
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

    // If product_id is provided, verify it exists
    if (product_id) {
      const [products] = await db.query(
        'SELECT id, product_name FROM products WHERE id = ?',
        [product_id]
      );

      if (products.length === 0) {
        return res.status(404).json({ 
          error: 'Product not found',
          message: 'The specified product does not exist' 
        });
      }
    }

    // Insert quote request
    const [result] = await db.query(
      `INSERT INTO quote_requests (name, email, phone, message, product_id, product_name, source) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitizeString(name),
        email,
        phone,
        message ? sanitizeString(message) : null,
        product_id || null,
        product_name ? sanitizeString(product_name) : null,
        source || null
      ]
    );

    res.status(201).json({
      message: 'Quote request submitted successfully',
      quote: {
        id: result.insertId,
        name,
        email,
        phone,
        message,
        product_id,
        product_name,
        source
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update quote status
 */
export const updateQuoteStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'quoted', 'converted', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const [result] = await db.query(
      'UPDATE quote_requests SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Quote request not found' });
    }

    // Get updated quote
    const [quotes] = await db.query('SELECT * FROM quote_requests WHERE id = ?', [id]);

    res.json({
      message: 'Quote status updated successfully',
      quote: quotes[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete quote request
 */
export const deleteQuote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM quote_requests WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Quote request not found' });
    }

    res.json({ message: 'Quote request deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get quote statistics
 */
export const getQuoteStats = async (req, res, next) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_quotes,
        SUM(CASE WHEN status = 'quoted' THEN 1 ELSE 0 END) as quoted,
        SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
      FROM quote_requests
    `);

    res.json({ stats: stats[0] });
  } catch (error) {
    next(error);
  }
};
