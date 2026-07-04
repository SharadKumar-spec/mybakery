import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-001', user: 'Sarah Jenkins', product: 'Chocolate Truffle Cake', qty: 1, status: 'Delivered', date: 'Oct 24, 2026' },
  { id: 'ORD-002', user: 'Michael Chen', product: 'Danish Butter Cookies', qty: 3, status: 'Pending', date: 'Oct 25, 2026' },
  { id: 'ORD-003', user: 'Emma Watson', product: 'Strawberry Pastry', qty: 2, status: 'Cancelled', date: 'Oct 25, 2026' },
  { id: 'ORD-004', user: 'David Smith', product: 'Whole Wheat Brown Bread', qty: 1, status: 'Pending', date: 'Oct 26, 2026' },
];

export default function AdminOrders() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full mt-6 mb-12 px-4 sm:px-6 lg:px-8 mx-auto"
    >
      <h2 className="text-3xl font-bold text-bakery-900 mb-8 flex items-center drop-shadow-sm">
        <Package className="mr-3 h-8 w-8 text-[#d97706]" />
        Admin Dashboard: All Orders
      </h2>
      
      <div className="bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-white/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bakery-100/50 border-b border-bakery-200/50 text-bakery-800">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold text-center">Qty</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={order.id} 
                  className="border-b border-bakery-100/50 hover:bg-white/50 transition-colors"
                >
                  <td className="p-4 font-medium text-bakery-900">{order.id}</td>
                  <td className="p-4 text-bakery-800">{order.user}</td>
                  <td className="p-4 text-bakery-700">{order.product}</td>
                  <td className="p-4 text-center font-semibold text-bakery-900">{order.qty}</td>
                  <td className="p-4 text-gray-500 text-sm">{order.date}</td>
                  <td className="p-4">
                    {order.status === 'Delivered' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm border border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" /> Delivered
                      </span>
                    )}
                    {order.status === 'Pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-sm border border-blue-200">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                      </span>
                    )}
                    {order.status === 'Cancelled' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 shadow-sm border border-red-200">
                        <XCircle className="w-3 h-3 mr-1" /> Cancelled
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
