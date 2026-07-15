const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const orders = db.all(`
      SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  try {
    const order = db.get(`
      SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image, r.address as restaurant_address
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = ? AND o.user_id = ?
    `, [parseInt(req.params.id), req.user.id]);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const items = db.all(`
      SELECT oi.*, mi.name, mi.image_url
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `, [order.id]);

    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { restaurant_id, delivery_address, payment_method, special_instructions } = req.body;
    if (!restaurant_id || !delivery_address) {
      return res.status(400).json({ error: 'restaurant_id and delivery_address are required.' });
    }

    const cartItems = db.all(`
      SELECT c.*, mi.price, mi.name
      FROM cart c
      JOIN menu_items mi ON c.menu_item_id = mi.id
      WHERE c.user_id = ? AND mi.restaurant_id = ?
    `, [req.user.id, restaurant_id]);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty for this restaurant.' });
    }

    const restaurant = db.get('SELECT * FROM restaurants WHERE id = ?', [restaurant_id]);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = restaurant.delivery_fee;
    const total = subtotal + deliveryFee;

    if (subtotal < restaurant.minimum_order) {
      return res.status(400).json({ error: `Minimum order is $${restaurant.minimum_order}.` });
    }

    let orderId;
    db.transaction(() => {
      const result = db.run(
        `INSERT INTO orders (user_id, restaurant_id, total, delivery_address, payment_method, special_instructions, estimated_delivery)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, restaurant_id, total, delivery_address, payment_method || 'cash', special_instructions || null, restaurant.delivery_time]
      );
      orderId = result.lastInsertRowid;

      for (const item of cartItems) {
        db.run(
          'INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.menu_item_id, item.quantity, item.price, item.special_instructions]
        );
      }

      db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    });

    const order = db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/cancel', authMiddleware, (req, res) => {
  try {
    const order = db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [parseInt(req.params.id), req.user.id]);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage.' });
    }
    db.run("UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [order.id]);
    const updated = db.get('SELECT * FROM orders WHERE id = ?', [order.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/review', authMiddleware, (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    const order = db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [parseInt(req.params.id), req.user.id]);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Can only review delivered orders.' });
    }

    const existing = db.get('SELECT id FROM reviews WHERE user_id = ? AND restaurant_id = ?', [req.user.id, order.restaurant_id]);
    if (existing) {
      return res.status(409).json({ error: 'You already reviewed this restaurant.' });
    }

    db.run('INSERT INTO reviews (user_id, restaurant_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.id, order.restaurant_id, rating, comment || null]);

    const avgRating = db.get('SELECT AVG(rating) as avg_rating FROM reviews WHERE restaurant_id = ?', [order.restaurant_id]);
    db.run('UPDATE restaurants SET rating = ? WHERE id = ?', [Math.round(avgRating.avg_rating * 10) / 10, order.restaurant_id]);

    res.status(201).json({ message: 'Review submitted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
