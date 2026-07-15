import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sort, setSort] = useState('rating');

  useEffect(() => {
    const params = new URLSearchParams();
    if (cuisine) params.set('cuisine', cuisine);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);

    fetch(`/api/restaurants?${params}`)
      .then(r => r.json())
      .then(setRestaurants);
  }, [cuisine, search, sort]);

  useEffect(() => {
    fetch('/api/restaurants/cuisines')
      .then(r => r.json())
      .then(setCuisines);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Restaurants</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input-field w-auto"
        >
          <option value="rating">Sort by Rating</option>
          <option value="delivery_time">Sort by Delivery Time</option>
          <option value="delivery_fee">Sort by Delivery Fee</option>
        </select>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setSelectedCuisine('')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCuisine ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {cuisines.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCuisine(c)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCuisine === c ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No restaurants found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
