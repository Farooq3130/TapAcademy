import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'text-orange-600 bg-orange-50', icon: Clock },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-purple-600 bg-purple-50', icon: Package },
  delivered: { label: 'Delivered', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); });
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link to="/restaurants" className="btn-primary inline-block">
            Order Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="card p-4 flex items-center gap-4 hover:border-primary-200 border border-gray-100"
              >
                {order.restaurant_image && (
                  <img
                    src={order.restaurant_image}
                    alt={order.restaurant_name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64x64?text=Restaurant'; }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{order.restaurant_name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-800">${order.total.toFixed(2)}</p>
                  <ChevronRight size={18} className="text-gray-400 ml-auto mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
