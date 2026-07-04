import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ProductCard({ product }) {
  const { requireAuth } = useAuth();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      console.log(`Added ${product.name} to cart!`);
    });
  };

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-white/40 hover:shadow-xl transition-shadow group cursor-pointer relative"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-[#d97706] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            New
          </span>
        )}
      </div>
      <div className="p-4 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-bakery-900 line-clamp-1">{product.name}</h3>
        </div>
        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-extrabold text-bakery-800">${product.price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-white/50 hover:bg-white/90 text-bakery-800 p-2.5 rounded-full transition-colors border border-white/60 shadow-sm hover:shadow-md group-hover:bg-[#d97706] group-hover:text-white group-hover:border-[#d97706]"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
