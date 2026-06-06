import React, { useState, useEffect } from 'react';
import { Calendar, Users, ArrowLeft, Clock, MapPin, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Tour } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

interface TourDetailsProps {
  tourId: string;
  onBack: () => void;
  onSetView: (view: string) => void;
}

export const TourDetails: React.FC<TourDetailsProps> = ({ tourId, onBack, onSetView }) => {
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user, token } = useAuth();
  const { t, language } = useTranslation();

  // Booking Form States
  const [tourDate, setTourDate] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [altPhone, setAltPhone] = useState(user?.phone || '');
  const [bookingMessage, setBookingMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTourDetails();
  }, [tourId]);

  const fetchTourDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tours');
      if (res.ok) {
        const tours: Tour[] = await res.json();
        const found = tours.find(t => t.id === tourId);
        if (found) {
          setTour(found);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setBookingMessage({ 
        type: 'error', 
        text: language === 'ar' 
          ? 'يجب تسجيل الدخول لتسجيل مقاعد القافلة السياحية. يرجى تفعيل دور المستخدم من الشريط العلوي أولاً.' 
          : 'You must be signed in to submit tourist slots. Please utilize the Role Dev Toggle in the header to authenticate.' 
      });
      return;
    }

    if (!tourDate || peopleCount <= 0) {
      setBookingMessage({ 
        type: 'error', 
        text: language === 'ar' 
          ? 'يرجى تحديد تاريخ تسيير الرحلة المطلوب وعدد المرافقين.' 
          : 'Please fill in a valid tour date and number of travelers.' 
      });
      return;
    }

    if (tour && peopleCount > tour.slots_available) {
      setBookingMessage({ 
        type: 'error', 
        text: language === 'ar'
          ? `عذراً، تتوفر فقط مساحة لعدد ${tour.slots_available} مسافرين متبقين بهذه البعثة.`
          : `Only ${tour.slots_available} slots remaining for this expedition.` 
      });
      return;
    }

    setIsSubmitting(true);
    setBookingMessage(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tour_id: tour?.id,
          number_of_people: peopleCount,
          tour_date: tourDate,
          contact_info: {
            email: user?.full_name || 'ahmedmohamed4336@gmail.com',
            alt_phone: altPhone
          }
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setBookingMessage({ 
          type: 'success', 
          text: language === 'ar'
            ? `بشرى! تم تأمين وتأكيد حجز مقاعد العبور للبعثة بنجاح، رقم التعريف: ${result.booking.id}. اتبع حالة الحجز من لوحة السائح الخاصة بك.`
            : `Grand Passage Secured! Your booking ID is ${result.booking.id}. Review and track statuses inside your User Dashboard.` 
        });
        if (tour) {
          setTour({ ...tour, slots_available: tour.slots_available - peopleCount });
        }
      } else {
        setBookingMessage({ type: 'error', text: result.error || 'Failed to submit booking.' });
      }
    } catch (err: any) {
      setBookingMessage({ type: 'error', text: err.message || 'Server error. Try again latter.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-stone-500">
          {language === 'ar' ? 'جارٍ فك رموز ونصوص مسار الرحلة الخالد...' : 'Unveiling ancient scrolls itinerary...'}
        </p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="font-serif text-2xl font-bold">{language === 'ar' ? 'لم يعثر على سجلات هذه الرحلة' : 'Tour Information Missing'}</h2>
        <button onClick={onBack} className="px-5 py-2 rounded bg-amber-500 text-slate-950 font-bold">
          {language === 'ar' ? 'قائمة الرحلات المجدولة' : 'Back to Catalog'}
        </button>
      </div>
    );
  }

  // Localized Variables for UI
  let localizedCity = tour.city;
  if (tour.city === 'Cairo & Giza') localizedCity = language === 'ar' ? 'القاهرة والجيزة' : 'Cairo & Giza';
  else if (tour.city === 'Luxor') localizedCity = language === 'ar' ? 'الأقصر العريقة' : 'Luxor';
  else if (tour.city === 'Aswan & Edfu') localizedCity = language === 'ar' ? 'أسوان وإدفو' : 'Aswan & Edfu';

  let localizedTitle = tour.title;
  let localizedDesc = tour.description;
  if (language === 'ar') {
    if (tour.title.includes("Giza Pyramids")) {
      localizedTitle = "رحلة أهرامات الجيزة الخالدة والسر الفلكي";
      localizedDesc = "برنامج ملكي متكامل لاستكشاف الجيزة وسقارة والمتحف الكبير بصحبة نخبة من أثريي معهد المصريات، شامل الإقامة الملكية الفاخرة.";
    } else if (tour.title.includes("Karnak")) {
      localizedTitle = "بعثة طيبة العظيمة والأقصر العتيقة";
      localizedDesc = "تتبع تاريخ ملوك الدولة الحديثة في الكرنك، وادي الملوك، ومعبد الدير البحري للملكة حتشبسوت في رحلة إرشادية ممتازة مفعمة بالعجائب والآثار الخالدة.";
    } else if (tour.title.includes("Philae")) {
      localizedTitle = "عبور فيلة المقدس والنوبة القديمة بمصر العليا";
      localizedDesc = "رحلة بالقوارب الشراعية لمعبد إيزيس الساحر في جزيرة فيلة، تجوال تاريخي في أسوان، وزيارات للمقابر الصخرية الأثرية والبيوت النوبية التقليدية.";
    }
  }

  return (
    <div id="tour-details-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-300">
      
      {/* Back button */}
      <button 
        id="tour-back-btn"
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#F3E5AB] font-semibold text-sm cursor-pointer transition-colors"
      >
        <ArrowLeft size={16} /> {language === 'ar' ? 'العودة لقائمة الرحلات' : 'Back to Catalog'}
      </button>

      {/* Hero Header */}
      <div className="relative h-96 rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-md mb-10 select-none bg-zinc-950">
        <img 
          src={tour.image_urls[0] || 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80'} 
          alt={localizedTitle} 
          className="w-full h-full object-cover brightness-[0.35]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-95" />
        
        <div className="absolute bottom-8 left-8 right-8 text-stone-100 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest bg-black/70 border border-[#D4AF37]/25 px-3 py-1 rounded-full w-fit">
            <MapPin size={12} className="text-[#D4AF37]" /> {localizedCity}
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight text-white">
            {localizedTitle}
          </h1>
          <div className="flex gap-6 text-xs sm:text-sm font-mono text-gray-300">
            <span>{tour.duration_days} {language === 'ar' ? 'أيام' : 'Days'} / {tour.duration_days - 1} {language === 'ar' ? 'ليالٍ' : 'Nights'}</span>
            <span>•</span>
            <span className="text-[#D4AF37] font-bold">${tour.price} USD / {language === 'ar' ? 'للفرد' : 'Person'}</span>
          </div>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column ITINERARY (7 of 12) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide">{t('expedition_itinerary')}</h2>
            <p className="text-gray-400 text-sm font-sans leading-relaxed">
              {localizedDesc}
            </p>
          </div>

          {/* Chapters Sequential Layout */}
          <div className="relative border-l-2 border-[#D4AF37]/20 pl-6 ml-4 space-y-10 font-sans">
            {tour.itinerary.map((it, idx) => {
              let localizedStepTitle = it.title;
              let localizedStepDesc = it.description;

              if (language === 'ar') {
                if (tour.title.includes("Giza Pyramids")) {
                  if (idx === 0) {
                    localizedStepTitle = "الاستقبال والترحيب بفندق مينا هاوس العريق";
                    localizedStepDesc = "مساء التحرك والاستقبال الخاص بغرف التراس الملوكي المطل مباشرة على مشهد الأهرامات المذهل.";
                  } else if (idx === 1) {
                    localizedStepTitle = "فك شفرة أهرام الهضبة ومتحف بردي الجيزة";
                    localizedStepDesc = "جولة مع كبار المصريين لتأمل قنوات التهوية وجيوب غرفة دفن خوفو الملكية، جولة شاملة حول جسد أبو الهول الأسطوري.";
                  } else if (idx === 2) {
                    localizedStepTitle = "سير الأسرار بسقارة المدرجة ومغارة السرابيوم الغامضة";
                    localizedStepDesc = "مرافقة المفتشين لتدشين السير الروحي عبر سرداب هرم زوسر، وفهم المدافن الصخرية تحت الرمال.";
                  }
                } else if (tour.title.includes("Karnak")) {
                  if (idx === 0) {
                    localizedStepTitle = "حلول الرحال بطيبة الملوكية";
                    localizedStepDesc = "الانتقال بالطيار الصغير للأقصر والتسكين بنزل وينتر بالاس الفاتر بموقعه الذهبي الساحر.";
                  } else if (idx === 1) {
                    localizedStepTitle = "قدس هيبة وادي الملوك الأثري العتيق";
                    localizedStepDesc = "الولوج لأعماق ثلاثة مقابر ملكية معتمة شهيرة وصرح معبد حتشبسوت الفريد بالدير البحري.";
                  } else if (idx === 2) {
                    localizedStepTitle = "أطلال وأسوار صرح الكرنك الشاسع";
                    localizedStepDesc = "تتبع صالة الأعمدة الفرعونية الكبرى، مسلات حتشبسوت، وممشى الكباش المطول.";
                  }
                } else if (tour.title.includes("Philae")) {
                  if (idx === 0) {
                    localizedStepTitle = "الممر الشراعي العريق بأسوان";
                    localizedStepDesc = "الترحيب بنزل كتراكت الشهير، والقيام بعبور نهري سلس على متن فلوكة نوبية عتيقة.";
                  } else if (idx === 1) {
                    localizedStepTitle = "معجزات إيزيس بجزيرة فيلة الممنوعة";
                    localizedStepDesc = "تأمل النقوش الصخرية التي تفصل قصة الولادة الإلهية، وزيارة صخرة مسلة أسوان الناقصة المصقولة.";
                  } else if (idx === 2) {
                    localizedStepTitle = "كنوز المعابد ومعالم مجتمع النوبة";
                    localizedStepDesc = "جولة بقرى غرب سهيل الملونة لاختبار ثقافة صناعات الفخار والتوابل الأسوانية.";
                  }
                }
              }

              return (
                <div key={idx} className="relative space-y-2">
                  
                  {/* Day Circle Badge */}
                  <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-bold flex items-center justify-center shadow">
                    {it.day}
                  </div>

                  <div className="bg-[#121212] p-5 border border-[#D4AF37]/15 rounded-2xl shadow-sm space-y-2 group hover:border-[#D4AF37]/45 transition-all duration-300">
                    <h3 className="font-serif text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 capitalize">
                      {t('day_prefix')} {it.day}: {localizedStepTitle}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      {localizedStepDesc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column BOOKING FORM (5 of 12) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-[#121212] border border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div className="flex items-center gap-3 pb-4 border-b border-[#D4AF37]/10">
              <Calendar className="text-[#D4AF37]" size={24} />
              <div>
                <h3 className="font-serif text-lg font-bold text-white">{t('initiate_booking')}</h3>
                <p className="text-xs text-gray-400">
                  {language === 'ar' ? 'أكّد حجز باقتك السياحية الملكية فوراً.' : 'Lock in historical credentials instantly.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleBookTour} className="space-y-4 text-xs sm:text-sm">
              
              {/* Target datepicker */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">{t('travel_date')}</label>
                <input
                  id="booking-date-input"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D4AF37]/35 rounded-xl bg-black text-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] placeholder-stone-600"
                />
              </div>

              {/* Number of attendees */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">{t('party_size')}</label>
                <div className="flex items-center border border-[#D4AF37]/30 rounded-xl bg-black max-w-[150px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPeopleCount(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 font-bold text-gray-300 hover:bg-[#D4AF37]/20 w-10 text-center cursor-pointer"
                  >
                    -
                  </button>
                  <span id="booking-people-qty" className="flex-1 text-center font-bold text-white">{peopleCount}</span>
                  <button
                    type="button"
                    onClick={() => setPeopleCount(prev => Math.min(tour.slots_available, prev + 1))}
                    className="px-3 py-2 font-bold text-gray-300 hover:bg-[#D4AF37]/20 w-10 text-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Contact info alt */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-300 block">{t('alt_phone')}</label>
                <input
                  id="booking-phone-input"
                  type="text"
                  placeholder="+20 100 123 4567"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D4AF37]/35 rounded-xl bg-black text-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] placeholder-stone-700"
                />
              </div>

              {/* Slots left alert */}
              <div className="p-3 bg-black border border-[#D4AF37]/20 rounded-xl flex items-center justify-between text-xs font-mono select-none">
                <span className="text-gray-400 font-medium">{language === 'ar' ? 'المقاعد الشاغرة بالقافلة:' : 'Available slots:'}</span>
                <span className="font-bold text-[#D4AF37]">{tour.slots_available} {language === 'ar' ? 'مقعد متبقٍ' : 'Slots Left'}</span>
              </div>

              {/* Message Banner */}
              {bookingMessage && (
                <div className={`p-4 rounded-xl flex gap-2 text-xs sm:text-sm font-sans leading-relaxed border ${
                  bookingMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                }`}>
                  {bookingMessage.type === 'error' ? <AlertCircle size={16} className="shrink-0" /> : <ShieldCheck size={16} className="shrink-0 animate-bounce" />}
                  <span>{bookingMessage.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="booking-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#D4AF37] text-black hover:bg-[#F3E5AB] font-bold uppercase tracking-wider text-xs sm:text-sm transition-all focus:ring-4 focus:ring-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer duration-200"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  t('submit_booking')
                )}
              </button>

            </form>

            <div className="text-center text-[10px] sm:text-xs text-gray-500 font-mono flex items-center justify-center gap-1.5 select-none pt-2">
              <ShieldCheck size={13} className="text-emerald-500" /> {language === 'ar' ? 'نمط وقناة حجز آمنة ومشفرة تماماً' : 'Secure SSL Protected Transfer Service'}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
