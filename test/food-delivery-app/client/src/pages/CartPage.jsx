import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cartItems, currentRestaurantName, subtotal, updateCartItem, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious items from a restaurant</p>
        <Link to="/restaurants" className="btn-primary inline-block">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 hover:text-primary-600 mb-4">
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart</h1>
      <p className="text-gray-500 mb-6">From {currentRestaurantName}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/64x64?text=Food'; }}
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                <p className="text-primary-600 font-medium">${item.price.toFixed(2)}</p>
                {item.special_instructions && (
                  <p className="text-xs text-gray-400 mt-1">Note: {item.special_instructions}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => updateCartItem(item.id, item.quantity - 1)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-2 text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-semibold text-gray-800 w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit sticky top-24">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-medium">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-base font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="btn-primary w-full mt-6 block text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
