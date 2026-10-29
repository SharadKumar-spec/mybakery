import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BakeryStory from './components/BakeryStory';
import WhyChooseUs from './components/WhyChooseUs';
import CustomerReviews from './components/CustomerReviews';
import ProductCategories from './components/ProductCategories';
import ProductGrid from './components/ProductGrid';
import OffersSection from './components/OffersSection';
import RightSidebar from './components/RightSidebar';
import Footer from './components/Footer';
import IntroScreen from './components/IntroScreen';
import OwnerDashboard from './components/OwnerDashboard';

function App() {
  const [isIntroDone, setIsIntroDone] = useState(false);
  
  // SPA Routing State
  const [currentView, setCurrentView] = useState('home');
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView('products');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col"
          >
            <HeroSection onExplore={() => setCurrentView('categories')} />
            <ProductCategories onCategorySelect={handleCategorySelect} />
            <BakeryStory />
            <WhyChooseUs />
            <CustomerReviews />
            <OffersSection />
          </motion.div>
        );
      case 'categories':
        return (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <ProductCategories onCategorySelect={handleCategorySelect} />
          </motion.div>
        );
      case 'products':
        return (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <ProductGrid 
              category={selectedCategory || 'Cakes'} 
              onBackToCategories={() => setCurrentView('categories')} 
            />
          </motion.div>
        );
      case 'offers':
        return (
          <motion.div
            key="offers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="w-full px-4 sm:px-6 lg:px-8"
          >
            <OffersSection />
          </motion.div>
        );
      case 'orders':
        return (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <OwnerDashboard />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <OrdersProvider>
          <AuthModal />
          <CheckoutModal />

          <AnimatePresence>
            {!isIntroDone && <IntroScreen onComplete={() => setIsIntroDone(true)} />}
          </AnimatePresence>

          {isIntroDone && (
            <motion.div 
              className="min-h-screen flex flex-col bg-[#fdfbf7]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Header currentView={currentView} setView={setCurrentView} role={role} />
              
              <main className="flex-grow w-full flex flex-col items-center">
                <AnimatePresence mode="wait">
                  {currentView === 'home' ? (
                    renderContent()
                  ) : (
                    <div key="page-content" className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 px-0 sm:px-0 lg:px-8 mt-24">
                      {/* Left / Center Content */}
                      <div className="flex-1 w-full lg:w-[72%] relative">
                        {renderContent()}
                      </div>
                      
                      {/* Right Sidebar */}
                      <aside className="w-full lg:w-[28%] pt-6 px-4 sm:px-6 lg:px-0">
                        <RightSidebar 
                          role={role} 
                          setRole={setRole} 
                          onOpenDashboard={() => setCurrentView('orders')} 
                        />
                      </aside>
                    </div>
                  )}
                </AnimatePresence>
              </main>
              
              <Footer />
            </motion.div>
          )}
        </OrdersProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
