const bcrypt = require('bcryptjs');
const { initDatabase, run, exec, all, transaction, saveDatabase } = require('./db');

async function seed() {
  await initDatabase();

  const password = bcrypt.hashSync('password123', 10);

  exec('DELETE FROM order_items');
  exec('DELETE FROM orders');
  exec('DELETE FROM cart');
  exec('DELETE FROM reviews');
  exec('DELETE FROM menu_items');
  exec('DELETE FROM menu_categories');
  exec('DELETE FROM restaurants');
  exec('DELETE FROM users');

  run('INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
    ['John Doe', 'john@example.com', password, '555-0101', '123 Main St, New York, NY 10001']);
  run('INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
    ['Admin', 'admin@example.com', password, '555-0000', '456 Admin Ave', 'admin']);

  const restaurants = [
    {
      name: 'Bella Napoli', description: 'Authentic Italian cuisine with wood-fired pizzas and homemade pasta.',
      image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', cuisine: 'Italian',
      rating: 4.7, delivery_time: '25-35 min', delivery_fee: 2.99, minimum_order: 15, address: '789 Pizza Lane, NY'
    },
    {
      name: 'Sakura Sushi', description: 'Fresh sushi and Japanese delicacies prepared by master chefs.',
      image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', cuisine: 'Japanese',
      rating: 4.8, delivery_time: '30-40 min', delivery_fee: 3.99, minimum_order: 20, address: '321 Tokyo Ave, NY'
    },
    {
      name: 'Spice Route', description: 'Flavorful Indian dishes ranging from mild to fiery.',
      image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', cuisine: 'Indian',
      rating: 4.5, delivery_time: '35-45 min', delivery_fee: 2.49, minimum_order: 12, address: '555 Curry Road, NY'
    },
    {
      name: 'El Taco Loco', description: 'Street-style Mexican food with bold flavors.',
      image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', cuisine: 'Mexican',
      rating: 4.4, delivery_time: '20-30 min', delivery_fee: 1.99, minimum_order: 10, address: '888 Fiesta Blvd, NY'
    },
    {
      name: 'Golden Dragon', description: 'Classic Chinese cuisine with a modern twist.',
      image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', cuisine: 'Chinese',
      rating: 4.3, delivery_time: '25-40 min', delivery_fee: 2.99, minimum_order: 15, address: '222 Dragon St, NY'
    },
    {
      name: 'Burger Barn', description: 'Gourmet burgers made with premium Angus beef.',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', cuisine: 'American',
      rating: 4.6, delivery_time: '15-25 min', delivery_fee: 2.49, minimum_order: 10, address: '444 Burger Ave, NY'
    },
    {
      name: 'Le Petit Bistro', description: 'Elegant French cuisine for the sophisticated palate.',
      image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', cuisine: 'French',
      rating: 4.9, delivery_time: '40-50 min', delivery_fee: 4.99, minimum_order: 25, address: '111 Paris Way, NY'
    },
    {
      name: 'Seoul Kitchen', description: 'Korean BBQ and traditional dishes.',
      image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800', cuisine: 'Korean',
      rating: 4.5, delivery_time: '30-45 min', delivery_fee: 3.49, minimum_order: 18, address: '666 Seoul St, NY'
    }
  ];

  const insertRestaurant = (r) => {
    const result = run(
      'INSERT INTO restaurants (name, description, image_url, cuisine, rating, delivery_time, delivery_fee, minimum_order, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [r.name, r.description, r.image_url, r.cuisine, r.rating, r.delivery_time, r.delivery_fee, r.minimum_order, r.address]
    );
    return result.lastInsertRowid;
  };

  const insertCategory = (rid, name) => {
    const result = run('INSERT INTO menu_categories (restaurant_id, name) VALUES (?, ?)', [rid, name]);
    return result.lastInsertRowid;
  };

  const insertItem = (rid, cid, name, desc, price, img) => {
    run('INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [rid, cid, name, desc, price, img]);
  };

  const menuData = {
    Italian: () => {
      const rid = insertRestaurant(restaurants[0]);
      const c1 = insertCategory(rid, 'Pizzas');
      insertItem(rid, c1, 'Margherita', 'Fresh mozzarella, tomato sauce, basil', 12.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400');
      insertItem(rid, c1, 'Quattro Formaggi', 'Four cheese pizza', 15.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400');
      insertItem(rid, c1, 'Diavola', 'Spicy salami and mozzarella', 14.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400');
      const c2 = insertCategory(rid, 'Pasta');
      insertItem(rid, c2, 'Spaghetti Carbonara', 'Egg, pancetta, pecorino', 16.99, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400');
      insertItem(rid, c2, 'Fettuccine Alfredo', 'Creamy parmesan sauce', 14.99, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400');
      insertItem(rid, c2, 'Penne Arrabbiata', 'Spicy tomato sauce', 13.99, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400');
      const c3 = insertCategory(rid, 'Desserts');
      insertItem(rid, c3, 'Tiramisu', 'Classic Italian dessert', 8.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400');
    },
    Japanese: () => {
      const rid = insertRestaurant(restaurants[1]);
      const c1 = insertCategory(rid, 'Sushi Rolls');
      insertItem(rid, c1, 'California Roll', 'Crab, avocado, cucumber', 12.99, 'https://images.unsplash.com/photo-1579584425555-c3997d4d9769?w=400');
      insertItem(rid, c1, 'Spicy Tuna Roll', 'Fresh tuna, spicy mayo', 14.99, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400');
      insertItem(rid, c1, 'Dragon Roll', 'Eel, avocado, eel sauce', 16.99, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400');
      const c2 = insertCategory(rid, 'Sashimi');
      insertItem(rid, c2, 'Salmon Sashimi (5 pcs)', 'Fresh Atlantic salmon', 15.99, 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400');
      insertItem(rid, c2, 'Tuna Sashimi (5 pcs)', 'Premium bluefin tuna', 18.99, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400');
      const c3 = insertCategory(rid, 'Appetizers');
      insertItem(rid, c3, 'Edamame', 'Steamed soybeans', 5.99, 'https://images.unsplash.com/photo-1564093497595-593b96d80571?w=400');
      insertItem(rid, c3, 'Gyoza (6 pcs)', 'Pan-fried pork dumplings', 8.99, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400');
    },
    Indian: () => {
      const rid = insertRestaurant(restaurants[2]);
      const c1 = insertCategory(rid, 'Curries');
      insertItem(rid, c1, 'Butter Chicken', 'Creamy tomato curry', 15.99, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400');
      insertItem(rid, c1, 'Palak Paneer', 'Cottage cheese in spinach', 13.99, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400');
      insertItem(rid, c1, 'Chicken Tikka Masala', 'Grilled chicken in masala', 14.99, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400');
      const c2 = insertCategory(rid, 'Breads');
      insertItem(rid, c2, 'Garlic Naan', 'Soft bread with garlic butter', 3.99, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400');
      insertItem(rid, c2, 'Onion Kulcha', 'Stuffed bread', 4.99, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400');
      const c3 = insertCategory(rid, 'Rice');
      insertItem(rid, c3, 'Biryani', 'Fragrant rice with chicken', 16.99, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400');
    },
    Mexican: () => {
      const rid = insertRestaurant(restaurants[3]);
      const c1 = insertCategory(rid, 'Tacos');
      insertItem(rid, c1, 'Street Tacos (3)', 'Carne asada, onion, cilantro', 10.99, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400');
      insertItem(rid, c1, 'Fish Tacos (3)', 'Beer-battered fish', 12.99, 'https://images.unsplash.com/photo-1512838243191-e81e8f66e1dc?w=400');
      const c2 = insertCategory(rid, 'Burritos');
      insertItem(rid, c2, 'Carne Asada Burrito', 'Grilled steak burrito', 13.99, 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=400');
      insertItem(rid, c2, 'Chicken Burrito Bowl', 'Grilled chicken bowl', 12.99, 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400');
      const c3 = insertCategory(rid, 'Sides');
      insertItem(rid, c3, 'Chips & Guacamole', 'Tortilla chips with guac', 6.99, 'https://images.unsplash.com/photo-1541014741259-de529411d960?w=400');
      insertItem(rid, c3, 'Nachos Supreme', 'Loaded nachos', 9.99, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400');
    },
    Chinese: () => {
      const rid = insertRestaurant(restaurants[4]);
      const c1 = insertCategory(rid, 'Dim Sum');
      insertItem(rid, c1, 'Har Gow (6 pcs)', 'Crystal shrimp dumplings', 10.99, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400');
      insertItem(rid, c1, 'Siu Mai (6 pcs)', 'Pork and shrimp dumplings', 9.99, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400');
      const c2 = insertCategory(rid, 'Mains');
      insertItem(rid, c2, 'Kung Pao Chicken', 'Spicy chicken with peanuts', 14.99, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400');
      insertItem(rid, c2, 'Sweet & Sour Pork', 'Crispy pork in tangy sauce', 13.99, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400');
      insertItem(rid, c2, 'Mapo Tofu', 'Silky tofu in Sichuan sauce', 11.99, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400');
    },
    American: () => {
      const rid = insertRestaurant(restaurants[5]);
      const c1 = insertCategory(rid, 'Burgers');
      insertItem(rid, c1, 'Classic Burger', 'Angus beef patty', 12.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400');
      insertItem(rid, c1, 'Bacon Cheeseburger', 'With crispy bacon', 14.99, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400');
      insertItem(rid, c1, 'Mushroom Swiss', 'Mushrooms and Swiss', 14.99, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400');
      const c2 = insertCategory(rid, 'Sides');
      insertItem(rid, c2, 'French Fries', 'Crispy golden fries', 4.99, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400');
      insertItem(rid, c2, 'Onion Rings', 'Beer-battered rings', 6.99, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400');
      const c3 = insertCategory(rid, 'Shakes');
      insertItem(rid, c3, 'Vanilla Shake', 'Creamy vanilla shake', 5.99, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400');
      insertItem(rid, c3, 'Chocolate Shake', 'Rich chocolate shake', 5.99, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400');
    },
    French: () => {
      const rid = insertRestaurant(restaurants[6]);
      const c1 = insertCategory(rid, 'Starters');
      insertItem(rid, c1, 'French Onion Soup', 'Caramelized onion soup', 12.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400');
      insertItem(rid, c1, 'Escargot (6 pcs)', 'Burgundy snails', 16.99, 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400');
      const c2 = insertCategory(rid, 'Mains');
      insertItem(rid, c2, 'Coq au Vin', 'Braised chicken in wine', 24.99, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400');
      insertItem(rid, c2, 'Beef Bourguignon', 'Slow-cooked beef', 26.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400');
      const c3 = insertCategory(rid, 'Pastries');
      insertItem(rid, c3, 'Creme Brulee', 'Vanilla custard', 9.99, 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400');
    },
    Korean: () => {
      const rid = insertRestaurant(restaurants[7]);
      const c1 = insertCategory(rid, 'BBQ');
      insertItem(rid, c1, 'Bulgogi', 'Marinated beef ribeye', 18.99, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400');
      insertItem(rid, c1, 'Galbi', 'Grilled short ribs', 21.99, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400');
      const c2 = insertCategory(rid, 'Stews');
      insertItem(rid, c2, 'Kimchi Jjigae', 'Spicy kimchi stew', 14.99, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400');
      insertItem(rid, c2, 'Budae Jjigae', 'Army base stew', 16.99, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400');
      const c3 = insertCategory(rid, 'Rice Bowls');
      insertItem(rid, c3, 'Bibimbap', 'Mixed rice bowl', 13.99, 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400');
      insertItem(rid, c3, 'Korean Fried Chicken', 'Double-fried crispy chicken', 15.99, 'https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=400');
    }
  };

  transaction(() => {
    for (const cuisine of Object.keys(menuData)) {
      menuData[cuisine]();
    }
  });

  console.log('Seed data inserted successfully!');
}

seed().catch(err => { console.error(err); process.exit(1); });
