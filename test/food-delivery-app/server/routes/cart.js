const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const items = db.all(`
      SELECT c.*, mi.name, mi.price, mi.image_url, mi.description, r.name as restaurant_name, r.id as restaurant_id
      FROM cart c
      JOIN menu_items mi ON c.menu_item_id = mi.id
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE c.user_id = ?
    `, [req.user.id]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { menu_item_id, quantity = 1, special_instructions = '' } = req.body;
    if (!menu_item_id) return res.status(400).json({ error: 'menu_item_id is required.' });

    const menuItem = db.get('SELECT * FROM menu_items WHERE id = ?', [menu_item_id]);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found.' });

    const existing = db.get(
      'SELECT * FROM cart WHERE user_id = ? AND menu_item_id = ?',
      [req.user.id, menu_item_id]
    );

    if (existing) {
      db.run(
        'UPDATE cart SET quantity = quantity + ?, special_instructions = ? WHERE id = ?',
        [quantity, special_instructions || existing.special_instructions, existing.id]
      );
    } else {
      db.run(
        'INSERT INTO cart (user_id, menu_item_id, quantity, special_instructions) VALUES (?, ?, ?, ?)',
        [req.user.id, menu_item_id, quantity, special_instructions]
      );
    }

    const items = db.all(`
      SELECT c.*, mi.name, mi.price, mi.image_url, r.name as restaurant_name, r.id as restaurant_id
      FROM cart c
      JOIN menu_items mi ON c.menu_item_id = mi.id
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE c.user_id = ?
    `, [req.user.id]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { quantity, special_instructions } = req.body;
    const item = db.get('SELECT * FROM cart WHERE id = ? AND user_id = ?', [parseInt(req.params.id), req.user.id]);
    if (!item) return res.status(404).json({ error: 'Cart item not found.' });

    if (quantity !== undefined) {
      if (quantity <= 0) {
        db.run('DELETE FROM cart WHERE id = ?', [parseInt(req.params.id)]);
      } else {
        db.run(
          'UPDATE cart SET quantity = ?, special_instructions = COALESCE(?, special_instructions) WHERE id = ?',
          [quantity, special_instructions, parseInt(req.params.id)]
        );
      }
    }

    const items = db.all(`
      SELECT c.*, mi.name, mi.price, mi.image_url, r.name as restaurant_name, r.id as restaurant_id
      FROM cart c
      JOIN menu_items mi ON c.menu_item_id = mi.id
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE c.user_id = ?
    `, [req.user.id]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [parseInt(req.params.id), req.user.id]);
    const items = db.all(`
      SELECT c.*, mi.name, mi.price, mi.image_url, r.name as restaurant_name, r.id as restaurant_id
      FROM cart c
      JOIN menu_items mi ON c.menu_item_id = mi.id
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE c.user_id = ?
    `, [req.user.id]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/', authMiddleware, (req, res) => {
  try {
    db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
