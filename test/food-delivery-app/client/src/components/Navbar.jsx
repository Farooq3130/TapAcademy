import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, UtensilsCrossed, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <UtensilsCrossed size={28} />
            <span>FoodDash</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/restaurants" className="text-gray-600 hover:text-primary-600 font-medium">
              Restaurants
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="text-gray-600 hover:text-primary-600 font-medium">
                  My Orders
                </Link>
                <Link to="/cart" className="relative text-gray-600 hover:text-primary-600">
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={18} />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                Sign In
              </Link>
            )}
          </div>

          <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          <Link to="/restaurants" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>
            Restaurants
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>
                My Orders
              </Link>
              <Link to="/cart" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>
                Cart ({totalItems})
              </Link>
              <button onClick={handleLogout} className="block py-2 text-red-500">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="block py-2 text-primary-600 font-medium" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
