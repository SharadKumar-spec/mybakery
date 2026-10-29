import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Smartphone, CreditCard, QrCode, CheckCircle2, 
  Lock, MapPin, Phone, User, Clock, ArrowRight, ArrowLeft, 
  ShieldCheck, Sparkles, Star, Tag, Award, Gift, Check, Flame 
} from 'lucide-react';
import { useOrders } from '../context/OrdersContext';

// Helper to provide 5 rich, distinct high-resolution photography angles for each product
const getGalleryPhotos = (product) => {
  if (!product) return [];
  const categoryGalleries = {
    Cakes: [
      product.image,
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80', // delicious sliced cross-section
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80', // frosting texture close-up
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80', // artisan topping detail
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80'  // luxury gift box packaging
    ],
    Pastries: [
      product.image,
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'
    ],
    Bread: [
      product.image,
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80'
    ],
    Cookies: [
      product.image,
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80'
    ],
    Muffins: [
      product.image,
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558303420-f814d8a590f5?auto=format&fit=crop&w=800&q=80'
    ],
    Beverages: [
      product.image,
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
    ]
  };
  return categoryGalleries[product.category] || [product.image];
};

export default function ProductBookingModal({ product, isOpen, onClose }) {
  const { createOrder } = useOrders();

  // 3-Page Flow: 1 = Quality & Photos, 2 = Delivery Details, 3 = Payment & Give Money, 'processing', 'receipt'
  const [page, setPage] = useState(1);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Page 1 Options: Size & Quantity
  const [selectedWeight, setSelectedWeight] = useState('500g'); // '500g' | '1kg' | '2kg'
  const [quantity, setQuantity] = useState(1);
  const [isEggless, setIsEggless] = useState(true);

  // Page 2 Options: Delivery & Custom Message
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerAddress, setCustomerAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bangalore');
  const [cakeMessage, setCakeMessage] = useState('Happy Celebration!');
  const [includeCandles, setIncludeCandles] = useState(true);
  const [deliverySlot, setDeliverySlot] = useState('express'); // 'express' | 'evening' | 'morning'

  // Page 3 Options: Payment & Give Money
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'bhim'
  const [upiMode, setUpiMode] = useState('id'); // 'id' | 'qr'
  const [upiId, setUpiId] = useState('customer@okaxis');
  
  // Card inputs
  const [cardNumber, setCardNumber] = useState('4532 8921 4091 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardName, setCardName] = useState('');

  // Processing simulation state
  const [processingStatus, setProcessingStatus] = useState('Connecting to Payment Gateway...');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Reset photo index when product changes
  useEffect(() => {
    setSelectedPhotoIndex(0);
    setPage(1);
  }, [product]);

  if (!isOpen || !product) return null;

  const galleryPhotos = getGalleryPhotos(product);
  const currentPhoto = galleryPhotos[selectedPhotoIndex] || product.image;

  // Weight multiplier
  const weightMultiplier = selectedWeight === '1kg' ? 1.8 : selectedWeight === '2kg' ? 3.4 : 1.0;
  const originalBasePrice = product.price * weightMultiplier * quantity;
  // 15% promotional discount
  const discountAmount = originalBasePrice * 0.15;
  const discountedSubtotal = originalBasePrice - discountAmount;
  const tax = discountedSubtotal * 0.05;
  const finalTotal = discountedSubtotal + tax;

  // Give the money and complete purchase
  const handleGiveMoneyAndPay = (e) => {
    e.preventDefault();
    setPage('processing');
    setProcessingStatus(`Connecting to ${paymentMethod === 'UPI' ? selectedUpiApp.toUpperCase() : 'Card Bank Gateway'}...`);

    setTimeout(() => {
      if (paymentMethod === 'UPI') {
        setProcessingStatus(`Request of $${finalTotal.toFixed(2)} sent to ${selectedUpiApp.toUpperCase()}. Authorizing payment...`);
      } else {
        setProcessingStatus('Verifying 3D Secure OTP & Card details with bank...');
      }
    }, 1200);

    setTimeout(() => {
      setProcessingStatus('Payment Authorized & Money Received! Sending order to Head Baker SHARAD...');
    }, 2400);

    setTimeout(() => {
      const order = createOrder({
        customer: {
          name: customerName || 'Valued Customer',
          email: 'customer@vatika.com',
          phone: customerPhone,
          address: customerAddress
        },
        items: [
          {
            id: product.id,
            name: `${product.name} (${selectedWeight}${isEggless ? ', Eggless' : ''})`,
            category: product.category,
            price: product.price * weightMultiplier,
            quantity: quantity,
            image: product.image
          }
        ],
        subtotal: discountedSubtotal,
        tax,
        deliveryFee: 0,
        total: finalTotal,
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
        notes: `Cake Message: "${cakeMessage}" • Delivery Slot: ${deliverySlot}`
      });

      setPlacedOrder(order);
      setPage('receipt');
    }, 3600);
  };

  const handleClose = () => {
    setPage(1);
    setSelectedPhotoIndex(0);
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[270] flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl border border-bakery-200 max-w-2xl w-full overflow-hidden my-auto relative flex flex-col"
      >
        {/* Top Header & 3-Step Breadcrumbs */}
        <div className="bg-gradient-to-r from-bakery-950 via-bakery-900 to-[#d97706] text-white p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-extrabold text-xs uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                {product.category} Showcase
              </span>
              <span className="text-xs text-gray-300 font-semibold hidden sm:inline">
                Head Baker SHARAD Kitchen
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 3-Step Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-black/30 p-1 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => page !== 'processing' && page !== 'receipt' && setPage(1)}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                page === 1 
                  ? 'bg-amber-500 text-bakery-950 font-black shadow-sm' 
                  : (page === 2 || page === 3 || page === 'receipt') 
                  ? 'bg-white/15 text-white' 
                  : 'text-gray-400'
              }`}
            >
              <span>1. Quality & Pics</span>
              {page > 1 && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => page !== 'processing' && page !== 'receipt' && setPage(2)}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                page === 2 
                  ? 'bg-amber-500 text-bakery-950 font-black shadow-sm' 
                  : (page === 3 || page === 'receipt') 
                  ? 'bg-white/15 text-white' 
                  : 'text-gray-400'
              }`}
            >
              <span>2. Delivery Info</span>
              {page === 3 && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => page !== 'processing' && page !== 'receipt' && setPage(3)}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                page === 3 
                  ? 'bg-amber-500 text-bakery-950 font-black shadow-sm' 
                  : page === 'receipt'
                  ? 'bg-white/15 text-white'
                  : 'text-gray-400'
              }`}
            >
              <span>3. Pay Money (UPI)</span>
              {page === 'receipt' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PAGE 1: Product Showcase, Multiple Photos, Quality & Offers */}
        {/* ============================================================ */}
        {page === 1 && (
          <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
            {/* Main Picture with smooth transition */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-amber-50 border border-amber-200 shadow-sm mb-3 group">
              <img 
                src={currentPhoto} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-bakery-900/90 text-amber-300 text-xs font-black px-3 py-1 rounded-full backdrop-blur-sm shadow-md">
                ⭐ Photo {selectedPhotoIndex + 1} of {galleryPhotos.length}
              </span>
              <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Check className="w-3 h-3" /> Freshly Baked
              </span>
            </div>

            {/* Multiple Photo Thumbnails Gallery */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-bakery-900">
                  📷 See Product Photos ({galleryPhotos.length} HD Angles)
                </span>
                <span className="text-[11px] text-gray-500">Click any thumbnail to inspect</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {galleryPhotos.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative rounded-xl overflow-hidden h-14 sm:h-16 border-2 transition-all cursor-pointer ${
                      selectedPhotoIndex === idx 
                        ? 'border-[#d97706] ring-2 ring-[#d97706]/30 shadow-md scale-102' 
                        : 'border-amber-200/80 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Title & Review */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-bakery-900 leading-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-bakery-600 mt-1 leading-relaxed">
                  {product.description || 'Artisanal handcrafted delicacy prepared with signature Belgian ingredients.'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end text-amber-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Bakery Quality Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-center">
                <Award className="w-4 h-4 text-[#d97706] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-bakery-900 block">100% Handcrafted</span>
                <span className="text-[10px] text-gray-500">By Chef SHARAD</span>
              </div>
              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-center">
                <Sparkles className="w-4 h-4 text-[#d97706] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-bakery-900 block">Pure Butter</span>
                <span className="text-[10px] text-gray-500">No Preservatives</span>
              </div>
              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-center">
                <Clock className="w-4 h-4 text-[#d97706] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-bakery-900 block">Baked Fresh</span>
                <span className="text-[10px] text-gray-500">Today's Batch</span>
              </div>
              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-center">
                <ShieldCheck className="w-4 h-4 text-green-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-bakery-900 block">Eggless Option</span>
                <span className="text-[10px] text-green-700">Available</span>
              </div>
            </div>

            {/* Special Offers & Discount Banner */}
            <div className="bg-gradient-to-r from-amber-500/15 via-amber-100/50 to-orange-100/40 p-4 rounded-2xl border-2 border-amber-300 mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Flame className="w-4 h-4 text-orange-600 fill-orange-600" /> Exclusive Bakery Deal
                </span>
                <span className="text-[11px] font-black bg-orange-600 text-white px-2 py-0.5 rounded-full">
                  15% OFF
                </span>
              </div>
              <p className="text-xs text-bakery-800 font-medium">
                Flat 15% discount applied automatically! Plus complimentary luxury bakery packaging & free delivery.
              </p>
            </div>

            {/* Size / Weight Selector & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <label className="text-xs font-bold text-bakery-900 block mb-2">Select Cake Weight / Size</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                  {[
                    { id: '500g', label: '500g', sub: 'Serves 4' },
                    { id: '1kg', label: '1.0 kg', sub: 'Serves 8' },
                    { id: '2kg', label: '2.0 kg', sub: 'Party' }
                  ].map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelectedWeight(w.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedWeight === w.id 
                          ? 'bg-[#d97706] text-white border-[#d97706] shadow-sm' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                      }`}
                    >
                      <span className="block font-black text-xs">{w.label}</span>
                      <span className="block text-[9px] opacity-80">{w.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-bakery-900 block mb-2">Quantity</label>
                <div className="flex items-center bg-white rounded-xl border border-gray-300 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-bakery-900 hover:bg-gray-100 rounded-lg font-bold text-base cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-black text-sm text-bakery-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-bakery-900 hover:bg-gray-100 rounded-lg font-bold text-base cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price Preview & First Page Click Button */}
            <div className="pt-3 border-t border-bakery-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">${originalBasePrice.toFixed(2)}</span>
                  <span className="text-2xl font-black text-[#d97706]">${discountedSubtotal.toFixed(2)}</span>
                  <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">Save 15%</span>
                </div>
                <span className="text-[11px] text-gray-500">Includes free cutlery & gift box</span>
              </div>

              <button
                type="button"
                onClick={() => setPage(2)}
                className="w-full sm:w-auto bg-gradient-to-r from-bakery-900 via-[#b45309] to-[#d97706] hover:from-[#d97706] hover:to-amber-600 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Proceed to Step 2: Delivery Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PAGE 2: Delivery Address, Message on Cake & Time Slot */}
        {/* ============================================================ */}
        {page === 2 && (
          <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-black text-bakery-900">Step 2: Delivery & Customization</h3>
              <p className="text-xs text-bakery-600">Provide your address and message for {product.name} ({selectedWeight}).</p>
            </div>

            {/* Contact & Address Inputs */}
            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-bakery-800 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full bg-bakery-50/80 border border-bakery-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-bakery-800 block mb-1">Phone Number (For Delivery Call)</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 Phone"
                    className="w-full bg-bakery-50/80 border border-bakery-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-bakery-800 block mb-1">Full Delivery Address</label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Flat/House No, Building, Street, Area, City"
                  className="w-full bg-bakery-50/80 border border-bakery-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                />
              </div>

              {/* Message on Cake */}
              <div>
                <label className="text-xs font-bold text-bakery-800 block mb-1">Message on Cake (Complimentary Piping)</label>
                <input
                  type="text"
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday Sharad!"
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-xl px-3 py-2 text-xs font-semibold text-bakery-900 focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                />
              </div>
            </div>

            {/* Delivery Time Slot */}
            <div className="mb-5">
              <label className="text-xs font-bold text-bakery-900 block mb-2">Select Delivery Time Slot</label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {[
                  { id: 'express', title: '⚡ Express', desc: '30-40 Mins' },
                  { id: 'evening', title: '🌆 Evening', desc: '6:00 - 8:00 PM' },
                  { id: 'morning', title: '🌅 Tomorrow', desc: '9:00 - 11:00 AM' }
                ].map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setDeliverySlot(slot.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      deliverySlot === slot.id
                        ? 'border-[#d97706] bg-amber-50 text-bakery-900 ring-2 ring-[#d97706]/30'
                        : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="block">{slot.title}</span>
                    <span className="block text-[10px] text-gray-500 font-normal">{slot.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Preview Box */}
            <div className="bg-bakery-50/80 border border-bakery-200 rounded-2xl p-3.5 mb-6 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-bakery-900">{product.name}</p>
                <p className="text-[11px] text-gray-500">Weight: {selectedWeight} • Qty: {quantity} • Message: "{cakeMessage}"</p>
              </div>
              <span className="font-black text-base text-[#d97706]">${discountedSubtotal.toFixed(2)}</span>
            </div>

            {/* Navigation Buttons for Page 2 */}
            <div className="pt-3 border-t border-bakery-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPage(1)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Photos</span>
              </button>

              <button
                type="button"
                onClick={() => setPage(3)}
                className="flex-1 bg-gradient-to-r from-bakery-900 to-[#d97706] hover:from-[#d97706] hover:to-amber-600 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Proceed to Step 3: Choose Payment & Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PAGE 3: Choose Payment Option (UPI / Card) & Give the Money */}
        {/* ============================================================ */}
        {page === 3 && (
          <form onSubmit={handleGiveMoneyAndPay} className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-black text-bakery-900">Step 3: Choose Payment Option & Give Money</h3>
              <p className="text-xs text-bakery-600">Select your preferred payment channel to complete your order booking.</p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-bold text-xs transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-[#d97706] bg-amber-50 text-bakery-900 shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                <Smartphone className="w-5 h-5 text-[#d97706]" />
                <div className="text-left">
                  <span className="block font-black">UPI Payment</span>
                  <span className="block text-[10px] text-green-700 font-bold">GPay / PhonePe / QR</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-bold text-xs transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'border-[#d97706] bg-amber-50 text-bakery-900 shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#d97706]" />
                <div className="text-left">
                  <span className="block font-black">Credit / Debit Card</span>
                  <span className="block text-[10px] text-gray-500 font-bold">Visa / Master / RuPay</span>
                </div>
              </button>
            </div>

            {/* UPI Form */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-bakery-900">Choose UPI App</span>
                  <div className="flex bg-white rounded-lg p-0.5 border border-amber-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setUpiMode('id')}
                      className={`px-2.5 py-1 rounded cursor-pointer ${upiMode === 'id' ? 'bg-[#d97706] text-white' : 'text-gray-600'}`}
                    >
                      UPI ID
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiMode('qr')}
                      className={`px-2.5 py-1 rounded cursor-pointer ${upiMode === 'qr' ? 'bg-[#d97706] text-white' : 'text-gray-600'}`}
                    >
                      Scan QR
                    </button>
                  </div>
                </div>

                {/* 4 App buttons */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { id: 'gpay', name: 'Google Pay', label: '🔵 Google Pay' },
                    { id: 'phonepe', name: 'PhonePe', label: '🟣 PhonePe' },
                    { id: 'paytm', name: 'Paytm', label: '🔷 Paytm' },
                    { id: 'bhim', name: 'BHIM UPI', label: '🟠 BHIM UPI' }
                  ].map(app => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        selectedUpiApp === app.id
                          ? 'border-[#d97706] bg-white text-bakery-900 shadow-xs ring-2 ring-[#d97706]/30'
                          : 'border-amber-200 bg-white/70 text-gray-700 hover:bg-white'
                      }`}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>

                {upiMode === 'id' ? (
                  <div>
                    <label className="text-xs font-bold text-bakery-800 block mb-1">Enter UPI ID / VPA</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                        placeholder="e.g. mobile@upi or name@okaxis"
                      />
                      <span className="inline-flex items-center px-2.5 bg-green-100 text-green-800 text-[11px] font-bold rounded-xl border border-green-200">
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2">
                    <div className="w-36 h-36 bg-bakery-900 text-white rounded-2xl flex flex-col items-center justify-center p-2 mb-1 shadow-md">
                      <QrCode className="w-24 h-24 text-white" />
                      <span className="text-[10px] font-black text-amber-300">SCAN & PAY ${finalTotal.toFixed(2)}</span>
                    </div>
                    <span className="text-xs font-bold text-bakery-900">Merchant: Vatika Bakery (Owner: SHARAD)</span>
                    <span className="text-[11px] text-gray-500">Scan using any UPI App (GPay, PhonePe, Paytm)</span>
                  </div>
                )}
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === 'Card' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl mb-5 space-y-3 text-xs">
                <div>
                  <label className="text-xs font-bold text-bakery-800 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName || customerName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-bakery-800 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• 4242"
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-bakery-800 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-bakery-800 block mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Money Calculation Breakdown */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-5 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Base Price ({selectedWeight} x {quantity})</span>
                <span>${originalBasePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-700 font-bold">
                <span>15% Special Deal Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Bakery GST (5%)</span>
                <span>+${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Express Delivery Fee</span>
                <span className="text-green-700 font-extrabold">FREE</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-300 text-base font-black text-bakery-900">
                <span>Final Money to Pay</span>
                <span className="text-2xl text-[#d97706]">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Final Pay / Give Money Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPage(2)}
                className="flex items-center gap-1.5 px-4 py-3.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-bakery-900 via-[#b45309] to-[#d97706] hover:from-[#d97706] hover:to-amber-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ${finalTotal.toFixed(2)} via {paymentMethod === 'UPI' ? 'UPI' : 'Card'}</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* PROCESSING ANIMATION */}
        {/* ============================================================ */}
        {page === 'processing' && (
          <div className="p-8 text-center flex flex-col items-center justify-center py-16">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-50"></div>
              <div className="w-20 h-20 rounded-full border-4 border-t-[#d97706] border-amber-200 animate-spin flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#d97706]" />
              </div>
            </div>

            <h3 className="text-xl font-black text-bakery-900 mb-1">
              Processing Payment of ${finalTotal.toFixed(2)}
            </h3>
            <p className="text-xs text-bakery-600 mb-6 font-medium animate-pulse">{processingStatus}</p>

            <div className="w-64 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#d97706] h-full rounded-full animate-[progress_3s_ease-in-out]"></div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUCCESS RECEIPT */}
        {/* ============================================================ */}
        {page === 'receipt' && placedOrder && (
          <div className="p-6 sm:p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 mb-2">
              Payment Successful & Money Received
            </span>
            <h3 className="text-2xl font-black text-bakery-900 mb-1">Order Confirmed!</h3>
            <p className="text-xs text-bakery-600 mb-5">
              Thank you! Your treat is registered and being baked by <strong>Head Baker SHARAD</strong>.
            </p>

            {/* Receipt details */}
            <div className="bg-bakery-50/90 border border-bakery-200 rounded-2xl p-4 w-full text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-bakery-200">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-mono font-bold text-bakery-900">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Product:</span>
                <span className="font-bold text-bakery-900">{product.name} ({selectedWeight} x {quantity})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-black text-sm text-[#d97706]">${placedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Via:</span>
                <span className="font-bold text-bakery-800">{placedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Message on Cake:</span>
                <span className="font-bold text-amber-900">"{cakeMessage}"</span>
              </div>
              <div className="flex justify-between items-start pt-1 border-t border-bakery-100">
                <span className="text-gray-500">Deliver To:</span>
                <span className="font-semibold text-bakery-900 max-w-[220px] text-right truncate">{placedOrder.customer.address}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer text-xs"
            >
              Done / Continue Shopping
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
