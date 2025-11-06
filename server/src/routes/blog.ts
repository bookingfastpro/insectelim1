import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM blog_posts WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/',
  authenticateToken,
  [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('image_url').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, image_url, excerpt } = req.body;

    try {
      const result = await query(
        'INSERT INTO blog_posts (title, content, image_url, excerpt) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, content, image_url, excerpt || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('image_url').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, image_url, excerpt } = req.body;

    try {
      const result = await query(
        'UPDATE blog_posts SET title = $1, content = $2, image_url = $3, excerpt = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
        [title, content, image_url, excerpt || null, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
