import React, { useState } from 'react';
import { Star, ShoppingCart, Check, Smartphone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { categoryFallbacks } from '../data/products';
import ProductBookingModal from './ProductBookingModal';

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState(product.image);
  const [added, setAdded] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleImageError = () => {
    const fallback = categoryFallbacks[product.category] || categoryFallbacks['Cakes'];
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <>
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        onClick={() => setIsBookingOpen(true)}
        className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-white/60 hover:shadow-xl hover:border-amber-200 transition-all group cursor-pointer relative flex flex-col justify-between"
      >
        <div>
          <div className="relative h-52 overflow-hidden bg-amber-50">
            <img
              src={imgSrc}
              alt={product.name}
              onError={handleImageError}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.tag && (
              <span className="absolute top-2.5 left-2.5 bg-bakery-900/90 backdrop-blur-sm text-[#fcd34d] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {product.tag}
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-2.5 right-2.5 bg-[#d97706] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                New
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-base font-bold text-bakery-900 line-clamp-1 group-hover:text-[#d97706] transition-colors" title={product.name}>
                {product.name}
              </h3>
            </div>
            
            {product.description && (
              <p className="text-xs text-bakery-600 line-clamp-2 mb-2.5 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-current' : 'text-gray-200'}`}
                />
              ))}
              <span className="text-xs font-semibold text-amber-700 ml-1">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-bakery-100/50 gap-2">
          <div>
            <span className="text-lg font-black text-bakery-900">${product.price.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Book & Pay with UPI button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBookingOpen(true);
              }}
              className="flex items-center gap-1 bg-gradient-to-r from-bakery-900 via-[#b45309] to-[#d97706] hover:from-[#d97706] hover:to-amber-700 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
              title="Instant Book with UPI or Card"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <span>View & Book</span>
            </button>

            {/* Add to Cart icon */}
            <button 
              onClick={handleAddToCart}
              className={`p-2 rounded-xl transition-all border shadow-xs cursor-pointer ${
                added 
                  ? 'bg-green-600 text-white border-green-600' 
                  : 'bg-amber-50 hover:bg-[#d97706] text-bakery-800 hover:text-white border-amber-200 hover:border-[#d97706]'
              }`}
              title="Add to cart"
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Product Booking & Payment Modal */}
      <ProductBookingModal 
        product={product} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}
