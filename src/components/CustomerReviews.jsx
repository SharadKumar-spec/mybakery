import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function CustomerReviews() {
  const reviews = [
    { name: 'Sarah Jenkins', text: 'The chocolate cake was an absolute masterpiece! Every layer was so rich and the presentation was out of this world.', rating: 5 },
    { name: 'Michael Chen', text: 'Best artisan bread in town. The crust is perfectly crispy and the inside is so soft. A daily staple for my family now.', rating: 5 },
    { name: 'Emma Roberts', text: 'We ordered pastries for our office meeting and everyone was blown away. Fresh, buttery, and melt-in-your-mouth delicious.', rating: 5 }
  ];

  return (
    <section className="py-20 bg-bakery-900 text-white relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-16">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl"
            >
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(r.rating)].map((_, idx) => <Star key={idx} className="w-5 h-5 text-[#fcd34d] fill-[#fcd34d]" />)}
              </div>
              <p className="text-gray-200 mb-6 italic leading-relaxed">"{r.text}"</p>
              <h4 className="font-bold text-white">— {r.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
