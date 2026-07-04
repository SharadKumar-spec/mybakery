import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const allProducts = [
  {
    id: 1,
    name: 'Chocolate Truffle Cake',
    category: 'Cakes',
    price: 34.99,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isNew: true,
  },
  {
    id: 2,
    name: 'Strawberry Pastry',
    category: 'Pastries',
    price: 4.99,
    rating: 4.5,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isNew: false,
  },
  {
    id: 3,
    name: 'Whole Wheat Brown Bread',
    category: 'Bread',
    price: 5.49,
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isNew: false,
  },
  {
    id: 4,
    name: 'Danish Butter Cookies',
    category: 'Cookies',
    price: 8.99,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isNew: false,
  },
  {
    id: 5,
    name: 'Red Velvet Cake',
    category: 'Cakes',
    price: 39.99,
    rating: 4.6,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isNew: false,
  },
  {
    id: 6,
    name: 'Vanilla Bean Cake',
    category: 'Cakes',
    price: 29.99,
    rating: 4.4,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isNew: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function ProductGrid({ category, onBackToCategories }) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter products by selected category
  const filteredProducts = allProducts.filter(p => p.category === category);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 second loading simulation

    return () => clearTimeout(timer);
  }, [category]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full mt-6 mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <button 
            onClick={onBackToCategories}
            className="text-sm font-semibold text-[#d97706] mb-2 hover:underline transition-all"
          >
            &larr; Back to Categories
          </button>
          <h2 className="text-3xl font-bold text-bakery-900 drop-shadow-sm">{category}</h2>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(Math.max(filteredProducts.length, 3))].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-md p-10 rounded-3xl text-center border border-white/40">
              <p className="text-xl text-bakery-600 font-medium">No {category.toLowerCase()} available right now.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
