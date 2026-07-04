import React from 'react';
import { motion } from 'framer-motion';

export default function OffersSection() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group shadow-sm border border-bakery-200"
      >
        <div className="absolute inset-0 bg-bakery-100/50 -z-10"></div>
        <div className="relative z-10 w-2/3">
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Limited Time</span>
          <h3 className="text-2xl font-bold text-bakery-900 mb-2">Flat 20% OFF</h3>
          <p className="text-bakery-700 mb-6">On all custom and signature cakes this weekend.</p>
          <button className="bg-bakery-800 text-white px-6 py-2 rounded-full font-medium hover:bg-bakery-900 transition-colors shadow-md transform group-hover:scale-105 duration-300">Claim Offer</button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-bakery-200 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-bakery-800/95 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group shadow-sm border border-bakery-700"
      >
        <div className="relative z-10 w-2/3">
          <span className="bg-yellow-400 text-bakery-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Best Deal</span>
          <h3 className="text-2xl font-bold text-white mb-2">Buy 2 Get 1 Free</h3>
          <p className="text-bakery-200 mb-6">On all freshly baked premium cookies.</p>
          <button className="bg-white text-bakery-900 px-6 py-2 rounded-full font-medium hover:bg-bakery-50 transition-colors shadow-md transform group-hover:scale-105 duration-300">Shop Cookies</button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-bakery-700 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
      </motion.div>
    </div>
  );
}
