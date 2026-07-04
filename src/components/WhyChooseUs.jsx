import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wheat, Heart, Clock, Award, ArrowLeft } from 'lucide-react';

export default function WhyChooseUs() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    { 
      id: 'ingredients',
      icon: <Wheat className="w-8 h-8" />, 
      title: 'Premium Ingredients', 
      desc: 'Sourced locally and globally for the finest quality.',
      bgImage: '/images/hero/ingredients.png',
      detailDesc: 'Every product is made using carefully selected premium-quality ingredients sourced from trusted local farms and international suppliers to ensure freshness, taste, and unparalleled quality in every bite.'
    },
    { 
      id: 'love',
      icon: <Heart className="w-8 h-8" />, 
      title: 'Baked With Love', 
      desc: 'Every item is handcrafted by our expert artisans.',
      bgImage: '/images/hero/slide4.png',
      detailDesc: 'Experience the magic of our baking process. Our handcrafted preparation involves immense attention to detail, creativity, and a deep-rooted passion that goes into every single pastry, cake, and loaf we bake.'
    },
    { 
      id: 'fresh',
      icon: <Clock className="w-8 h-8" />, 
      title: 'Fresh Every Day', 
      desc: 'Baked fresh every single morning, guaranteed.',
      bgImage: '/images/hero/slide1.png',
      detailDesc: 'All our breads, cakes, pastries, and cookies are baked fresh before dawn every morning. We are committed to delivering the best taste and absolute maximum freshness to our customers every single day.'
    },
    { 
      id: 'award',
      icon: <Award className="w-8 h-8" />, 
      title: 'Award Winning', 
      desc: 'Recognized for excellence in patisserie.',
      bgImage: '/images/hero/awards.png',
      detailDesc: 'With multiple prestigious bakery achievements, we have earned immense customer trust. Our rigorous quality standards and unwavering commitment to excellence ensure you only get the absolute best.'
    }
  ];

  return (
    <>
      <section className="py-20 bg-[#fdfbf7] relative">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-bakery-900 mb-16"
          >
            Why Choose <span className="text-[#d97706]">Vatika Bakery</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((f, i) => (
              <motion.div 
                key={f.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedFeature(f)}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-bakery-100 group cursor-pointer hover:-translate-y-2"
              >
                <div className="w-16 h-16 mx-auto bg-[#fef3c7] text-[#d97706] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-bakery-800 mb-3">{f.title}</h3>
                <p className="text-bakery-600">{f.desc}</p>
                <div className="mt-6 text-[#d97706] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 overflow-hidden"
          >
            {/* Cinematic HD Background */}
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.05 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={selectedFeature.bgImage} 
                alt={selectedFeature.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            </motion.div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full">
              
              {/* Back Button */}
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setSelectedFeature(null)}
                className="absolute top-10 left-4 sm:left-8 flex items-center text-white/80 hover:text-white transition-colors group z-20"
              >
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm group-hover:bg-[#d97706] transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </div>
                <span className="ml-3 font-semibold uppercase tracking-widest text-sm">Back to Home</span>
              </motion.button>

              {/* Glassmorphism Detail Card */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                className="max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 sm:p-14 rounded-3xl shadow-2xl mt-16"
              >
                <div className="w-20 h-20 bg-[#d97706]/20 backdrop-blur-md text-[#fcd34d] rounded-2xl flex items-center justify-center mb-8 border border-[#d97706]/30">
                  {React.cloneElement(selectedFeature.icon, { className: 'w-10 h-10' })}
                </div>
                
                <h2 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                  {selectedFeature.title}
                </h2>
                
                <p className="text-[#fcd34d] text-xl font-medium mb-8 tracking-wide">
                  {selectedFeature.desc}
                </p>
                
                <div className="w-16 h-1 bg-[#d97706] mb-8 rounded-full"></div>
                
                <p className="text-white/90 text-lg sm:text-xl leading-relaxed font-light">
                  {selectedFeature.detailDesc}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
