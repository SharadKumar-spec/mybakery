import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vatika_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          name: 'Belgian Chocolate Truffle Cake',
          price: 34.99,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
          category: 'Cakes',
          quantity: 1
        },
        {
          id: 76,
          name: 'Royal Danish Butter Cookies (Tin)',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80',
          category: 'Cookies',
          quantity: 2
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('vatika_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = +(subtotal * 0.05).toFixed(2); // 5% bakery tax
  const deliveryFee = subtotal > 35 || subtotal === 0 ? 0 : 3.50;
  const totalPrice = +(subtotal + tax + deliveryFee).toFixed(2);

  return (
    <CartContext.Provider value={{
      cartItems,
      totalCount,
      subtotal,
      tax,
      deliveryFee,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCheckoutOpen,
      openCheckout: () => setIsCheckoutOpen(true),
      closeCheckout: () => setIsCheckoutOpen(false),
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
