import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function MenuItem({ item, currentRestaurantId }) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [added, setAdded] = useState(false);
  const { token } = useAuth();
  const { addToCart, currentRestaurantId: cartRestaurantId } = useCart();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!token) return navigate('/login');
    if (cartRestaurantId && cartRestaurantId !== currentRestaurantId) {
      if (!window.confirm('Your cart has items from another restaurant. Clear cart and add this item?')) return;
    }
    try {
      await addToCart(item.id, quantity, instructions);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      setQuantity(1);
      setInstructions('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800">{item.name}</h4>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
        <p className="text-primary-600 font-bold mt-2">${item.price.toFixed(2)}</p>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-l-lg"
            >
              <Minus size={16} />
            </button>
            <span className="px-3 text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-r-lg"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            {added ? (
              'Added!'
            ) : (
              <>
                <ShoppingCart size={14} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
      {item.image_url && (
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Food'; }}
          />
        </div>
      )}
    </div>
  );
}
