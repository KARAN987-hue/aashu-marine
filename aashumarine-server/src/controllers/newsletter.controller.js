import db from '../database/db.js';
import { validateRequiredFields, validatePagination, isValidEmail } from '../utils/validation.js';

/**
 * Get all newsletter subscribers (admin only)
 */
export const getAllSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, is_active } = req.query;
    const { page: validPage, limit: validLimit, offset } = validatePagination(page, limit);

    let query = 'SELECT * FROM newsletter_subscribers';
    const params = [];

    if (is_active !== undefined) {
      query += ' WHERE is_active = ?';
      params.push(is_active === 'true' || is_active === true ? 1 : 0);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Add pagination
    query += ' ORDER BY subscribed_at DESC LIMIT ? OFFSET ?';
    params.push(validLimit, offset);

    const [subscribers] = await db.query(query, params);

    res.json({
      subscribers,
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
 * Subscribe to newsletter (public endpoint)
 */
export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate required fields
    const validation = validateRequiredFields(req.body, ['email']);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Email is required' 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Invalid email format' 
      });
    }

    // Check if already subscribed
    const [existing] = await db.query(
      'SELECT * FROM newsletter_subscribers WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      // If previously unsubscribed, reactivate
      if (!existing[0].is_active) {
        await db.query(
          'UPDATE newsletter_subscribers SET is_active = true, unsubscribed_at = NULL WHERE email = ?',
          [email]
        );

        return res.json({
          message: 'Successfully resubscribed to newsletter',
          subscriber: { email, is_active: true }
        });
      }

      return res.status(409).json({ 
        error: 'Already subscribed',
        message: 'This email is already subscribed to the newsletter' 
      });
    }

    // Insert new subscriber
    const [result] = await db.query(
      'INSERT INTO newsletter_subscribers (email) VALUES (?)',
      [email]
    );

    res.status(201).json({
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        id: result.insertId,
        email,
        is_active: true
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unsubscribe from newsletter (public endpoint)
 */
export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Valid email is required' 
      });
    }

    const [result] = await db.query(
      'UPDATE newsletter_subscribers SET is_active = false, unsubscribed_at = NOW() WHERE email = ? AND is_active = true',
      [email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Email not found in subscriber list or already unsubscribed' 
      });
    }

    res.json({ 
      message: 'Successfully unsubscribed from newsletter' 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete subscriber (admin only)
 */
export const deleteSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM newsletter_subscribers WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get subscriber statistics
 */
export const getSubscriberStats = async (req, res, next) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as unsubscribed
      FROM newsletter_subscribers
    `);

    res.json({ stats: stats[0] });
  } catch (error) {
    next(error);
  }
};
