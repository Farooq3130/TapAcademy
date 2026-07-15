import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Clock, CreditCard, Star } from 'lucide-react';

const statusSteps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setOrder(data); setLoading(false); });
  }, [id, token]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrder(data);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Order not found.</p>
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-1 text-gray-600 hover:text-primary-600 mb-4">
        <ArrowLeft size={18} />
        Back to Orders
      </button>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <span className="font-bold text-xl text-primary-600">${order.total.toFixed(2)}</span>
        </div>

        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= currentStep ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs mt-1 capitalize ${i <= currentStep ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                    {step.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-200 rounded-full mt-2">
              <div
                className="h-1 bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-gray-400" />
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wide">Delivery Address</span>
              <p className="text-gray-800">{order.delivery_address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard size={16} className="text-gray-400" />
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wide">Payment</span>
              <p className="text-gray-800 capitalize">{order.payment_method}</p>
            </div>
          </div>
          {order.estimated_delivery && (
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-gray-400" />
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide">Estimated Delivery</span>
                <p className="text-gray-800">{order.estimated_delivery}</p>
              </div>
            </div>
          )}
          {order.special_instructions && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-400 text-xs uppercase tracking-wide">Special Instructions</span>
              <p className="text-gray-700 mt-1">{order.special_instructions}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items?.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/48x48?text=Food'; }} />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
              </div>
              <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      {(order.status === 'pending' || order.status === 'confirmed') && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="btn-danger w-full mt-6"
        >
          {cancelling ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}
    </div>
  );
}
