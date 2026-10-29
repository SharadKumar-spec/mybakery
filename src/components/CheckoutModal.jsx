import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, CreditCard, Smartphone, QrCode, 
  CheckCircle2, ArrowRight, Lock, MapPin, Phone, User, 
  Clock, Sparkles, AlertCircle, Mail, Key, UserCheck, ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, cartItems, subtotal, tax, deliveryFee, totalPrice, clearCart } = useCart();
  const { user, isOwner, loginAs, loginWithCredentials } = useAuth();
  const { createOrder } = useOrders();

  // Navigation state: 1 = Details & Payment, 'auth' = Customer Login, 2 = Processing, 3 = Success
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'bhim'
  const [upiMode, setUpiMode] = useState('id'); // 'id' | 'qr'
  const [upiId, setUpiId] = useState('customer@okaxis');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('4532 8921 4091 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardName, setCardName] = useState(user?.name || '');

  // Address state
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');
  const [customerAddress, setCustomerAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bangalore');
  const [notes, setNotes] = useState('Please handle cake with care!');

  // Inline Customer Auth state (for customers logging in at checkout)
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // Processing simulation state
  const [processingStatus, setProcessingStatus] = useState('Connecting to Payment Gateway...');
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Sync user profile if user logs in
  useEffect(() => {
    if (user) {
      if (user.name) {
        setCustomerName(user.name);
        setCardName(user.name);
      }
      if (user.phone) {
        setCustomerPhone(user.phone);
      }
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  // Execute payment and create order
  const executePayment = (payerName, payerEmail, payerPhone) => {
    const finalName = payerName || customerName || 'Valued Customer';
    const finalEmail = payerEmail || user?.email || 'customer@vatika.com';
    const finalPhone = payerPhone || customerPhone || '+91 98765 43210';

    setActiveCustomer({ name: finalName, email: finalEmail, phone: finalPhone });
    setStep(2);
    setProcessingStatus(`Initiating secure payment request for ${finalName}...`);

    setTimeout(() => {
      if (paymentMethod === 'UPI') {
        setProcessingStatus(`Payment request sent to ${selectedUpiApp.toUpperCase()}. Approving UPI transfer...`);
      } else {
        setProcessingStatus('Verifying 3D Secure OTP & Card details with bank...');
      }
    }, 1200);

    setTimeout(() => {
      setProcessingStatus('Payment Authorized! Confirming order with Vatika Bakery kitchen...');
    }, 2400);

    setTimeout(() => {
      const order = createOrder({
        customer: {
          name: finalName,
          email: finalEmail,
          phone: finalPhone,
          address: customerAddress
        },
        items: [...cartItems],
        subtotal,
        tax,
        deliveryFee,
        total: totalPrice,
        paymentMethod: paymentMethod === 'UPI' ? 'UPI' : 'Credit Card',
        paymentDetails: paymentMethod === 'UPI' ? {
          upiApp: selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'paytm' ? 'Paytm' : 'BHIM UPI',
          upiId: upiId,
          transactionId: `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`
        } : {
          cardBrand: 'Visa',
          last4: cardNumber.slice(-4),
          transactionId: `CARD-${Math.floor(10000000 + Math.random() * 90000000)}`
        },
        notes
      });

      setPlacedOrder(order);
      clearCart();
      setStep(3);
    }, 3600);
  };

  // When customer clicks "Pay"
  const handleProceed = () => {
    executePayment(customerName || 'Customer', 'customer@vatika.com', customerPhone);
  };

  // 1-Click Fast Customer Login & Pay
  const handleFastCustomerLoginAndPay = () => {
    loginAs('customer');
    executePayment('Customer', 'customer@vatika.com', customerPhone || '+91 98765 43210');
  };

  // Credentials Login / Signup & Pay
  const handleCredentialsAuthAndPay = (e) => {
    e.preventDefault();
    const effectiveEmail = authEmail || 'customer@vatika.com';
    const effectiveName = authName || customerName || effectiveEmail.split('@')[0] || 'Customer';
    
    loginWithCredentials(effectiveEmail, authPassword || 'user123', 'customer', effectiveName);
    executePayment(effectiveName, effectiveEmail, customerPhone || '+91 98765 43210');
  };

  const handleClose = () => {
    setStep(1);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/65 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-bakery-200/80 max-w-2xl w-full overflow-hidden my-auto relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-bakery-900 via-bakery-800 to-[#d97706] text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-wider block">
              {step === 'auth' ? 'Customer Authentication' : 'Secure Checkout & Payment'}
            </span>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              Vatika Bakery Express
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* STEP 1: Details & Payment Method Selection */}
        {step === 1 && (
          <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
            
            {/* Checkout Header Notice */}
            <div className="mb-5 p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all bg-amber-50/80 border-amber-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4 text-[#d97706]" />
                </div>
                <div>
                  <span className="font-bold text-bakery-900 block">
                    Instant Booking & Payment
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Pay securely using Google Pay, PhonePe, Paytm, QR, or Card
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 font-bold border border-green-200 text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Secure
              </span>
            </div>

            {/* Delivery Address */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-bakery-900 uppercase tracking-wide flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#d97706]" /> 1. Delivery Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-bakery-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-bakery-50 border border-bakery-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-bakery-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-bakery-50 border border-bakery-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-bakery-700 block mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-bakery-50 border border-bakery-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  placeholder="Street, Apartment / House No, City"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-bakery-900 uppercase tracking-wide flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-[#d97706]" /> 2. Choose Payment Method
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-bold text-sm transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-[#d97706] bg-amber-50/80 text-bakery-900 shadow-sm'
                      : 'border-bakery-200 hover:border-bakery-300 text-bakery-600 bg-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#d97706]" />
                  <span>UPI Payment</span>
                  <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">FAST</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-bold text-sm transition-all cursor-pointer ${
                    paymentMethod === 'Card'
                      ? 'border-[#d97706] bg-amber-50/80 text-bakery-900 shadow-sm'
                      : 'border-bakery-200 hover:border-bakery-300 text-bakery-600 bg-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#d97706]" />
                  <span>Credit / Debit Card</span>
                </button>
              </div>

              {/* UPI Form */}
              {paymentMethod === 'UPI' && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-bakery-800">Select UPI App / Provider</span>
                    <div className="flex bg-white rounded-lg p-0.5 border border-amber-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setUpiMode('id')}
                        className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${upiMode === 'id' ? 'bg-[#d97706] text-white' : 'text-gray-600'}`}
                      >
                        UPI ID
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('qr')}
                        className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${upiMode === 'qr' ? 'bg-[#d97706] text-white' : 'text-gray-600'}`}
                      >
                        QR Code
                      </button>
                    </div>
                  </div>

                  {/* UPI App Icons */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🔵 GPay' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣 PhonePe' },
                      { id: 'paytm', name: 'Paytm', icon: '🔷 Paytm' },
                      { id: 'bhim', name: 'BHIM UPI', icon: '🟠 BHIM' }
                    ].map(app => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id)}
                        className={`p-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          selectedUpiApp === app.id
                            ? 'border-[#d97706] bg-white text-bakery-900 shadow-xs ring-2 ring-[#d97706]/30'
                            : 'border-amber-200/60 bg-white/70 text-gray-700 hover:bg-white'
                        }`}
                      >
                        {app.icon}
                      </button>
                    ))}
                  </div>

                  {upiMode === 'id' ? (
                    <div>
                      <label className="text-xs font-semibold text-bakery-800 block mb-1">Enter UPI ID / VPA</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                          placeholder="e.g. customer@okaxis or mobile@upi"
                        />
                        <span className="inline-flex items-center px-3 bg-green-100 text-green-800 text-xs font-bold rounded-xl border border-green-200">
                          ✓ Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Payment request will be dispatched to your {selectedUpiApp.toUpperCase()} app.</p>
                    </div>
                  ) : (
                    <div className="text-center py-2 flex flex-col items-center">
                      <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-amber-300 shadow-sm mb-2">
                        <div className="w-36 h-36 bg-bakery-900 text-white rounded-lg flex flex-col items-center justify-center relative p-2">
                          <QrCode className="w-28 h-28 text-white" />
                          <span className="text-[9px] font-bold text-amber-300">SCAN & PAY ${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-bakery-900">Merchant: Vatika Bakery (Owner: SHARAD)</p>
                      <p className="text-[11px] text-gray-500">Scan using any UPI App (Google Pay, PhonePe, Paytm)</p>
                    </div>
                  )}
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'Card' && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-bakery-800">Card Details (Visa / Mastercard / RuPay)</span>
                    <div className="flex gap-1.5">
                      <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">VISA</span>
                      <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded">Mastercard</span>
                      <span className="text-[10px] font-bold bg-green-700 text-white px-2 py-0.5 rounded">RuPay</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-bakery-700 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                        placeholder="Name on card"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-bakery-700 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-bakery-700 block mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-bakery-700 block mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                          placeholder="•••"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Cost Breakdown */}
            <div className="border-t border-bakery-200/80 pt-4 mb-5">
              <div className="flex justify-between text-xs text-bakery-700 mb-1">
                <span>Items Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-bakery-700 mb-1">
                <span>Bakery GST / Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-bakery-700 mb-2">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong className="text-green-600">FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-bakery-900 pt-2 border-t border-dashed border-bakery-200">
                <span>Grand Total to Pay</span>
                <span className="text-xl text-[#d97706]">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleProceed}
              className="w-full bg-gradient-to-r from-bakery-900 via-[#b45309] to-[#d97706] hover:from-[#d97706] hover:to-bakery-900 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Pay ${totalPrice.toFixed(2)} via {paymentMethod === 'UPI' ? 'UPI' : 'Card'} & Confirm Order</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> 256-Bit SSL Encrypted & Protected
            </p>
          </div>
        )}

        {/* STEP 'auth': Customer Login / Verification Required Before Completing Purchase */}
        {step === 'auth' && (
          <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
            {/* Header info */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-amber-100 text-[#d97706] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-200 shadow-sm">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-bakery-900">
                Customer Sign In Required
              </h3>
              <p className="text-xs text-bakery-600 mt-1 max-w-sm mx-auto">
                Please log in or create your customer account to authorize your <strong>{paymentMethod} payment</strong> of <strong className="text-[#d97706]">${totalPrice.toFixed(2)}</strong> and finalize your order.
              </p>
            </div>

            {/* FAST OPTION 1: 1-Click Fast Customer Login & Pay */}
            <div className="mb-6 p-4 bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#d97706]" /> Recommended Fast Checkout
                </span>
                <span className="text-[10px] font-extrabold bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">
                  Instant
                </span>
              </div>
              <p className="text-xs text-bakery-700 mb-3">
                Sign in with 1-click customer credentials and proceed directly to payment authorization.
              </p>
              <button
                type="button"
                onClick={handleFastCustomerLoginAndPay}
                className="w-full bg-gradient-to-r from-amber-600 to-[#d97706] hover:from-[#d97706] hover:to-amber-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>⚡ 1-Click Customer Sign In & Pay ${totalPrice.toFixed(2)}</span>
              </button>
            </div>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-bakery-200 w-full"></div>
              <span className="bg-white px-3 text-xs font-bold text-gray-400 uppercase">Or Sign In with Email</span>
              <div className="border-t border-bakery-200 w-full"></div>
            </div>

            {/* OPTION 2: Email Sign In / Registration Form */}
            <form onSubmit={handleCredentialsAuthAndPay} className="space-y-3">
              {/* Tab selector */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${authTab === 'login' ? 'bg-white text-bakery-900 shadow-xs' : 'text-gray-500'}`}
                >
                  Customer Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('signup')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${authTab === 'signup' ? 'bg-white text-bakery-900 shadow-xs' : 'text-gray-500'}`}
                >
                  New Customer Register
                </button>
              </div>

              {authTab === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-bakery-800 block mb-1">Your Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Sharad Customer"
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
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. customer@vatika.com"
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
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-bakery-50 border border-bakery-200 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  />
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-bakery-900 hover:bg-bakery-800 text-white font-bold py-3 rounded-xl shadow-md transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <span>{authTab === 'login' ? 'Sign In & Authorize Payment' : 'Register & Authorize Payment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Back button */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-4 text-xs font-semibold text-bakery-600 hover:text-bakery-900 flex items-center justify-center gap-1 py-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Delivery & Payment Method</span>
            </button>
          </div>
        )}

        {/* STEP 2: Processing Payment Animation */}
        {step === 2 && (
          <div className="p-10 text-center flex flex-col items-center justify-center py-16">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-50"></div>
              <div className="w-20 h-20 rounded-full border-4 border-t-[#d97706] border-amber-200 animate-spin flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#d97706]" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-bakery-900 mb-1">
              Processing Secure {paymentMethod} Payment
            </h3>
            {activeCustomer && (
              <p className="text-xs text-green-700 font-bold mb-2">
                ✓ Authenticated Customer: {activeCustomer.name} ({activeCustomer.email})
              </p>
            )}
            <p className="text-sm text-bakery-600 mb-6 font-medium animate-pulse">{processingStatus}</p>

            <div className="w-64 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#d97706] h-full rounded-full animate-[progress_3s_ease-in-out]"></div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Please do not close or refresh this window.</p>
          </div>
        )}

        {/* STEP 3: Order Placed Success */}
        {step === 3 && placedOrder && (
          <div className="p-6 sm:p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 mb-2">
              Payment Successful & Verified
            </span>
            <h3 className="text-2xl font-extrabold text-bakery-900 mb-1">Order Confirmed!</h3>
            <p className="text-sm text-bakery-600 mb-6">
              Thank you for ordering with Vatika Bakery! Our head baker <strong>SHARAD</strong> and kitchen team are already preparing your treats.
            </p>

            {/* Receipt Card */}
            <div className="bg-bakery-50/90 border border-bakery-200 rounded-2xl p-4 w-full text-left mb-6 text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-bakery-200">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-mono font-bold text-bakery-900">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Customer Account:</span>
                <span className="font-bold text-bakery-900">{placedOrder.customer.name} ({placedOrder.customer.email})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Paid Amount:</span>
                <span className="font-extrabold text-sm text-[#d97706]">${placedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Channel:</span>
                <span className="font-bold text-bakery-800">
                  {placedOrder.paymentMethod} ({placedOrder.paymentDetails?.upiApp || 'Card'})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Estimated Delivery:</span>
                <span className="font-semibold text-green-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 30-40 Minutes
                </span>
              </div>
              <div className="flex justify-between items-start pt-1">
                <span className="text-gray-500">Deliver To:</span>
                <span className="font-medium text-bakery-900 text-right max-w-[220px] truncate">{placedOrder.customer.address}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Continue Shopping / Track Order
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
