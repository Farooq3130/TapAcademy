import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  useEffect(() => {
    fetch('/api/restaurants')
      .then(r => r.json())
      .then(setRestaurants);
    fetch('/api/restaurants/cuisines')
      .then(r => r.json())
      .then(setCuisines);
  }, []);

  const filtered = restaurants.filter(r => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchesCuisine = !selectedCuisine || r.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Delicious food, delivered to you
          </h1>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Order from your favorite restaurants and get it delivered hot and fresh to your doorstep
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-6">
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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCuisine ? selectedCuisine : 'All'} Restaurants
            <span className="text-gray-400 text-base font-normal ml-2">({filtered.length})</span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No restaurants found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(r => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
