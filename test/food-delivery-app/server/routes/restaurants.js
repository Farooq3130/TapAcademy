const express = require('express');
const db = require('../db');
const { optionalAuth } = require('../middleware');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { cuisine, search, sort } = req.query;
    let query = 'SELECT * FROM restaurants WHERE 1=1';
    const params = [];

    if (cuisine) {
      query += ' AND cuisine = ?';
      params.push(cuisine);
    }
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR cuisine LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (sort === 'rating') query += ' ORDER BY rating DESC';
    else if (sort === 'delivery_time') query += ' ORDER BY delivery_time ASC';
    else if (sort === 'delivery_fee') query += ' ORDER BY delivery_fee ASC';
    else query += ' ORDER BY rating DESC';

    const restaurants = db.all(query, params);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/cuisines', (req, res) => {
  try {
    const cuisines = db.all('SELECT DISTINCT cuisine FROM restaurants ORDER BY cuisine');
    res.json(cuisines.map(c => c.cuisine));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const restaurant = db.get('SELECT * FROM restaurants WHERE id = ?', [parseInt(req.params.id)]);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found.' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/menu', (req, res) => {
  try {
    const rid = parseInt(req.params.id);
    const categories = db.all(
      'SELECT * FROM menu_categories WHERE restaurant_id = ? ORDER BY id', [rid]
    );
    const items = db.all(
      'SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY id', [rid]
    );
    const menu = categories.map(cat => ({
      ...cat,
      items: items.filter(item => item.category_id === cat.id)
    }));
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/reviews', (req, res) => {
  try {
    const reviews = db.all(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.restaurant_id = ? 
      ORDER BY r.created_at DESC
    `, [parseInt(req.params.id)]);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
