import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, DollarSign, MapPin, ChevronLeft, ShoppingCart } from 'lucide-react';
import MenuItem from '../components/MenuItem';
import { useCart } from '../context/CartContext';

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { totalItems } = useCart();

  useEffect(() => {
    Promise.all([
      fetch(`/api/restaurants/${id}`).then(r => r.json()),
      fetch(`/api/restaurants/${id}/menu`).then(r => r.json())
    ]).then(([rest, menuData]) => {
      setRestaurant(rest);
      setMenu(menuData);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">Restaurant not found.</p>
        <Link to="/restaurants" className="text-primary-500 hover:underline mt-2 inline-block">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/800x300?text=Restaurant'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <Link
          to="/restaurants"
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
            <span className="bg-primary-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              {restaurant.cuisine}
            </span>
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              {restaurant.rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {restaurant.delivery_time}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign size={14} />
              Delivery: ${restaurant.delivery_fee.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-gray-600 mb-6">{restaurant.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <MapPin size={16} />
          {restaurant.address}
          <span className="ml-4 text-gray-400">Min. order: ${restaurant.minimum_order.toFixed(2)}</span>
        </div>

        {menu.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Menu is not available yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {menu.map(category => (
              <div key={category.id}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.items.map(item => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      currentRestaurantId={restaurant.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalItems > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors"
            >
              <ShoppingCart size={20} />
              View Cart ({totalItems} items)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
