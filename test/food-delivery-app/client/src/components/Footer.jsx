import { UtensilsCrossed } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <UtensilsCrossed size={24} />
              <span>FoodDash</span>
            </div>
            <p className="text-sm text-gray-400">
              Your favorite restaurants, delivered fast to your door. Fresh food, great prices, amazing service.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/restaurants" className="hover:text-primary-400">Browse Restaurants</a></li>
              <li><a href="/login" className="hover:text-primary-400">Sign In</a></li>
              <li><a href="/register" className="hover:text-primary-400">Create Account</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@fooddash.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>123 Food Street, NY 10001</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; 2026 FoodDash. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
