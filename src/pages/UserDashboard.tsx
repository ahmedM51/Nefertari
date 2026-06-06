import React, { useState, useEffect } from 'react';
import { User, Calendar, ShoppingBag, Heart, MapPin, Phone, CreditCard, ChevronRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Booking, Order } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

export const UserDashboard: React.FC = () => {
  const { user, token, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'orders'>('profile');
  const { language } = useTranslation();

  // Personal histories
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (token) {
      fetchUserHistory();
    }
  }, [token, activeTab]);

  const fetchUserHistory = async () => {
    setIsLoadingHistory(true);
    try {
      if (activeTab === 'bookings') {
        const res = await fetch('/api/users/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/users/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleProfileForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    const success = await updateProfile({
      full_name: fullName,
      phone,
      address
    });
    if (success) {
      setProfileMsg({ 
        type: 'success', 
        text: language === 'ar' ? 'تم تحديث بيانات ملفك الشخصي وعناوين الفواتير بالكامل.' : 'Royal profile coordinates updated successfully.' 
      });
    } else {
      setProfileMsg({ 
        type: 'error', 
        text: language === 'ar' ? 'فشل تحديث بيانات الملف الشخصي. يرجى مراجعة المدخلات.' : 'Failed to update profile coordinates.' 
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const renderText = () => {
      if (language === 'ar') {
        if (status === 'confirmed') return 'مؤكد ومقبول';
        if (status === 'delivered') return 'تم التسليم بسلام';
        if (status === 'rejected') return 'ملغي أو مرفوض';
        if (status === 'processing') return 'تجري معالجته';
        if (status === 'shipped') return 'جاري الشحن والتوصيل';
        return status;
      }
      return status;
    };

    switch (status) {
      case 'confirmed':
      case 'delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold font-mono"><CheckCircle2 size={12} /> {renderText()}</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-455 text-xs font-semibold font-mono"><AlertCircle size={12} /> {renderText()}</span>;
      case 'processing':
      case 'shipped':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-[#D4AF37] text-xs font-semibold font-mono"><Clock size={12} className="animate-pulse" /> {renderText()}</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-semibold font-mono"><Clock size={12} /> {renderText()}</span>;
    }
  };

  return (
    <div id="user-dashboard-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-300 font-sans">
      
      {/* Dashboard Grid Header */}
      <div className="bg-[#121212] text-stone-150 border border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 shadow-xl mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase block">
            {language === 'ar' ? 'جلسة عضو معتمدة' : 'Royal Session Member'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">{user?.full_name}</h1>
          <p className="text-xs text-stone-400 font-sans">
            {language === 'ar' ? 'رتبة وصلاحية الحساب:' : 'Role credentials:'}{' '}
            <span className="text-[#D4AF37] capitalize font-bold">
              {user?.role === 'admin' ? (language === 'ar' ? 'مفتش المشرفين (مسؤول)' : 'Administrator') : (language === 'ar' ? 'مستكشف مسافر' : 'Tourist')}
            </span>
          </p>
        </div>
        <div className="text-xs font-mono font-medium text-stone-450 bg-black border border-[#D4AF37]/15 px-4 py-2.5 rounded-xl">
          {language === 'ar' ? 'تاريخ التسجيل:' : 'Created:'} {user ? new Date(user.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US') : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Hand Navigation list (3 of 12) */}
        <div className="lg:col-span-3">
          <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-2xl p-4 shadow-sm flex flex-col gap-1 select-none">
            
            <button
              id="user-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide rounded-lg flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#D4AF37] font-bold text-black'
                  : 'text-gray-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
              }`}
            >
              <User size={16} /> {language === 'ar' ? 'تعديل البيانات وعنوان الاتصال' : 'Edit Profile Credentials'}
            </button>

            <button
              id="user-tab-bookings"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide rounded-lg flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#D4AF37] font-bold text-black'
                  : 'text-gray-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
              }`}
            >
              <Calendar size={16} /> {language === 'ar' ? 'حجوزات رحلاتي السياحية' : 'My Tour Bookings'}
            </button>

            <button
              id="user-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide rounded-lg flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#D4AF37] font-bold text-black'
                  : 'text-gray-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
              }`}
            >
              <ShoppingBag size={16} /> {language === 'ar' ? 'طلبات مشترياتي الحرفية' : 'My Product Orders'}
            </button>

          </div>
        </div>

        {/* Right Hand Dynamic Tab Panels (9 of 12) */}
        <div className="lg:col-span-9 bg-[#121212] border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* 1. Profile Manager Form */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-white leading-tight">
                  {language === 'ar' ? 'عناوين الفواتير وحجوزات السائح' : 'Billing & Profile Credentials'}
                </h3>
                <p className="text-xs text-stone-450 mt-1">
                  {language === 'ar' ? 'يتم تعبئة هذه المدخلات تلقائياً عند الدفع وإتمام حجز البرامج تلافياً للجهد والوقت.' : 'Autofilled inside reservation checkouts for simple scheduling.'}
                </p>
              </div>

              <form onSubmit={handleProfileForm} className="space-y-4 max-w-xl text-xs sm:text-sm font-sans">
                
                {/* Full name */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block">{language === 'ar' ? 'اسم السائح بالكامل' : 'Full Tourist Name'}</label>
                  <input
                    id="profile-name-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#D4AF37]/25 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] text-white bg-black focus:outline-[#D4AF37]"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block">{language === 'ar' ? 'رقم الهاتف للتواصل وسرعة الاستجابة' : 'Phone Coordinates'}</label>
                  <input
                    id="profile-phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#D4AF37]/25 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] text-white bg-black focus:outline-[#D4AF37]"
                  />
                </div>

                {/* Shipping address */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 block">{language === 'ar' ? 'عنوان تسليم الطرود والتحف الحرفية بالتفصيل' : 'Fulfillment Shipping Address'}</label>
                  <textarea
                    id="profile-addr-input"
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#D4AF37]/25 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/15 focus:border-[#D4AF37] text-white bg-black focus:outline-[#D4AF37]"
                  />
                </div>

                {/* status message */}
                {profileMsg && (
                  <div className={`p-4 rounded-xl flex gap-1.5 text-xs sm:text-sm leading-relaxed border ${
                    profileMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/25 text-rose-455'
                  }`}>
                    {profileMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                {/* submit */}
                <button
                  id="profile-save-btn"
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs duration-250"
                >
                  {language === 'ar' ? 'حفظ إحداثيات وهويتي الرقمية' : 'Save Profile Changes'}
                </button>

              </form>
            </div>
          )}

          {/* 2. My Tour Bookings list */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-white leading-tight">
                  {language === 'ar' ? 'سجل حركات حجوزاتك السياحية' : 'My Historical Reservations'}
                </h3>
                <p className="text-xs text-[#D4AF37]/70 mt-1">
                  {language === 'ar' ? 'عرض ومطالعة حزم البرامج والرحلات السياحية السارية ومراجعة اعتمادها مباشرة من قسم التذاكر.' : 'Review active tour packages and approval status from our Tourist Bureau.'}
                </p>
              </div>

              {isLoadingHistory ? (
                <div className="py-20 text-center text-[#D4AF37] font-mono text-xs">
                  {language === 'ar' ? 'جاري مراجعة وتحصيل جداول حوزاتك من السجلات الملوكية...' : 'Accessing reservation list...'}
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-12 border border-dashed border-[#D4AF37]/25 rounded-2xl text-center space-y-2 bg-zinc-950">
                  <Calendar className="text-gray-600 mx-auto" size={32} />
                  <h4 className="text-sm font-serif font-semibold text-white">
                    {language === 'ar' ? 'لا توجد تذاكر حجز سياحي حتى الآن' : 'No Reservations Located'}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {language === 'ar' ? 'لم تقم بجدولة أي مسارات أو رحلات أثرية مع صالون نفرتاري للآن.' : "You haven't scheduled any tour packages with Nefertari yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    let localizedTitle = booking.tour?.title || 'Egypt Expedition';
                    if (language === 'ar' && booking.tour?.title) {
                      if (booking.tour.title.includes("Giza Pyramids")) {
                        localizedTitle = "رحلة أهرامات الجيزة الخالدة والسر الفلكي الملوكي";
                      } else if (booking.tour.title.includes("Karnak")) {
                        localizedTitle = "بعثة طيبة العظيمة والأقصر العتيقة الممتازة";
                      } else if (booking.tour.title.includes("Philae")) {
                        localizedTitle = "عبور فيلة المقدس والتجوال بجزيرة إيزيس البهية بالنوبة";
                      }
                    }

                    return (
                      <div
                        key={booking.id}
                        className="border border-[#D4AF37]/15 rounded-2xl p-5 hover:border-[#D4AF37]/35 transition-all text-xs sm:text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950/40"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-550">
                            <span>{language === 'ar' ? 'رمز معاملة الحجز:' : 'Booking ID:'}</span>
                            <span className="font-bold text-[#D4AF37]/80">{booking.id}</span>
                          </div>
                          <h4 className="font-serif text-base font-bold text-white">
                            {localizedTitle}
                          </h4>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-mono">
                            <span>{language === 'ar' ? 'موعد التفويج:' : 'Date:'}{' '}
                              <strong className="text-gray-250">
                                {new Date(booking.tour_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                              </strong>
                            </span>
                            <span>{language === 'ar' ? 'تعداد المسافرين:' : 'People count:'}{' '}
                              <strong className="text-gray-250">
                                {booking.number_of_people} {language === 'ar' ? 'أفراد' : 'Travelers'}
                              </strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-1.5 font-mono">
                          {getStatusBadge(booking.status)}
                          <span className="text-[10px] text-gray-500">
                            {language === 'ar' ? 'تاريخ الحجز والقطع:' : 'Booked:'} {new Date(booking.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. My Product Orders list */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-white leading-tight">
                  {language === 'ar' ? 'طرود ومقتنيات التراث المستقرة' : 'My Handcraft Purchases'}
                </h3>
                <p className="text-xs text-[#D4AF37]/75 mt-1">
                  {language === 'ar' ? 'تتبع فواتير وحالة شحن الهدايا والمنحوتات والبرديات المطلوبة من حرفيي خان الخليلي والأقصر.' : 'Check order items and shipping updates from the Cairo workshops.'}
                </p>
              </div>

              {isLoadingHistory ? (
                <div className="py-20 text-center text-[#D4AF37] font-mono text-xs">
                  {language === 'ar' ? 'جاري سحب وإعداد فواتير المشتريات من السجلات...' : 'Accessing purchase history...'}
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 border border-dashed border-[#D4AF37]/25 rounded-2xl text-center space-y-2 bg-zinc-950">
                  <ShoppingBag className="text-gray-650 mx-auto" size={32} />
                  <h4 className="text-sm font-serif font-semibold text-white">
                    {language === 'ar' ? 'سلة الطلبات المؤرشفة خالية حتى الآن' : 'No Orders Placed'}
                  </h4>
                  <p className="text-xs text-gray-405 font-sans">
                    {language === 'ar' ? 'يرجى استغلال طرودنا الرائعة واكتساب الهدايا التذكارية من المتجر.' : 'Your purchase list is vacant.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-[#D4AF37]/15 rounded-2xl p-5 hover:border-[#D4AF37]/35 transition-all text-xs bg-zinc-950/40"
                    >
                      {/* Order top line info */}
                      <div className="flex flex-col sm:flex-row justify-between pb-3 border-b border-[#D4AF37]/10 gap-2 mb-3">
                        <div className="space-y-1">
                          <div className="font-mono text-[10px] text-gray-500">
                            {language === 'ar' ? 'رمز طرد الشحنة:' : 'Order ID:'} <span className="font-bold text-[#D4AF37]">{order.id}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {language === 'ar' ? 'تاريخ الطلب الملوكي:' : 'Date:'} {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono">
                          {getStatusBadge(order.status)}
                          <span className="text-sm font-bold text-[#D4AF37]">
                            ${order.total_price.toFixed(2)} USD
                          </span>
                        </div>
                      </div>

                      {/* Order items lists block */}
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => {
                          let transItemName = item.name;
                          if (language === 'ar') {
                            if (item.name.includes("Papyrus")) transItemName = `مخطوطة كتاب الموتى الفرعونية الأصلية بقلم الذهب`;
                            else if (item.name.includes("Canopic")) transItemName = `الأواني الكانوبية الحجرية المنقوشة (مجموعة ملوكية حية)`;
                            else if (item.name.includes("Statue")) transItemName = `مجسم فخم للملكة الفرعونية حتشبسوت من الجرانيت الأسود`;
                            else if (item.name.includes("Cartouche")) transItemName = `خرطوشة ذهبية عيار 18 مخصصة باسم السائح الأنيق`;
                            else if (item.name.includes("Alabaster")) transItemName = `مزهريات رخامية منحوتة يدوياً وبوهج طيبة الدافئ`;
                          }
                          return (
                            <div key={idx} className="flex justify-between items-center text-xs text-gray-400 py-1 bg-black/40 px-2 rounded font-sans border border-[#D4AF37]/5">
                              <span className="font-medium text-gray-200">{transItemName} <strong className="text-[#D4AF37]">x{item.quantity}</strong></span>
                              <span className="font-mono">${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Shipping details footer */}
                      <div className="mt-3 pt-3 border-t border-[#D4AF37]/10 text-[10px] font-mono text-gray-500 flex flex-col sm:flex-row justify-between gap-1">
                        <span>{language === 'ar' ? 'اسم المستلم بالتصريح:' : 'Ship To:'} {order.customer_name} ({order.phone})</span>
                        <span className="truncate max-w-[300px]">{language === 'ar' ? 'عنوان الإرسال الحرفي البارز:' : 'Address:'} {order.shipping_address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
