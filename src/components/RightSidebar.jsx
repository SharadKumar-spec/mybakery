import React from 'react';
import { User, Package, Clock, XCircle, ShoppingBag, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RightSidebar({ role, setRole }) {
  const { requireAuth } = useAuth();

  return (
    <div className="w-full flex flex-col space-y-6">
      
      {/* Demo Role Toggle */}
      <div className="bg-gradient-to-r from-bakery-900 to-bakery-800 rounded-3xl p-5 shadow-lg border border-bakery-700 flex justify-between items-center text-white">
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-3 text-[#fcd34d]" />
          <span className="font-semibold text-sm tracking-wide uppercase">Current Role</span>
        </div>
        <div className="flex bg-bakery-950/50 rounded-full p-1 border border-white/10 backdrop-blur-sm">
          <button 
            onClick={() => setRole('user')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${role === 'user' ? 'bg-[#d97706] text-white shadow-md' : 'text-bakery-300 hover:text-white'}`}
          >
            User
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${role === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'text-bakery-300 hover:text-white'}`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/40">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-12 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/60 shadow-inner">
            <User className="h-6 w-6 text-bakery-700" />
          </div>
          <div>
            <h3 className="font-bold text-bakery-900 text-lg">{role === 'admin' ? 'Admin Mode' : 'Hello, John!'}</h3>
            <p className="text-sm text-green-600 font-medium">Logged in</p>
          </div>
        </div>
        <div className="pt-4 border-t border-bakery-100/50">
          <button 
            onClick={() => requireAuth(() => console.log("View Profile"))}
            className="w-full flex items-center justify-between text-sm text-bakery-800 hover:text-[#d97706] font-medium transition-colors"
          >
            <span>View Profile</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/40">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-bakery-900 text-lg flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-bakery-700" /> Cart
          </h3>
          <span className="bg-[#fef3c7] text-[#d97706] text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-[#fde68a]">2 Items</span>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-3">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&q=80" alt="Cake" className="h-10 w-10 rounded-md object-cover shadow-sm" />
              <div>
                <p className="font-medium text-bakery-900">Truffle Cake</p>
                <p className="text-xs text-gray-600">Qty: 1</p>
              </div>
            </div>
            <span className="font-medium text-bakery-900">$34.99</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-3">
              <img src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=100&q=80" alt="Cookies" className="h-10 w-10 rounded-md object-cover shadow-sm" />
              <div>
                <p className="font-medium text-bakery-900">Butter Cookies</p>
                <p className="text-xs text-gray-600">Qty: 2</p>
              </div>
            </div>
            <span className="font-medium text-bakery-900">$17.98</span>
          </div>
        </div>
        <div className="pt-4 border-t border-bakery-100/50 flex justify-between items-center mb-6">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-xl font-bold text-bakery-900">$52.97</span>
        </div>
        <button 
          onClick={() => requireAuth(() => console.log("Proceed to Checkout"))}
          className="w-full bg-gradient-to-r from-bakery-600 to-[#d97706] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md"
        >
          Checkout
        </button>
      </div>

      {/* Quick Status Summary */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/40">
        <h3 className="font-bold text-bakery-900 text-lg mb-4">My Orders Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/60">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3 shadow-inner">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-bakery-900">Pending</span>
            </div>
            <span className="font-bold text-bakery-900">1</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/60">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3 shadow-inner">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-bakery-900">Delivered</span>
            </div>
            <span className="font-bold text-bakery-900">12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
