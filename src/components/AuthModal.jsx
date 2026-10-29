import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Shield, User, Mail, Key, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { showLoginModal, closeLogin, loginAs, loginWithCredentials, authRoleRequested } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState(authRoleRequested || 'customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!showLoginModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    loginWithCredentials(email, password, role, name);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-bakery-200/80 max-w-md w-full p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={closeLogin}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Role Request Banner if triggered by unauthorized access */}
          {authRoleRequested === 'owner' && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5">
              <Shield className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">Bakery Owner Credentials Required</p>
                <p className="text-[11px] text-amber-700">Please sign in as Owner to view Revenue & Sales Analytics.</p>
              </div>
            </div>
          )}

          {/* Icon & Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-100 text-[#d97706] rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-bakery-900 tracking-tight">
                {tab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-xs text-bakery-600 font-medium">Vatika Bakery Secure Authentication</p>
            </div>
          </div>

          {/* Quick 1-Click Demo Logins */}
          <div className="mb-5 p-3.5 bg-bakery-50/80 rounded-2xl border border-bakery-200/60">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
              ⚡ 1-Click Fast Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAs('customer')}
                className="flex items-center justify-center gap-1.5 p-2.5 bg-white hover:bg-amber-50 text-bakery-900 rounded-xl border border-bakery-200 shadow-xs text-xs font-bold transition-all cursor-pointer hover:border-[#d97706]"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => loginAs('owner')}
                className="flex items-center justify-center gap-1.5 p-2.5 bg-amber-500 hover:bg-amber-600 text-bakery-950 rounded-xl border border-amber-400 shadow-xs text-xs font-extrabold transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-bakery-950" />
                <span>Owner (SHARAD)</span>
              </button>
            </div>
          </div>

          {/* Sign In vs Sign Up Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${tab === 'login' ? 'bg-white text-bakery-900 shadow-xs' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${tab === 'signup' ? 'bg-white text-bakery-900 shadow-xs' : 'text-gray-500'}`}
            >
              New Registration
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-bakery-800 block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Sharma"
                    className="w-full bg-bakery-50 border border-bakery-200 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-bakery-800 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@vatika.com"
                  className="w-full bg-bakery-50 border border-bakery-200 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-bakery-800 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bakery-50 border border-bakery-200 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                />
                <Key className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-xs font-semibold text-bakery-800 block mb-1">Account Permission</label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${role === 'customer' ? 'border-[#d97706] bg-amber-50/70 font-bold text-bakery-900' : 'border-gray-200 text-gray-600'}`}>
                  <input
                    type="radio"
                    name="auth_role"
                    value="customer"
                    checked={role === 'customer'}
                    onChange={() => setRole('customer')}
                    className="accent-[#d97706]"
                  />
                  <span>Customer</span>
                </label>
                <label className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${role === 'owner' ? 'border-[#d97706] bg-amber-50/70 font-bold text-bakery-900' : 'border-gray-200 text-gray-600'}`}>
                  <input
                    type="radio"
                    name="auth_role"
                    value="owner"
                    checked={role === 'owner'}
                    onChange={() => setRole('owner')}
                    className="accent-[#d97706]"
                  />
                  <span>Bakery Owner</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-bakery-900 to-[#d97706] hover:from-[#d97706] hover:to-bakery-900 text-white font-bold py-3 rounded-xl shadow-md transition-all text-xs cursor-pointer"
            >
              {tab === 'login' ? 'Sign In' : 'Register & Enter'}
            </button>
          </form>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
