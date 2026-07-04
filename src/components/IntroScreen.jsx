import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroScreen({ onComplete }) {
  const [showSub, setShowSub] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const welcomeText = "WELCOME";
  const subText = "TO VATIKA BAKERY";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  useEffect(() => {
    const welcomeTime = welcomeText.length * 200 + 400;
    
    // Show subtext after welcome text finishes typing
    const subTimer = setTimeout(() => {
      setShowSub(true);
    }, welcomeTime);

    // Add 2-second pause after typing completes before triggering complete
    const doneTimer = setTimeout(() => {
      setIsDone(true);
    }, welcomeTime + (subText.length * 100) + 2000); 

    const unmountTimer = setTimeout(() => {
      onComplete();
    }, welcomeTime + (subText.length * 100) + 3500);

    return () => {
      clearTimeout(subTimer);
      clearTimeout(doneTimer);
      clearTimeout(unmountTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
        >
          {/* Slow Parallax Background */}
          <motion.img 
            src="/bakery-bg.png" 
            alt="Bakery Intro Background"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 15, ease: "linear" }}
          />

          {/* Dark Blurred Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          {/* Text Content */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex space-x-2 text-5xl md:text-7xl font-extrabold tracking-widest text-[#fcd34d] drop-shadow-[0_0_20px_rgba(217,119,6,0.8)]"
            >
              {welcomeText.split('').map((char, index) => (
                <motion.span key={index} variants={item}>
                  {char}
                </motion.span>
              ))}
            </motion.div>

            <AnimatePresence>
              {showSub && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mt-6 text-xl md:text-3xl font-light text-[#fef3c7] tracking-wider drop-shadow-[0_0_10px_rgba(252,211,77,0.6)] flex items-center"
                >
                  {subText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="ml-1 inline-block bg-[#fcd34d] w-[3px] h-[28px] md:h-[36px] drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
