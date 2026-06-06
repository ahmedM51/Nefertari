import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, ArrowLeft, Trash2, Mail, Phone, MapPin, User, ShieldCheck, AlertCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

interface CartPageProps {
  onSetView: (view: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onSetView }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, placeOrder, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { t, language } = useTranslation();

  // Checkout inputs
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [checkoutStatus, setCheckoutStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setCheckoutStatus({ 
        type: 'error', 
        text: language === 'ar' 
          ? 'يجب تسجيل الدخول لإتمام عملية شراء الطرود التراثية المعتمدة.' 
          : 'You must log in to commit heritage e-commerce checkouts. Please toggle your user role in the header panel.' 
      });
      return;
    }

    if (!customerName || !phone || !address) {
      setCheckoutStatus({ 
        type: 'error', 
        text: language === 'ar' 
          ? 'يرجى كتابة الاسم، رقم التواصل، وعنوان الشحن بالكامل.' 
          : 'Please complete all customer name, shipping address, and phone inputs.' 
      });
      return;
    }

    setIsSubmitting(true);
    setCheckoutStatus(null);

    const result = await placeOrder({
      customer_name: customerName,
      phone: phone,
      shipping_address: address
    });

    if (result.success) {
      setCheckoutStatus({ 
        type: 'success', 
        text: language === 'ar'
          ? `تم تسجيل طلبك لتوصيل التحف بنجاح! المعرف: ${result.orderId}. يمكنك تتبع حالة الشحنة من لوحة تحكم السائح.`
          : `Order successfully registered! Code: ${result.orderId}. Handcraft production queue initiated. Track fulfillment inside your User Profile.` 
      });
    } else {
      setCheckoutStatus({ type: 'error', text: result.error || 'Checkout process met a database issue.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div id="cart-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-300 font-sans">
      
      {/* Return button */}
      <button
        onClick={() => onSetView('store')}
        className="mb-8 inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#F3E5AB] font-semibold text-sm cursor-pointer transition-colors"
      >
        <ArrowLeft size={16} /> {t('continue_journey')}
      </button>

      <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white mb-10">
        {t('basket_title')}
      </h1>

      {cart.length === 0 ? (
        <div className="bg-[#121212] border border-[#D4AF37]/25 rounded-3xl p-16 text-center max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto border border-[#D4AF37]/20">
            <ShoppingCart size={32} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">{language === 'ar' ? 'العربة فارغة حالياً' : 'Your basket is vacant'}</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('empty_basket_desc')}
          </p>
          <button
            onClick={() => onSetView('store')}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold uppercase text-xs tracking-wider transition-all cursor-pointer inline-block duration-200 font-sans"
          >
            {t('buy_handcrafts')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column Item lists (7 of 12) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-serif font-bold text-white pb-2 border-b border-[#D4AF37]/20">
              {language === 'ar' ? 'محتويات القائمة' : 'Basket Items'} ({cart.length})
            </h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-[#121212] border border-[#D4AF37]/15 rounded-2xl p-4 flex gap-4 items-center justify-between font-sans"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-[#D4AF37]/15">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>

                  {/* Descriptions */}
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-serif text-sm font-bold text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs font-mono text-[#D4AF37] font-semibold mt-1">${item.price} USD</p>
                  </div>

                  {/* Quantity manager */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#D4AF37]/25 rounded-lg bg-black overflow-hidden text-xs">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-300 hover:bg-[#D4AF37]/10 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-300 hover:bg-[#D4AF37]/10 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      id={`delete-basket-item-${item.product_id}`}
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-2 rounded bg-rose-500/10 text-rose-450 hover:bg-rose-500/20 transition-all cursor-pointer border border-rose-500/25"
                      title="Remove product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center bg-black border border-[#D4AF37]/20 p-4 rounded-xl text-xs font-mono select-none">
              <span className="text-gray-400">{language === 'ar' ? 'حالة مقتنيات السلة:' : 'Shopping Cart Status:'}</span>
              <button 
                onClick={clearCart}
                className="text-gray-455 hover:text-rose-400 underline font-bold cursor-pointer"
              >
                {language === 'ar' ? 'إفراغ السلة بالكامل' : 'Flush All Items'}
              </button>
            </div>
          </div>

          {/* Right Column Checkout Form and Receipt (5 of 12) */}
          <div className="lg:col-span-5">
            <div className="bg-[#121212] border border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <h3 className="font-serif text-lg font-bold text-white pb-3 border-b border-[#D4AF37]/10">
                {t('checkout_summary')}
              </h3>

              {/* Receipt details */}
              <div className="space-y-2 text-xs sm:text-sm font-sans pb-4 border-b border-[#D4AF37]/10">
                <div className="flex justify-between text-gray-400">
                  <span>{language === 'ar' ? 'إجمالي القطع بالتعداد:' : 'Subtotal quantity:'}</span>
                  <span className="font-mono font-semibold text-white">{cart.reduce((s, i) => s + i.quantity, 0)} {language === 'ar' ? 'تحفة' : 'Units'}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{t('shipping_cost')}:</span>
                  <span className="text-emerald-400 font-semibold uppercase font-mono">{t('free')}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-white pt-2">
                  <span>{t('total_price_usd')}:</span>
                  <span className="font-sans text-[#D4AF37] font-black">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Billing Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs sm:text-sm font-sans">
                
                <h4 className="font-serif text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {t('shipping_coor')}
                </h4>

                {/* Shipping Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block text-xs">{t('full_name_on_receipt')}</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
                      <User size={15} />
                    </span>
                    <input
                      id="checkout-name-input"
                      type="text"
                      required
                      placeholder="Ahmed Mohamed"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-[#D4AF37]/35 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] text-white text-xs sm:text-sm bg-black placeholder-stone-600 focus:outline-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Shipping phone */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block text-xs">{t('phone')}</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
                      <Phone size={15} />
                    </span>
                    <input
                      id="checkout-phone-input"
                      type="tel"
                      required
                      placeholder="+20 112 233 4455"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-[#D4AF37]/35 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] text-white text-xs sm:text-sm bg-black placeholder-stone-600 focus:outline-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block text-xs">{t('address')}</label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-stone-400 pointer-events-none">
                      <MapPin size={15} />
                    </span>
                    <textarea
                      id="checkout-addr-input"
                      required
                      rows={3}
                      placeholder={t('shipping_address_placeholder')}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-[#D4AF37]/35 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] text-white text-xs sm:text-sm bg-black placeholder-stone-600 focus:outline-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Messages */}
                {checkoutStatus && (
                  <div className={`p-4 rounded-xl flex gap-2 text-xs sm:text-sm font-sans leading-relaxed border ${
                    checkoutStatus.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/25 text-rose-400'
                  }`}>
                    {checkoutStatus.type === 'error' ? <AlertCircle size={16} className="shrink-0" /> : <ShieldCheck size={16} className="shrink-0 animate-bounce" />}
                    <span>{checkoutStatus.text}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  id="checkout-commit-btn"
                  type="submit"
                  disabled={isSubmitting || checkoutStatus?.type === 'success'}
                  className="w-full py-4 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] disabled:bg-zinc-900 disabled:text-zinc-600 border border-amber-600/10 text-black font-bold uppercase tracking-wider text-xs sm:text-sm focus:ring-4 focus:ring-[#D4AF37]/25 transition-all flex items-center justify-center gap-2 cursor-pointer duration-200"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    t('execute_order')
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
