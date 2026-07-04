import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ currentView, setView, role }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { requireAuth } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'categories', label: 'Products' },
    { id: 'offers', label: 'Offers' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
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
            <span className={`font-bold text-2xl tracking-tight drop-shadow-sm transition-colors ${textClasses} ${logoHover}`}>Vatika Bakery</span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search cakes, bread, cookies..."
                className={`w-full backdrop-blur-sm rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#d97706] transition-all shadow-inner border ${
                  isTransparent 
                    ? 'bg-white/10 border-white/30 text-white placeholder-gray-300 focus:bg-white/20' 
                    : 'bg-white/50 border-bakery-200 text-gray-800 focus:bg-white'
                }`}
              />
              <Search className={`absolute left-3 top-2.5 h-5 w-5 ${isTransparent ? 'text-gray-300 group-focus-within:text-white' : 'text-bakery-400'}`} />
            </div>
          </div>

          <nav className="hidden lg:flex space-x-8 items-center">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => {
                  if (item.id === 'about' || item.id === 'contact') {
                    setView('home'); 
                  } else {
                    setView(item.id);
                  }
                }}
                className={`font-medium transition-all duration-300 px-1 py-1 ${currentView === item.id ? activeLinkClasses : linkClasses}`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Conditional Admin Tab */}
            {role === 'admin' && (
              <button 
                onClick={() => requireAuth(() => setView('orders'))}
                className={`font-medium transition-all duration-300 px-1 py-1 ${currentView === 'orders' ? (isTransparent ? 'text-blue-300 font-bold border-b-2 border-blue-300' : 'text-blue-600 font-bold border-b-2 border-blue-600') : (isTransparent ? 'text-blue-200 hover:text-blue-300' : 'text-bakery-700 hover:text-blue-600')}`}
              >
                My Orders
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-5 ml-4">
            <button 
              onClick={() => requireAuth(() => console.log("Open Cart Modal"))}
              className={`${iconClasses} relative transition-transform hover:scale-110`}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className={`absolute -top-1.5 -right-1.5 ${isTransparent ? 'bg-white text-[#d97706]' : 'bg-[#d97706] text-white'} text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border ${isTransparent ? 'border-[#d97706]' : 'border-white'} shadow-sm`}>2</span>
            </button>
            <button 
              onClick={() => requireAuth(() => console.log("View Profile"))}
              className={`${iconClasses} hidden sm:block transition-transform hover:scale-110`}
            >
              <User className="h-6 w-6" />
            </button>
            <button className={`${iconClasses} lg:hidden`}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
