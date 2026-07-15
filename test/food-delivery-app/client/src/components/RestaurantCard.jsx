import { Star, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className="card group cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Restaurant'; }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold">{restaurant.rating}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">{restaurant.cuisine}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary-600 transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{restaurant.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
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
    </Link>
  );
}
