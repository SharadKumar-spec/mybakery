import React from 'react';
import { 
  ShoppingBag, ChevronRight, Shield, Plus, Minus, 
  Trash2, TrendingUp, Smartphone, CreditCard, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';

export default function RightSidebar({ onOpenDashboard }) {
  const { isOwner, openLogin } = useAuth();
  const { cartItems, totalCount, totalPrice, updateQuantity, removeFromCart, openCheckout } = useCart();
  const { metrics } = useOrders();

  return (
    <div className="w-full flex flex-col space-y-6">
      
      {/* Live Shopping Cart */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white/60 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-bakery-900 text-base flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2 text-[#d97706]" /> My Cart
            </h3>
            <span className="bg-[#fef3c7] text-[#d97706] text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-[#fde68a]">
              {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium text-bakery-600">Your cart is empty</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Click any product to book or add cakes & pastries!</p>
            </div>
          ) : (
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1 no-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2.5 bg-white/70 rounded-2xl border border-bakery-100">
                  <div className="flex items-center space-x-2.5">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-10 w-10 rounded-xl object-cover shadow-xs border border-amber-100" 
                    />
                    <div className="max-w-[110px]">
                      <p className="font-bold text-bakery-900 text-xs truncate" title={item.name}>{item.name}</p>
                      <p className="text-[11px] font-semibold text-[#d97706]">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center bg-bakery-50 rounded-lg border border-bakery-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-bakery-200 rounded text-bakery-700 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1.5 min-w-[18px] text-center text-bakery-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-bakery-200 rounded text-bakery-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="pt-3 border-t border-bakery-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-600">Total Order Amount</span>
              <span className="text-base font-extrabold text-bakery-900">${totalPrice.toFixed(2)}</span>
            </div>

            <button 
              onClick={openCheckout}
              className="w-full bg-gradient-to-r from-bakery-900 via-[#b45309] to-[#d97706] text-white py-3 rounded-xl text-xs font-extrabold hover:opacity-95 transition-opacity shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-1.5">Pay with Google Pay, PhonePe, Paytm or Card</p>
          </div>
        )}
      </div>

      {/* Customer Quick Info: Fast UPI Payment */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-white/90 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-amber-200/80">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-4 h-4 text-[#d97706]" />
          <h4 className="font-bold text-bakery-900 text-xs uppercase tracking-wide">Instant UPI & Online Payment</h4>
        </div>
        <p className="text-xs text-bakery-700 leading-relaxed mb-3">
          Book any product in 1-click and give payment via <strong>UPI (GPay, PhonePe, Paytm, QR)</strong> or <strong>Card</strong>.
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-bakery-800 border border-amber-200">GPay</span>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-bakery-800 border border-amber-200">PhonePe</span>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-bakery-800 border border-amber-200">Paytm</span>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-bakery-800 border border-amber-200">Cards</span>
        </div>
      </div>

      {/* Owner Revenue & Customer History Widget (Visible ONLY to Owner SHARAD) */}
      {isOwner && (
        <div className="bg-gradient-to-br from-amber-500/20 via-amber-100/50 to-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border-2 border-amber-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#d97706]" /> Owner Portal • SHARAD
            </span>
            <span className="text-[11px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full border border-green-200">
              ● Live Revenue
            </span>
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-bakery-600 font-medium">Total Bakery Earnings</p>
            <p className="text-3xl font-black text-bakery-900 tracking-tight">
              ${metrics.totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-amber-200/80 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
              <span className="text-gray-500 block text-[11px]">Units Sold</span>
              <span className="font-extrabold text-bakery-900 text-sm">{metrics.totalItemsSold} items</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
              <span className="text-gray-500 block text-[11px]">Items Catalog</span>
              <span className="font-extrabold text-green-700 text-sm">{metrics.soldProductsCount} of {metrics.totalProductsCatalogCount}</span>
            </div>
          </div>

          <button
            onClick={() => onOpenDashboard && onOpenDashboard()}
            className="w-full mt-4 bg-bakery-900 hover:bg-bakery-800 text-white text-xs font-bold py-3 px-3 rounded-xl shadow transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Customer Booking History</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
