import React from 'react';

const categories = [
  { name: 'Cakes', icon: '🎂' },
  { name: 'Pastries', icon: '🍰' },
  { name: 'Bread', icon: '🍞' },
  { name: 'Cookies', icon: '🍪' },
  { name: 'Muffins', icon: '🧁' },
  { name: 'Beverages', icon: '☕' },
];

export default function ProductCategories({ onCategorySelect }) {
  return (
    <div className="w-full mt-6 mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-bakery-900 mb-8 drop-shadow-sm">Explore Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => onCategorySelect && onCategorySelect(category.name)}
            className="flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/40 hover:shadow-xl hover:border-white/80 transition-all cursor-pointer group transform hover:-translate-y-2 duration-300"
          >
            <span className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 drop-shadow-md">{category.icon}</span>
            <span className="text-base font-bold text-bakery-800">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
