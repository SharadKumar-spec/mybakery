import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpDown, Sparkles, Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { allProducts } from '../data/products';

const categories = [
  { name: 'Cakes', icon: '🎂' },
  { name: 'Pastries', icon: '🍰' },
  { name: 'Bread', icon: '🍞' },
  { name: 'Cookies', icon: '🍪' },
  { name: 'Muffins', icon: '🧁' },
  { name: 'Beverages', icon: '☕' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

export default function ProductGrid({ category: initialCategory = 'Cakes', onBackToCategories }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [activeFilter, setActiveFilter] = useState('all');

  // Keep internal category in sync if parent prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Loading simulation when switching category
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350); // fast & snappy

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let list = allProducts;

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tag && p.tag.toLowerCase().includes(q))
      );
    }

    // Sub-filter tag
    if (activeFilter === 'bestseller') {
      list = list.filter(p => p.tag?.toLowerCase().includes('bestseller'));
    } else if (activeFilter === 'new') {
      list = list.filter(p => p.isNew);
    } else if (activeFilter === 'chef') {
      list = list.filter(p => p.tag?.toLowerCase().includes('chef') || p.tag?.toLowerCase().includes('signature') || p.tag?.toLowerCase().includes('gourmet'));
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return a.id - b.id; // default
    });
  }, [selectedCategory, searchQuery, activeFilter, sortBy]);

  const currentCount = displayedProducts.length;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full mt-4 mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Header & Back Link */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-bakery-200/60">
        <div>
          {onBackToCategories && (
            <button 
              onClick={onBackToCategories}
              className="inline-flex items-center text-sm font-semibold text-[#d97706] mb-2 hover:text-[#b45309] hover:underline transition-all cursor-pointer group"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform mr-1.5">&larr;</span> Back to All Categories
            </button>
          )}
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold text-bakery-900 tracking-tight drop-shadow-sm">
              {selectedCategory}
            </h2>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
              {currentCount} {currentCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Quick Category Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 mt-4 md:mt-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shadow-xs cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#d97706] text-white border-[#d97706] shadow-sm'
                : 'bg-white/80 text-bakery-800 border-white/60 hover:bg-amber-50 hover:border-amber-300'
            }`}
          >
            ✨ All ({allProducts.length})
          </button>
          {categories.map((cat) => {
            const catCount = allProducts.filter(p => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shadow-xs cursor-pointer ${
                  isSelected
                    ? 'bg-[#d97706] text-white border-[#d97706] shadow-sm'
                    : 'bg-white/80 text-bakery-800 border-white/60 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] ml-0.5 opacity-80 ${isSelected ? 'text-amber-100' : 'text-gray-500'}`}>
                  ({catCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 mb-8 shadow-xs border border-white/60 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search within ${selectedCategory.toLowerCase()}...`}
            className="w-full bg-white/90 rounded-xl py-2 px-4 pl-10 text-sm text-bakery-900 placeholder-bakery-400 focus:outline-none focus:ring-2 focus:ring-[#d97706] border border-bakery-200 shadow-inner"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-bakery-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Badges & Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-bakery-900 text-white'
                  : 'bg-white/60 text-bakery-700 hover:bg-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('bestseller')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'bestseller'
                  ? 'bg-bakery-900 text-white'
                  : 'bg-white/60 text-bakery-700 hover:bg-white'
              }`}
            >
              ⭐ Bestsellers
            </button>
            <button
              onClick={() => setActiveFilter('chef')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'chef'
                  ? 'bg-bakery-900 text-white'
                  : 'bg-white/60 text-bakery-700 hover:bg-white'
              }`}
            >
              👨‍🍳 Chef's Specials
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'new'
                  ? 'bg-bakery-900 text-white'
                  : 'bg-white/60 text-bakery-700 hover:bg-white'
              }`}
            >
              ✨ New
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/90 rounded-xl px-3 py-1.5 border border-bakery-200">
            <ArrowUpDown className="h-3.5 w-3.5 text-bakery-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-medium text-bakery-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Popular</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Product Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {displayedProducts.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-md p-12 rounded-3xl text-center border border-white/50 shadow-xs max-w-md mx-auto">
              <span className="text-4xl mb-3 block">🧁</span>
              <h3 className="text-lg font-bold text-bakery-900 mb-1">No products found</h3>
              <p className="text-sm text-bakery-600 mb-4">
                No items match your search or filter in {selectedCategory}.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="text-xs font-bold text-[#d97706] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
