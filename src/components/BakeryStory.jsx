import React from 'react';
import { motion } from 'framer-motion';

export default function BakeryStory() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#d97706]/20 rounded-3xl transform translate-x-4 translate-y-4"></div>
            <img src="/images/hero/slide6.png" alt="Bakery Interior" className="relative rounded-3xl shadow-xl w-full object-cover h-[450px]" />
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2"
        >
          <h2 className="text-sm font-bold text-[#d97706] tracking-widest uppercase mb-3">Our Story</h2>
          <h3 className="text-4xl sm:text-5xl font-bold text-bakery-900 mb-6 leading-tight">Baking Memories Since 1995</h3>
          <p className="text-lg text-bakery-600 mb-6 leading-relaxed">
            At Vatika Bakery, we believe that every pastry, loaf of bread, and slice of cake is a work of art. 
            Started as a small family oven, we have grown into a beloved neighborhood institution, never losing sight 
            of our core philosophy: premium ingredients, time-honored techniques, and baking with love.
          </p>
          <p className="text-lg text-bakery-600 mb-8 leading-relaxed">
            Our master bakers wake up before dawn every day to ensure that by the time the sun rises, 
            the neighborhood is filled with the irresistible aroma of freshly baked goods. We don't just bake; 
            we craft experiences.
          </p>
          <button className="bg-bakery-900 text-white hover:bg-[#d97706] transition-colors py-3 px-8 rounded-full font-semibold shadow-lg">Read More</button>
        </motion.div>
      </div>
    </section>
  );
}
