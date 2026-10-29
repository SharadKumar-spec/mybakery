import React from 'react';
import { allProducts } from '../data/products';

const categories = [
  { name: 'Cakes', icon: '🎂', desc: 'Handcrafted signature & celebration cakes' },
  { name: 'Pastries', icon: '🍰', desc: 'Flaky croissants, tartlets & eclairs' },
  { name: 'Bread', icon: '🍞', desc: 'Artisan sourdough & hearth-baked loaves' },
  { name: 'Cookies', icon: '🍪', desc: 'Warm chewy cookies & buttery shortbread' },
  { name: 'Muffins', icon: '🧁', desc: 'Fresh morning muffins & whipped cupcakes' },
  { name: 'Beverages', icon: '☕', desc: 'Specialty coffee, lattes & iced coolers' },
];

export default function ProductCategories({ onCategorySelect }) {
  return (
    <div className="w-full mt-6 mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-[#d97706] tracking-wider uppercase mb-1 block">Fresh Daily</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-bakery-900 drop-shadow-sm">Explore Categories</h2>
          <p className="text-sm text-bakery-600 mt-1">Discover over 140+ freshly baked artisan treats made with organic ingredients.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {categories.map((category) => {
          const count = allProducts.filter(p => p.category === category.name).length;
          return (
            <div
              key={category.name}
              onClick={() => onCategorySelect && onCategorySelect(category.name)}
              className="flex flex-col items-center justify-center p-6 bg-white/75 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 hover:shadow-xl hover:border-amber-300 hover:bg-white/95 transition-all cursor-pointer group transform hover:-translate-y-2 duration-300 relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-2xl bg-amber-50/80 flex items-center justify-center mb-3 group-hover:bg-amber-100/70 transition-colors shadow-inner">
                <span className="text-4xl group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300 drop-shadow-sm">
                  {category.icon}
                </span>
              </div>
              <span className="text-base font-bold text-bakery-900 group-hover:text-[#d97706] transition-colors text-center">
                {category.name}
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full mt-2 border border-amber-200">
                {count}+ Items
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
