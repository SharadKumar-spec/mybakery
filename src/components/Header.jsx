import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, Shield, LogOut, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header({ currentView, setView, role }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isOwner, openLogin, logout } = useAuth();
  const { totalCount, openCheckout } = useCart();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'categories', label: 'Products' },
    { id: 'offers', label: 'Offers' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = currentView === 'home' && !isScrolled;
  
  const headerClasses = isTransparent
    ? 'bg-transparent border-transparent'
    : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-white/40';

  const textClasses = isTransparent ? 'text-white' : 'text-bakery-800';
  const logoHover = isTransparent ? 'hover:text-[#fcd34d]' : 'hover:text-[#d97706]';
  const linkClasses = isTransparent ? 'text-gray-200 hover:text-white' : 'text-bakery-700 hover:text-[#d97706]';
  const activeLinkClasses = isTransparent ? 'text-white font-bold border-b-2 border-white' : 'text-[#d97706] font-bold border-b-2 border-[#d97706]';
  const iconClasses = isTransparent ? 'text-gray-200 hover:text-white' : 'text-bakery-700 hover:text-[#d97706]';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
            <span className={`font-black text-2xl tracking-tight drop-shadow-sm transition-colors ${textClasses} ${logoHover}`}>
              Vatika Bakery
            </span>
          </div>
          
          <nav className="hidden lg:flex space-x-7 items-center">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setView(item.id)}
                className={`font-semibold text-sm transition-all duration-300 px-1 py-1 cursor-pointer ${currentView === item.id ? activeLinkClasses : linkClasses}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button 
              onClick={openCheckout}
              className={`${iconClasses} relative transition-transform hover:scale-110 p-2 cursor-pointer`}
              title="View Cart & Checkout"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d97706] text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Owner Access & Profile (Only SHARAD / Owner appears here) */}
            <div className="relative">
              {isOwner ? (
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-amber-300 bg-amber-50/90 hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
                >
                  <img 
                    src={user?.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&q=80'} 
                    alt="SHARAD" 
                    className="h-8 w-8 rounded-full object-cover border border-amber-400 shadow-xs" 
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-black text-bakery-900 block leading-tight">SHARAD</span>
                    <span className="text-[10px] text-[#d97706] font-bold block uppercase tracking-wider">Owner</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => openLogin('owner')}
                  className="flex items-center gap-1.5 text-xs font-extrabold bg-gradient-to-r from-amber-600 to-[#d97706] hover:from-[#d97706] hover:to-amber-700 text-white px-3.5 py-2 rounded-full shadow-sm transition-all cursor-pointer border border-amber-400/50"
                  title="Bakery Owner Portal"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-200" />
                  <span>Owner (SHARAD)</span>
                </button>
              )}

              {/* Owner Dropdown Menu */}
              {showProfileMenu && isOwner && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-amber-200 p-2 text-xs z-[200]">
                  <div className="p-2.5 border-b border-bakery-100 bg-amber-50/60 rounded-xl mb-1">
                    <p className="font-extrabold text-bakery-900 text-sm">SHARAD</p>
                    <p className="text-[11px] text-gray-500">sharad@vatika.com</p>
                    <span className="inline-block mt-1 text-[10px] font-black uppercase bg-amber-200/90 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                      👑 Bakery Owner
                    </span>
                  </div>

                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => {
                        setView('orders');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2.5 hover:bg-amber-100/70 rounded-xl text-bakery-900 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Shield className="w-4 h-4 text-[#d97706]" />
                      <span>Customer Order History & Sales</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2.5 hover:bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out Owner</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
