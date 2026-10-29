import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Package, TrendingUp, ShoppingBag, Clock, 
  CheckCircle2, XCircle, ShieldAlert, Lock, Search, Filter, 
  ArrowUpRight, Smartphone, CreditCard, ChevronRight, Eye, RefreshCw, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

export default function OwnerDashboard() {
  const { isOwner, user, openLogin } = useAuth();
  const { orders, metrics, updateOrderStatus } = useOrders();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'sales' | 'revenue'
  const [productFilter, setProductFilter] = useState('all'); // 'all' | 'sold' | 'unsold'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // AUTHORIZATION LOCK: If not logged in as Owner
  if (!isOwner) {
    return (
      <div className="w-full mt-10 mb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl border-2 border-red-200/80 rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-200 shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-100/70 px-3 py-1 rounded-full border border-red-200">
            Confidential Owner Data
          </span>
          <h2 className="text-3xl font-extrabold text-bakery-900 mt-3 mb-2">
            Customer Booking History is Private to SHARAD
          </h2>
          <p className="text-sm text-bakery-600 max-w-md mx-auto mb-6 leading-relaxed">
            Customer booking history, delivery addresses, UPI payments, and earnings are strictly protected and can only be viewed by the Bakery Owner (<strong>SHARAD</strong>).
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <button
              onClick={() => openLogin('owner')}
              className="w-full bg-gradient-to-r from-amber-600 to-[#d97706] hover:from-[#d97706] hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Unlock as SHARAD (Owner)</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-4">Owner Credentials: sharad@vatika.com / owner123</p>
        </motion.div>
      </div>
    );
  }

  // Filter products for the "Sold vs Not Sold" table
  const filteredProducts = metrics.productSalesStats.filter(prod => {
    // Sold vs Unsold
    if (productFilter === 'sold' && !prod.isSold) return false;
    if (productFilter === 'unsold' && prod.isSold) return false;

    // Category
    if (selectedCategory !== 'All' && prod.category !== selectedCategory) return false;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return prod.name.toLowerCase().includes(q) || prod.category.toLowerCase().includes(q);
    }
    return true;
  });

  // Filter orders
  const filteredOrders = orders.filter(ord => {
    if (orderStatusFilter !== 'all' && ord.status.toLowerCase() !== orderStatusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full mt-4 mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-bakery-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
              👑 Owner Portal • SHARAD
            </span>
            <span className="text-xs text-green-700 font-bold bg-green-100 px-2.5 py-0.5 rounded-full border border-green-200">
              ● Live Financial & Customer Data
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-bakery-900 tracking-tight">
            Customer Booking History & Revenue Center
          </h1>
          <p className="text-sm text-bakery-600 mt-1">
            Welcome, <strong className="text-bakery-900">SHARAD</strong>! Confidential real-time records of all customer bookings, UPI payments, and earnings.
          </p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex bg-white/80 p-1.5 rounded-2xl border border-bakery-200 shadow-xs text-xs font-bold gap-1 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-bakery-900 text-white shadow-xs'
                : 'text-bakery-700 hover:bg-amber-50'
            }`}
          >
            📋 Customer Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-bakery-900 text-white shadow-xs'
                : 'text-bakery-700 hover:bg-amber-50'
            }`}
          >
            📊 Products Sold vs Unsold
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'revenue'
                ? 'bg-bakery-900 text-white shadow-xs'
                : 'text-bakery-700 hover:bg-amber-50'
            }`}
          >
            💰 Revenue Breakdown
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Money Earned */}
        <div className="bg-gradient-to-br from-amber-500/20 via-amber-100/30 to-white/90 backdrop-blur-md rounded-3xl p-5 border-2 border-amber-300 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-bakery-700 uppercase tracking-wider">Total Money Earned</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#d97706] flex items-center justify-center font-bold">
              $
            </div>
          </div>
          <h3 className="text-3xl font-black text-bakery-900 tracking-tight mb-1">
            ${metrics.totalRevenue.toFixed(2)}
          </h3>
          <p className="text-[11px] text-green-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> All validated customer purchases
          </p>
        </div>

        {/* Total Products Sold */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-bakery-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-bakery-700 uppercase tracking-wider">Total Products Sold</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-bakery-900 tracking-tight mb-1">
            {metrics.totalItemsSold} <span className="text-lg font-bold text-gray-500">items</span>
          </h3>
          <p className="text-[11px] text-gray-500 font-medium">
            Across {metrics.soldProductsCount} unique menu items
          </p>
        </div>

        {/* Products Catalog Status */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-bakery-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-bakery-700 uppercase tracking-wider">Catalog Performance</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-green-700">{metrics.soldProductsCount} Sold</span>
            <span className="text-sm font-semibold text-gray-400">/ {metrics.unsoldProductsCount} Unsold</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Total {metrics.totalProductsCatalogCount} bakery products
          </p>
        </div>

        {/* Active Orders Status */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-bakery-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-bakery-700 uppercase tracking-wider">Kitchen Queue</span>
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-bakery-900 tracking-tight mb-1">
            {metrics.pendingCount + metrics.bakingCount + metrics.outForDeliveryCount} <span className="text-lg font-bold text-gray-500">active</span>
          </h3>
          <p className="text-[11px] text-green-600 font-bold">
            {metrics.deliveredCount} orders successfully delivered
          </p>
        </div>
      </div>

      {/* TAB 1: PRODUCT SALES PERFORMANCE (Sold vs Not Sold) */}
      {activeTab === 'sales' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-bakery-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-bakery-900">Product Sales Breakdown</h2>
              <p className="text-xs text-bakery-600">Track which bakery treats are selling, sales volume, and total money generated.</p>
            </div>

            {/* Filter Toggle: All vs Sold vs Unsold */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-bakery-100/80 p-1 rounded-2xl text-xs font-bold">
                <button
                  onClick={() => setProductFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    productFilter === 'all' ? 'bg-white text-bakery-900 shadow-xs' : 'text-bakery-700 hover:text-bakery-900'
                  }`}
                >
                  All (144)
                </button>
                <button
                  onClick={() => setProductFilter('sold')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                    productFilter === 'sold' ? 'bg-green-600 text-white shadow-xs' : 'text-green-800 hover:text-green-900'
                  }`}
                >
                  <span>✓ Sold ({metrics.soldProductsCount})</span>
                </button>
                <button
                  onClick={() => setProductFilter('unsold')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    productFilter === 'unsold' ? 'bg-gray-800 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Not Sold Yet ({metrics.unsoldProductsCount})
                </button>
              </div>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name..."
                className="w-full bg-bakery-50/70 border border-bakery-200 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-[#d97706]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-bakery-50/70 border border-bakery-200 rounded-xl px-3 py-2 text-xs font-bold text-bakery-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Cakes">🎂 Cakes</option>
              <option value="Pastries">🍰 Pastries</option>
              <option value="Bread">🍞 Bread</option>
              <option value="Cookies">🍪 Cookies</option>
              <option value="Muffins">🧁 Muffins</option>
              <option value="Beverages">☕ Beverages</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-bakery-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bakery-100/60 text-bakery-800 border-b border-bakery-200/60 font-bold">
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Unit Price</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Units Sold</th>
                  <th className="p-3.5 text-right">Total Money Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bakery-100/60">
                {filteredProducts.slice(0, 40).map((prod) => (
                  <tr key={prod.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5 flex items-center space-x-3">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-10 h-10 rounded-xl object-cover border border-bakery-200 shadow-xs shrink-0" 
                      />
                      <div>
                        <p className="font-bold text-bakery-900 text-xs">{prod.name}</p>
                        {prod.tag && <span className="text-[10px] text-amber-700 font-semibold">{prod.tag}</span>}
                      </div>
                    </td>
                    <td className="p-3.5 text-bakery-700 font-medium">{prod.category}</td>
                    <td className="p-3.5 font-bold text-bakery-900">${prod.price.toFixed(2)}</td>
                    <td className="p-3.5">
                      {prod.isSold ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-extrabold px-2.5 py-0.5 rounded-full border border-green-200 text-[11px]">
                          ✓ Sold
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full border border-gray-200 text-[10px]">
                          Not Sold Yet
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-extrabold text-sm text-bakery-900">
                      {prod.unitsSold > 0 ? (
                        <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                          {prod.unitsSold} units
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-black text-sm">
                      {prod.revenueEarned > 0 ? (
                        <span className="text-green-700">${prod.revenueEarned.toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400">$0.00</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length > 40 && (
            <p className="text-center text-xs text-gray-500 mt-4">
              Showing top 40 of {filteredProducts.length} matching products. Use the category or search filters above to explore all 144 items.
            </p>
          )}
        </div>
      )}

      {/* TAB 2: LIVE KITCHEN & CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-bakery-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-bakery-900">
                📋 Customer Booking & Order History (Private to SHARAD)
              </h2>
              <p className="text-xs text-bakery-600">
                All customer bookings, customer names, addresses, and UPI/Card payments are recorded here. Only Owner (SHARAD) can view this history.
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-bakery-50 p-1 rounded-xl border border-bakery-200 text-xs font-semibold">
              {['all', 'Pending', 'Baking', 'Out for Delivery', 'Delivered'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg transition-all capitalize ${
                    orderStatusFilter.toLowerCase() === st.toLowerCase()
                      ? 'bg-bakery-900 text-white font-bold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white/90 border border-bakery-200/80 rounded-2xl p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col md:flex-row justify-between gap-4"
              >
                {/* Left: Customer & Items */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono font-bold text-sm text-bakery-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      {order.id}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      {order.paymentMethod === 'UPI' ? <Smartphone className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                      Paid via {order.paymentMethod} {order.paymentDetails?.upiApp ? `(${order.paymentDetails.upiApp})` : ''}
                    </span>
                  </div>

                  <div className="text-xs text-bakery-800 mb-3">
                    <span className="font-bold">{order.customer.name}</span> • <span>{order.customer.phone}</span>
                    <p className="text-gray-500 mt-0.5 truncate">{order.customer.address}</p>
                  </div>

                  {/* Items pills */}
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-200 px-2 py-1 rounded-xl text-xs">
                        <img src={item.image} alt={item.name} className="w-6 h-6 rounded-md object-cover" />
                        <span className="font-bold text-bakery-900">{item.name}</span>
                        <span className="text-amber-800 font-extrabold">x{item.quantity || 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Total & Status Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-bakery-100 shrink-0">
                  <div className="md:text-right mb-2">
                    <span className="text-xs text-gray-400 block">Total Paid</span>
                    <span className="text-xl font-black text-[#d97706]">${order.total.toFixed(2)}</span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-gray-500">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : order.status === 'Baking'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : order.status === 'Out for Delivery'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Baking">In Oven / Baking</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REVENUE BREAKDOWN */}
      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Method Split */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-bakery-200/80 shadow-sm">
            <h3 className="text-base font-bold text-bakery-900 mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#d97706]" /> Payment Methods Revenue Split
            </h3>

            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-bakery-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" /> UPI Revenue (GPay, PhonePe, Paytm, QR)
                  </span>
                  <span className="text-lg font-black text-bakery-900">${metrics.upiRevenue.toFixed(2)}</span>
                </div>
                <div className="w-full bg-amber-200/60 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-[#d97706] h-full rounded-full"
                    style={{ width: `${(metrics.upiRevenue / (metrics.totalRevenue || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-bakery-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" /> Credit / Debit Card Revenue
                  </span>
                  <span className="text-lg font-black text-bakery-900">${metrics.cardRevenue.toFixed(2)}</span>
                </div>
                <div className="w-full bg-blue-200/60 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(metrics.cardRevenue / (metrics.totalRevenue || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary Notes */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-bakery-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-bakery-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" /> Owner Financial Summary
              </h3>
              <p className="text-xs text-bakery-600 mb-4 leading-relaxed">
                As the bakery owner, all customer checkouts via UPI and Credit Cards immediately add to your live revenue.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-bakery-50 rounded-xl">
                  <span className="text-gray-600">Total Orders Placed:</span>
                  <span className="font-bold text-bakery-900">{metrics.totalOrdersCount}</span>
                </div>
                <div className="flex justify-between p-2 bg-bakery-50 rounded-xl">
                  <span className="text-gray-600">Total Units Handcrafted:</span>
                  <span className="font-bold text-bakery-900">{metrics.totalItemsSold}</span>
                </div>
                <div className="flex justify-between p-2 bg-bakery-50 rounded-xl">
                  <span className="text-gray-600">Average Order Value:</span>
                  <span className="font-bold text-green-700">
                    ${(metrics.totalRevenue / (metrics.totalOrdersCount || 1)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-100/60 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              💡 Tip: Keep high inventory for top-selling cakes & pastries for weekend peak hours.
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
