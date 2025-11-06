import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM services ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM services WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/',
  authenticateToken,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('icon').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, icon, detailed_content, pricing_info } = req.body;

    try {
      const result = await query(
        'INSERT INTO services (title, description, icon, detailed_content, pricing_info) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, icon, detailed_content || null, pricing_info || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('icon').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, icon, detailed_content, pricing_info } = req.body;

    try {
      const result = await query(
        'UPDATE services SET title = $1, description = $2, icon = $3, detailed_content = $4, pricing_info = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
        [title, description, icon, detailed_content || null, pricing_info || null, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM services WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
