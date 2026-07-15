import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null);
  const [currentRestaurantName, setCurrentRestaurantName] = useState('');

  useEffect(() => {
    if (token) fetchCart();
    else setCartItems([]);
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCartItems(data);
      if (data.length > 0) {
        setCurrentRestaurantId(data[0].restaurant_id);
        setCurrentRestaurantName(data[0].restaurant_name);
      }
    } catch (err) { console.error(err); }
  };

  const addToCart = async (menuItemId, quantity = 1, specialInstructions = '') => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ menu_item_id: menuItemId, quantity, special_instructions: specialInstructions })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setCartItems(data);
    if (data.length > 0) {
      setCurrentRestaurantId(data[0].restaurant_id);
      setCurrentRestaurantName(data[0].restaurant_name);
    }
    return data;
  };

  const updateCartItem = async (cartItemId, quantity) => {
    const res = await fetch(`/api/cart/${cartItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ quantity })
    });
    const data = await res.json();
    setCartItems(data);
    if (data.length === 0) { setCurrentRestaurantId(null); setCurrentRestaurantName(''); }
  };

  const removeFromCart = async (cartItemId) => {
    const res = await fetch(`/api/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCartItems(data);
    if (data.length === 0) { setCurrentRestaurantId(null); setCurrentRestaurantName(''); }
  };

  const clearCart = async () => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setCartItems([]);
    setCurrentRestaurantId(null);
    setCurrentRestaurantName('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, currentRestaurantId, currentRestaurantName,
      addToCart, updateCartItem, removeFromCart, clearCart,
      fetchCart, subtotal, totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
