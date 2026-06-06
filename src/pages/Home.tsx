import React from 'react';
import { Compass, Calendar, ArrowRight, ShieldCheck, Sparkles, BookOpen, Star } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface HomeProps {
  onSetView: (view: string) => void;
  onSelectMonumentId: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onSetView, onSelectMonumentId }) => {
  const { t, language } = useTranslation();

  const popularDestinations = [
    {
      id: "m1",
      nameKey: "The Pyramids of Giza & Great Sphinx",
      nameAr: "أهرام الجيزة وبلاط أبو الهول العظيم",
      img: "https://modo3.com/thumbs/fit630x300/38407/1431247353/%D9%85%D8%A7_%D9%87%D9%88_%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84.jpg",
      govKey: "Giza Plateau",
      govAr: "هضبة الجيزة",
      type: "historical"
    },
    {
      id: "m2",
      nameKey: "Karnak Temple Complex",
      nameAr: "مجمع معابد الكرنك العريق",
      img: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80",
      govKey: "Luxor Temple Precinct",
      govAr: "حرم معبد الأقصر",
      type: "historical"
    },
    {
      id: "m4",
      nameKey: "Temple of Philae",
      nameAr: "صرح معبد فيلة الأسير",
      img: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80",
      govKey: "Aswan Island Reservoir",
      govAr: "جزيرة أسوان",
      type: "religious"
    }
  ];

  return (
    <div id="home-page" className="flex flex-col bg-[#0a0a0a] min-h-screen text-[#e5e7eb]">
      
      {/* Hero Banner Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.25] transform scale-105 transition-transform duration-[6000ms] ease-out select-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=2000&q=80')` }}
        />
        
        {/* Particle/Dust Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/20 via-[#0a0a0a]/60 to-[#0a0a0a]" />
 
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] text-xs tracking-[0.25em] font-mono uppercase mb-4 animate-pulse">
            <Sparkles size={11} />
            <span>{language === 'ar' ? 'كنوز الحضارة القديمة الخالدة' : 'Treasures of Ancient Civilizers'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-wider leading-none text-stone-100">
            {language === 'ar' ? (
              <>
                انغمس في عبق<br />
                <span className="text-[#D4AF37] font-extrabold shadow-stone-800">الأسرار القديمة</span>
              </>
            ) : (
              <>
                Immerse Yourself in<br />
                <span className="text-[#D4AF37] font-extrabold shadow-stone-800">Ancient Wonders</span>
              </>
            )}
          </h1>

          <p className="text-md sm:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t('hero_desc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-explore-cta"
              onClick={() => onSetView('explore')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D4AF37] text-slate-950 hover:bg-[#F3E5AB] font-bold tracking-wider text-sm uppercase shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 duration-300 cursor-pointer"
            >
              <Compass size={18} />
              {t('explore_button')}
            </button>
            <button
              id="hero-tours-cta"
              onClick={() => onSetView('tours')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent text-[#D4AF37] hover:text-[#F3E5AB] border border-[#D4AF37]/45 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] font-bold tracking-wider text-sm uppercase transition-all flex items-center justify-center gap-2 duration-300 cursor-pointer"
            >
              <Calendar size={18} />
              {t('book_now')}
            </button>
          </div>
        </div>

        {/* Floating Accent Details */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center text-xs tracking-widest text-[#D4AF37]/60 hidden md:block select-none">
          {language === 'ar' ? 'تصفح لأسفل لفك شفرة السجلات التاريخية' : 'SCROLL DOWN TO UNVEIL THE CHRONICLES'}
        </div>
      </section>

      {/* Brand Value Pillars Section */}
      <section className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-[#121212] border border-[#D4AF37]/20 rounded-2xl shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:border-[#D4AF37]/40 duration-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/35">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-serif font-bold text-white tracking-wide">
              {language === 'ar' ? 'دقة معتمدة ومرخصة' : 'Licensed Academic Accuracy'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {language === 'ar' 
                ? 'كل مسار في رحلاتنا معتمد رسمياً من كبار الأثريين وعبر نخبة من كبار علماء المصريات ومفتشي الآثار وعمداء التاريخ في مصر.'
                : 'Every tour itinerary is approved by leading historians and curated by private certified Egyptologists.'}
            </p>
          </div>

          <div className="p-6 bg-[#121212] border border-[#D4AF37]/20 rounded-2xl shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:border-[#D4AF37]/40 duration-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/35">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg font-serif font-bold text-white tracking-wide">
              {language === 'ar' ? 'سياسة حجز واستبدال مرنة' : 'Fully Flexible Booking Policy'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {language === 'ar'
                ? 'أعد جدولة رحلاتك السياحية وحجوزاتك بكل سهولة ويسر من لوحة تحكم السائح، مع ميزات تتبع فوري لحالة الحجوزات بشكل سلس.'
                : 'Reschedule easily with our automated dashboard. Lock in historical slots ahead of time with zero processing stresses.'}
            </p>
          </div>

          <div className="p-6 bg-[#121212] border border-[#D4AF37]/20 rounded-2xl shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:border-[#D4AF37]/40 duration-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/35">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-serif font-bold text-white tracking-wide">
              {language === 'ar' ? 'أصل الحرف اليدوية المضمون' : 'Secured Legacy Craft Genuine'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {language === 'ar'
                ? 'تحف ورق البردي والمنحوتات الزجاجية والرخامية المذهلة في المتجر معتمدة تماماً وموقعة يدوياً بختم كبار صانعيها المهرة الأقدم.'
                : 'All papyrus tablets, sculptures, and jewelry featured inside the Heritage Store hold authentic certified artisan signatures.'}
            </p>
          </div>

        </div>
      </section>

      {/* Popular Highlights Grid */}
      <section className="bg-[#0a0a0a] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">{t('popular_monuments')}</span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-white tracking-tight">
              {language === 'ar' ? 'أجمل المقاصد التاريخية الملوكية' : 'Eminent Royal Landmarks'}
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularDestinations.map(dest => (
              <div 
                key={dest.id}
                className="group bg-[#121212] rounded-2xl overflow-hidden border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 shadow-md hover:shadow-xl transition-all cursor-pointer duration-300 transform hover:-translate-y-1"
                onClick={() => {
                  onSelectMonumentId(dest.id);
                  onSetView('monument_details');
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={dest.img} 
                    alt={dest.nameKey} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/85 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded">
                    {language === 'ar' ? dest.govAr : dest.govKey}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-serif text-white font-bold group-hover:text-[#D4AF37] transition-colors">
                    {language === 'ar' ? dest.nameAr : dest.nameKey}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 font-mono">
                    <span className="capitalize text-[#D4AF37] font-semibold">{t('historical')}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[#D4AF37] font-semibold">
                      {language === 'ar' ? 'قراءة التاريخ' : 'Read History'} <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onSetView('explore')}
              className="px-6 py-3 rounded-lg border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] font-bold text-xs tracking-[0.2em] transition-all uppercase hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              {language === 'ar' ? 'تصفح كامل المعالم الأثرية والمقابر' : 'Browse All Monuments'}
            </button>
          </div>

        </div>
      </section>

      {/* Storytelling Banner Section */}
      <section className="bg-[#070707] text-white py-16 border-t border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-xs font-mono text-[#D4AF37] tracking-[0.25em] uppercase">
              {language === 'ar' ? 'سجل للمليكة الملكات نفرتاري' : 'Chronicle of Nefertari'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-100 tracking-wide leading-tight">
              {language === 'ar' ? (
                <>
                  &ldquo;جميلتهن التي لا تضاهى&rdquo; <br />
                  حبيبة الملك ومستودع سطوع الشمس.
                </>
              ) : (
                <>
                  &ldquo;The Most Beautiful of Them All&rdquo; <br />
                  Who the Divine Sun Shines Upon.
                </>
              )}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 font-sans leading-relaxed">
              {language === 'ar'
                ? 'الملكة نفرتاري، الزوجة الملكية العظمى للفرعون العظيم رمسيس الثاني، كانت رمزاً للجمال الساحر والذكاء السياسي الواسع والحظوة الثقافية الرفيعة. تمثل مقبرتها المصنفة بالرمز (QV66) في وادي الملكات بالأقصر قمة المجد للألوان المصرية القديمة والنقوش المتموجة ببريق الفخامة.'
                : 'Queen Nefertari, royal consort of Pharaoh Ramesses II, was legendary for her grace, extensive political wisdom, and cultural influence. Her tomb in Luxor (QV66) stands as the absolute zenith of Egyptian chromatic painting.'}
            </p>
          </div>
          <div className="md:col-span-5 h-72 md:h-96 rounded-2xl overflow-hidden border border-[#D4AF37]/25 relative">
            <img 
              src="https://img.youm7.com/large/202403171035443544.jpg" 
              alt="Nefertari Tomb Relic" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 text-xs font-serif text-stone-300">
              {language === 'ar' ? 'جزء من نقوش جدران مقبرة الملكة نفرتاري الفاتنة، وادي الملكات بالأقصر' : 'Relief painting at QV66 Tomb of Nefertari, Luxor Necropolis.'}
            </div>
          </div>
        </div>
      </section>

      {/* User Reviews and Testimonials */}
      <section className="bg-[#0a0a0a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">{language === 'ar' ? 'سجل شهادات ومراجعات رحالتنا' : 'Trusted by Global Travelers'}</span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-white">{language === 'ar' ? 'قائمتنا الشرفية وتوصيات السائحين' : 'Explorer Commendations'}</h2>
            <div className="w-16 h-0.5 bg-[#D4AF37]/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#D4AF37]/15 space-y-4">
              <div className="flex gap-1 text-[#D4AF37]">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-gray-400 font-sans italic leading-relaxed">
                {language === 'ar' 
                  ? '"كانت رحلتنا التراثية التي استمرت ثلاثة أيام في الأقصر مذهلة بحق! كان المرشد الأثري مطلعاً للغاية على تاريخ أمنحتب الثالث وعلم الفلك المصري لتجربة ملكية خالصة بحق."'
                  : '"Our 3-day Luxor Heritage Passage was absolutely perfect. The private Egyptologist guide knew everything about Amenhotep III and ancient astronomy."'}
              </p>
              <div>
                <h4 className="font-bold text-white">Charlotte Vance</h4>
                <p className="text-xs text-stone-500">{language === 'ar' ? 'رحالة من لندن، المملكة المتحدة' : 'Traveler from London, UK'}</p>
              </div>
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-[#D4AF37]/15 space-y-4">
              <div className="flex gap-1 text-[#D4AF37]">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-gray-400 font-sans italic leading-relaxed">
                {language === 'ar'
                  ? '"طلبت قطعة من الأواني المرمرية المنحوتة يدوياً من البازار العائلي للموقع، ووصلت آمنة تماماً إلى مقر عملي. تفاصيل ورونق طبيعي يمنح مكتبي وهجاً دافئاً للغاية كشمس طيبة."'
                  : '"Ordered the Alabaster Urn from the Heritage Store and it arrived safe in San Francisco. It has beautiful natural veins and lights up my office with a holy warm temple glow."'}
              </p>
              <div>
                <h4 className="font-bold text-white">Dr. Julian S.</h4>
                <p className="text-xs text-stone-500">{language === 'ar' ? 'أمين بمتحف سان فرانسيسكو للآثار' : 'Curator, SF Antiquities Museum'}</p>
              </div>
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-[#D4AF37]/15 space-y-4">
              <div className="flex gap-1 text-[#D4AF37]">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-gray-400 font-sans italic leading-relaxed">
                {language === 'ar'
                  ? '"حجز تذاكر زيارة أهرامات الجيزة ومقبرة رمسيس السادس عبر نفرتاري كان رائعاً للغاية! كل الإجراءات تعمل بشكل فوري ومستقر وتوفير رهيب للوقت والجهد."'
                  : '"Booking Giza Pyramids tickets on Nefertari with local rates saved so much time! Everything works seamlessly through their backend dashboards."'}
              </p>
              <div>
                <h4 className="font-bold text-white">منة الله صبري</h4>
                <p className="text-xs text-stone-500">{language === 'ar' ? 'سائحة محلية، القاهرة' : 'Local explorer, Cairo'}</p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
