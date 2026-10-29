import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Pre-seeded demo accounts
export const DEMO_ACCOUNTS = {
  customer: {
    id: 'usr-cust-01',
    name: 'Customer',
    email: 'customer@vatika.com',
    role: 'customer',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
  },
  owner: {
    id: 'usr-owner-01',
    name: 'SHARAD',
    email: 'sharad@vatika.com',
    role: 'owner',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&q=80'
  }
};

export function AuthProvider({ children }) {
  // Front page visitor by default. Only SHARAD (Owner) is persisted if logged in.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vatika_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only allow owner (SHARAD) session to persist
        if (parsed?.role === 'owner' || parsed?.email?.includes('owner') || parsed?.email?.includes('sharad')) {
          parsed.name = 'SHARAD';
          parsed.email = 'sharad@vatika.com';
          return parsed;
        }
        // Purge any old customer like "John Sharma"
        localStorage.removeItem('vatika_user');
        localStorage.removeItem('vatika_token');
        return null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const saved = localStorage.getItem('vatika_user');
      if (saved && JSON.parse(saved)?.role === 'owner') {
        return localStorage.getItem('vatika_token') || 'sharad-owner-token';
      }
      return null;
    } catch {
      return null;
    }
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [authRoleRequested, setAuthRoleRequested] = useState(null); // 'owner'

  useEffect(() => {
    if (user && user.role === 'owner') {
      localStorage.setItem('vatika_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vatika_user');
      localStorage.removeItem('vatika_token');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vatika_token', token);
    } else {
      localStorage.removeItem('vatika_token');
    }
  }, [token]);

  const isLoggedIn = !!user;
  const isOwner = user?.role === 'owner';

  // Requires auth and optional role check
  const requireAuth = (action, requiredRole = null) => {
    if (isLoggedIn) {
      if (!requiredRole || user.role === requiredRole) {
        action();
      } else {
        // Logged in but insufficient permissions
        setAuthRoleRequested(requiredRole);
        setPendingAction(() => action);
        setShowLoginModal(true);
      }
    } else {
      setAuthRoleRequested(requiredRole);
      setPendingAction(() => action);
      setShowLoginModal(true);
    }
  };

  const loginAs = (roleType) => {
    const account = DEMO_ACCOUNTS[roleType] || DEMO_ACCOUNTS.customer;
    setUser(account);
    setToken(`jwt-${roleType}-${Date.now()}`);
    setShowLoginModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setAuthRoleRequested(null);
  };

  const loginWithCredentials = (email, password, role = 'customer', name = null) => {
    // If owner email or chosen role is owner
    const isOwnerEmail = email.toLowerCase().includes('owner') || email.toLowerCase().includes('sharad') || role === 'owner';
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || (isOwnerEmail ? 'SHARAD' : email.split('@')[0]),
      email,
      role: isOwnerEmail ? 'owner' : 'customer',
      phone: '+91 98765 00000',
      avatar: isOwnerEmail 
        ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
    };
    setUser(newUser);
    setToken(`jwt-${newUser.role}-${Date.now()}`);
    setShowLoginModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setAuthRoleRequested(null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vatika_user');
    localStorage.removeItem('vatika_token');
  };

  const closeLogin = () => {
    setShowLoginModal(false);
    setPendingAction(null);
    setAuthRoleRequested(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoggedIn, 
      isOwner, 
      showLoginModal, 
      authRoleRequested,
      requireAuth, 
      loginAs,
      loginWithCredentials,
      logout, 
      closeLogin,
      openLogin: (role = null) => {
        setAuthRoleRequested(role);
        setShowLoginModal(true);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
