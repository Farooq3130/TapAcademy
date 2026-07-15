import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Banknote, MapPin, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, currentRestaurantId, currentRestaurantName, subtotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setError('Delivery address is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          restaurant_id: currentRestaurantId,
          delivery_address: deliveryAddress,
          payment_method: paymentMethod,
          special_instructions: specialInstructions
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await clearCart();
      navigate(`/orders/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/cart')} className="flex items-center gap-1 text-gray-600 hover:text-primary-600 mb-4">
        <ArrowLeft size={18} />
        Back to Cart
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Delivery Address
            </h3>
            <textarea
              value={deliveryAddress}
              onChange={e => setDeliveryAddress(e.target.value)}
              placeholder="Enter your full delivery address..."
              className="input-field h-24 resize-none"
              required
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="text-primary-500"
                />
                <Banknote size={20} className="text-gray-600" />
                <span className="font-medium">Cash on Delivery</span>
              </label>
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="text-primary-500"
                />
                <CreditCard size={20} className="text-gray-600" />
                <span className="font-medium">Credit/Debit Card</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests for the restaurant or driver..."
              className="input-field h-20 resize-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit sticky top-24">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Order from {currentRestaurantName}</h3>
          <div className="space-y-3 mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate mr-2">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 text-center disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
