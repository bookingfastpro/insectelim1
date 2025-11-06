import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM site_settings');

    const settings: Record<string, any> = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM site_settings WHERE key = $1',
      [req.params.key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put(
  '/:key',
  authenticateToken,
  [body('value').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { value } = req.body;

    try {
      const result = await query(
        `INSERT INTO site_settings (key, value)
         VALUES ($1, $2)
         ON CONFLICT (key)
         DO UPDATE SET value = $2, updated_at = NOW()
         RETURNING *`,
        [req.params.key, JSON.stringify(value)]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating setting:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
