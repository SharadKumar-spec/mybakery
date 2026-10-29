import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { allProducts } from '../data/products';

const OrdersContext = createContext();

const INITIAL_ORDERS = [
  {
    id: 'VB-10482',
    customer: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      phone: '+91 98451 23098',
      address: 'Flat 402, Green Glen Layout, Bellandur, Bangalore'
    },
    items: [
      {
        id: 1,
        name: 'Belgian Chocolate Truffle Cake',
        category: 'Cakes',
        price: 34.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 122,
        name: 'Classic Italian Cappuccino',
        category: 'Beverages',
        price: 4.25,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
      }
    ],
    total: 45.66,
    paymentMethod: 'UPI',
    paymentDetails: {
      upiApp: 'Google Pay',
      upiId: 'sarah@okaxis',
      transactionId: 'UPI-TXN-88219482'
    },
    status: 'Delivered',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString() // yesterday
  },
  {
    id: 'VB-10483',
    customer: {
      name: 'Michael Chen',
      email: 'm.chen@outlook.com',
      phone: '+91 98112 34567',
      address: 'Villa 12, Palm Meadows, Whitefield, Bangalore'
    },
    items: [
      {
        id: 76,
        name: 'Royal Danish Butter Cookies (Tin)',
        category: 'Cookies',
        price: 8.99,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 49,
        name: 'Artisan Country Sourdough Loaf',
        category: 'Bread',
        price: 6.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
      }
    ],
    total: 35.66,
    paymentMethod: 'Credit Card',
    paymentDetails: {
      cardBrand: 'Visa',
      last4: '4242',
      transactionId: 'CARD-TXN-9018239'
    },
    status: 'Baking',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
  },
  {
    id: 'VB-10484',
    customer: {
      name: 'Priya Sharma',
      email: 'priya.s@gmail.com',
      phone: '+91 97410 88291',
      address: '24, 2nd Cross, Indiranagar, Bangalore'
    },
    items: [
      {
        id: 2,
        name: 'Red Velvet Cream Cheese Cake',
        category: 'Cakes',
        price: 39.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 97,
        name: 'Wild Blueberry Streusel Muffin',
        category: 'Muffins',
        price: 3.75,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    total: 57.74,
    paymentMethod: 'UPI',
    paymentDetails: {
      upiApp: 'PhonePe',
      upiId: 'priya@ybl',
      transactionId: 'UPI-TXN-77382910'
    },
    status: 'Out for Delivery',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString() // 1 hour ago
  },
  {
    id: 'VB-10485',
    customer: {
      name: 'Rohan Mehta',
      email: 'rohan.m@yahoo.com',
      phone: '+91 99002 11445',
      address: 'B-201, Sobha City, Thanisandra, Bangalore'
    },
    items: [
      {
        id: 25,
        name: 'Fresh Strawberry Cream Pastry',
        category: 'Pastries',
        price: 4.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 121,
        name: 'Artisanal Flat White Coffee',
        category: 'Beverages',
        price: 4.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
      }
    ],
    total: 15.20,
    paymentMethod: 'UPI',
    paymentDetails: {
      upiApp: 'Paytm',
      upiId: 'rohan@paytm',
      transactionId: 'UPI-TXN-11928472'
    },
    status: 'Pending',
    createdAt: new Date(Date.now() - 60000 * 18).toISOString() // 18 mins ago
  }
];

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('vatika_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vatika_orders', JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders", e);
    }
  }, [orders]);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `VB-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord)
    );
  };

  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'Cancelled');
  };

  // Analytics Metrics ("see the who may muny i have arane" & "who many may prodect is sale or not")
  const metrics = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'Cancelled');

    // 1. Total Money Earned (Revenue)
    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // 2. Total Individual Product Units Sold
    const totalItemsSold = validOrders.reduce((sum, o) => {
      const orderUnits = o.items.reduce((itemSum, i) => itemSum + (i.quantity || 1), 0);
      return sum + orderUnits;
    }, 0);

    // 3. Payment Method breakdown
    const upiRevenue = validOrders
      .filter(o => o.paymentMethod === 'UPI')
      .reduce((sum, o) => sum + o.total, 0);

    const cardRevenue = validOrders
      .filter(o => o.paymentMethod === 'Credit Card')
      .reduce((sum, o) => sum + o.total, 0);

    // 4. Product Sales Stats (Units sold & revenue per product across all 144 products)
    const salesMap = {};
    validOrders.forEach(order => {
      order.items.forEach(item => {
        if (!salesMap[item.id]) {
          salesMap[item.id] = {
            unitsSold: 0,
            revenueEarned: 0
          };
        }
        const qty = item.quantity || 1;
        salesMap[item.id].unitsSold += qty;
        salesMap[item.id].revenueEarned += (item.price * qty);
      });
    });

    const productSalesStats = allProducts.map(prod => {
      const stats = salesMap[prod.id] || { unitsSold: 0, revenueEarned: 0 };
      return {
        ...prod,
        unitsSold: stats.unitsSold,
        revenueEarned: +stats.revenueEarned.toFixed(2),
        isSold: stats.unitsSold > 0
      };
    });

    const totalProductsCatalogCount = allProducts.length;
    const soldProductsCount = productSalesStats.filter(p => p.isSold).length;
    const unsoldProductsCount = totalProductsCatalogCount - soldProductsCount;

    return {
      totalRevenue: +totalRevenue.toFixed(2),
      totalItemsSold,
      totalOrdersCount: orders.length,
      pendingCount: orders.filter(o => o.status === 'Pending').length,
      bakingCount: orders.filter(o => o.status === 'Baking').length,
      outForDeliveryCount: orders.filter(o => o.status === 'Out for Delivery').length,
      deliveredCount: orders.filter(o => o.status === 'Delivered').length,
      cancelledCount: orders.filter(o => o.status === 'Cancelled').length,
      upiRevenue: +upiRevenue.toFixed(2),
      cardRevenue: +cardRevenue.toFixed(2),
      productSalesStats,
      soldProductsCount,
      unsoldProductsCount,
      totalProductsCatalogCount
    };
  }, [orders]);

  return (
    <OrdersContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      cancelOrder,
      metrics
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
