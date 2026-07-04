import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/images/hero/slide1.png',
    title: 'Welcome to Vatika Bakery',
    subtitle: 'Freshly baked happiness delivered every day.'
  },
  {
    id: 2,
    image: '/images/hero/slide2.png',
    title: 'Every Cake Tells a Story',
    subtitle: 'Handcrafted cakes made with premium ingredients.'
  },
  {
    id: 3,
    image: '/images/hero/slide3.png',
    title: 'Fresh Bread Every Morning',
    subtitle: 'Soft, warm and baked with love.'
  },
  {
    id: 4,
    image: '/images/hero/slide4.png',
    title: 'Celebrate Every Occasion',
    subtitle: 'From birthdays to weddings, we bake unforgettable memories.'
  },
  {
    id: 5,
    image: '/images/hero/slide5.png',
    title: 'Premium Cookies & Pastries',
    subtitle: "Freshly baked treats you'll love."
  }
];

const TypingText = ({ text, className, isSubtitle }) => {
  // Split text into characters
  const characters = Array.from(text);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: isSubtitle ? 0.8 : 0.2, // Delay subtitle until title is mostly done
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };

  const childVariants = {
    initial: { opacity: 0, textShadow: "0px 0px 0px rgba(255,255,255,0)" },
    animate: {
      opacity: 1,
      textShadow: "0px 0px 10px rgba(255,255,255,0.8)", // Soft glow
      transition: {
        duration: 0.5,
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={childVariants} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function HeroSection({ onExplore }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right-to-left, -1 = left-to-right
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Framer motion variants for cinematic sliding
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      zIndex: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 1, 0.5, 1] // Apple/Netflix style smooth easing
      }
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir > 0 ? '-100%' : '100%',
      transition: {
        duration: 1.2,
        ease: [0.25, 1, 0.5, 1]
      }
    })
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, delay: 1.5, ease: "easeOut" } 
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <div 
      className="relative w-full h-[65vh] sm:h-[70vh] bg-black overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            const swipe = offset.x;
            if (swipe < -50) {
              nextSlide();
            } else if (swipe > 50) {
              prevSlide();
            }
          }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Ken Burns Effect Image */}
          <motion.img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
          />

          {/* Dark gradient overlay & warm premium lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#d97706]/10 mix-blend-overlay" /> {/* Warm golden lighting tint */}
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-20">
            <TypingText 
              text={slides[currentIndex].title}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] mb-4 max-w-5xl"
              isSubtitle={false}
            />
            
            {slides[currentIndex].subtitle && (
              <TypingText
                text={slides[currentIndex].subtitle}
                className="text-lg sm:text-xl md:text-2xl text-[#fef3c7] font-light drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] mb-10 max-w-3xl"
                isSubtitle={true}
              />
            )}

            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <button 
                onClick={onExplore}
                className="bg-white/10 backdrop-blur-md border border-[#d97706]/40 text-white hover:bg-white/20 font-semibold py-3 px-8 rounded-full shadow-[0_0_30px_rgba(217,119,6,0.2)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(217,119,6,0.4)] text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 drop-shadow">Explore Menu</span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-[#d97706]/50 to-[#b45309]/50 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-500"></div>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-8 z-30 pointer-events-none">
        <button 
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="pointer-events-auto p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-[#d97706]/80 hover:border-[#d97706] transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="pointer-events-auto p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-[#d97706]/80 hover:border-[#d97706] transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`transition-all duration-500 rounded-full ${
              index === currentIndex 
                ? 'w-10 h-2.5 bg-[#d97706] shadow-[0_0_15px_rgba(217,119,6,0.9)]' 
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
