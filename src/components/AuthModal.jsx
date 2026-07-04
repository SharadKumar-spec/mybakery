import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { showLoginModal, closeLogin, login } = useAuth();

  return (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white/90 backdrop-blur-xl border border-white/40 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full relative"
          >
            <button 
              onClick={closeLogin}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-[#fef3c7] text-[#d97706] rounded-full flex items-center justify-center mb-6 border border-[#fde68a] shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-bakery-900 mb-3 tracking-tight">Secure Access</h2>
            <p className="text-bakery-600 mb-8 font-medium">Please login to continue your purchase.</p>
            
            <button 
              onClick={login}
              className="w-full bg-gradient-to-r from-bakery-900 to-[#d97706] hover:from-[#d97706] hover:to-bakery-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
            >
              Sign In (Demo)
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account? <span className="text-[#d97706] font-semibold cursor-pointer hover:underline">Sign Up</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
