import React, { useState, useEffect } from 'react';
import { Compass, Clock, Ticket, Map, Calendar, ArrowLeft, HelpCircle } from 'lucide-react';
import { Monument, Tour } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface MonumentDetailsProps {
  monumentId: string;
  onBack: () => void;
  onSetView: (view: string) => void;
  onSelectTourId: (id: string) => void;
}

export const MonumentDetails: React.FC<MonumentDetailsProps> = ({ monumentId, onBack, onSetView, onSelectTourId }) => {
  const [monument, setMonument] = useState<Monument | null>(null);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    fetchMonumentAndRelated();
  }, [monumentId]);

  const fetchMonumentAndRelated = async () => {
    setIsLoading(true);
    try {
      const monRes = await fetch('/api/monuments');
      if (monRes.ok) {
        const mons: Monument[] = await monRes.json();
        const found = mons.find(m => m.id === monumentId);
        if (found) {
          setMonument(found);
          setActiveImage(found.image_urls[0] || 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=1200&q=80');
        }
      }

      const tourRes = await fetch('/api/tours');
      if (tourRes.ok) {
        const allTours: Tour[] = await tourRes.json();
        const matched = allTours.filter(t => t.monument_id === monumentId);
        setRelatedTours(matched);
      }
    } catch (e) {
      console.error("Failed to load details:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-stone-500">
          {language === 'ar' ? 'جارٍ إعادة تجسيد الآثار واستحضار الأرشيف الأثري...' : 'Unveiling ancient relics...'}
        </p>
      </div>
    );
  }

  if (!monument) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="font-serif text-2xl font-bold">{language === 'ar' ? 'لم يعثر على سجلات الأثر' : 'Monument Not Found'}</h2>
        <button onClick={onBack} className="px-5 py-2 rounded bg-amber-500 text-slate-950 font-bold">{language === 'ar' ? 'رجوع' : 'Go Back'}</button>
      </div>
    );
  }

  // Handle localizations
  let localizedName = monument.name;
  let localizedGov = monument.governorate;
  let localizedDesc = monument.description;
  let localizedCategory = monument.category;

  if (language === 'ar') {
    if (monument.name === 'Giza Pyramids') {
      localizedName = "أهرامات الجيزة الخالدة وسر خوفو";
      localizedGov = "الجيزة";
      localizedDesc = "تعد الجيزة وأهراماتها الثلاثة العظيمة، دهوراً من الهندسة الفلكية الفريدة ومقابر الفراعنة والملوك الخالدين.";
      localizedCategory = "هرم ملكي";
    } else if (monument.name === 'Karnak Temple') {
      localizedName = "معبد الكرنك الإمبراطوري العظيم وبوابة آمون";
      localizedGov = "الأقصر";
      localizedDesc = "معبد الكرنك الأسطوري بالأقصر يضم صالة الأعمدة التاريخية الكبرى، وبوابة الالهة والمعابد المتداخلة للأسرة الحديثة.";
      localizedCategory = "معبد أثري";
    } else if (monument.name === 'Philae Temple') {
      localizedName = "معبد فيلة المقدس وجزيرة إيزيس البهية";
      localizedGov = "أسوان";
      localizedDesc = "معبد فيلة المخصص لعبادة الإلهة إيزيس تتركز روحه في جزيرة النيل العريقة ممتزجاً بنقاء الطقوس النوبية.";
      localizedCategory = "معبد أثري";
    }
  }

  return (
    <div id="monument-details-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-300">
      
      {/* Back button */}
      <button 
        id="mon-back-btn"
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#F3E5AB] font-semibold text-sm cursor-pointer transition-colors"
      >
        <ArrowLeft size={16} /> {language === 'ar' ? 'الرجوع ومتابعة الاستكشاف' : 'Back to Exploration'}
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Gallery Column (7 of 12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-[450px] rounded-2xl overflow-hidden bg-zinc-950 border border-[#D4AF37]/20 shadow-sm relative">
            <img 
              src={activeImage} 
              alt={localizedName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-black/85 border border-[#D4AF37]/35 px-3 py-1 text-xs text-[#D4AF37] font-mono rounded tracking-widest uppercase">
              {localizedGov}
            </div>
          </div>

          {/* Thumbnails */}
          {monument.image_urls.length > 1 && (
            <div className="flex gap-4">
              {monument.image_urls.map((imgUrl, i) => (
                <button
                  key={i}
                  id={`gallery-thumb-${i}`}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-24 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === imgUrl ? 'border-[#D4AF37] shadow-md scale-105' : 'border-[#D4AF37]/20'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail view" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column (5 of 12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full uppercase tracking-widest inline-block select-none border border-[#D4AF37]/20">
              {localizedCategory} {language === 'ar' ? 'المعتمد تاريخياً' : 'Archive'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white leading-tight">
              {localizedName}
            </h1>
          </div>

          <div className="space-y-4 bg-[#121212] border border-[#D4AF37]/25 p-6 rounded-2xl shadow-sm font-sans">
            
            {/* Logistics Widget */}
            <div className="flex items-center gap-3 py-2 border-b border-[#D4AF37]/10">
              <Clock className="text-[#D4AF37] shrink-0" size={18} />
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'ساعات استقبال الزوار والوفود' : 'Visiting Hours'}</h4>
                <p className="text-sm font-medium text-gray-200">
                  {language === 'ar' ? monument.opening_hours.replace("AM", "صباحاً").replace("PM", "مساءً") : monument.opening_hours}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 border-b border-[#D4AF37]/10">
              <Ticket className="text-[#D4AF37] shrink-0" size={18} />
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'أسعار تذاكر الدخول الرسمية' : 'Admission Fees'}</h4>
                <div className="text-sm text-gray-400 leading-relaxed">
                  <span className="font-bold text-[#D4AF37]">{monument.ticket_prices.foreign} L.E.</span> {language === 'ar' ? 'للسائح الأجنبي البالغ' : 'Foreign Adult'} <br />
                  <span className="font-bold text-[#D4AF37]">{monument.ticket_prices.local} L.E.</span> {language === 'ar' ? 'للمواطن المصري البالغ' : 'Egyptian Adult'}
                </div>
              </div>
            </div>

            {monument.location_coords && (
              <div className="flex items-center gap-3 py-2">
                <Map className="text-[#D4AF37] shrink-0" size={18} />
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'الإحداثيات الجغرافية (GPS)' : 'GPS Coordinates'}</h4>
                  <p className="text-sm font-mono text-[#D4AF37]">{monument.location_coords}</p>
                </div>
              </div>
            )}

          </div>

          {/* Booking / Tour linking widget */}
          {relatedTours.length > 0 ? (
            <div className="bg-black text-stone-100 border border-[#D4AF37]/35 p-6 rounded-2xl shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="text-[#D4AF37] animate-pulse" size={20} />
                <h3 className="font-serif text-lg font-bold text-white">{language === 'ar' ? 'البعثات والرحلات المعتمدة المتاحة' : 'Certified Tours Available'}</h3>
              </div>
              <p className="text-gray-400 text-xs font-sans leading-relaxed">
                {language === 'ar' 
                  ? `قمنا بإرساء وتوفير عدد ${relatedTours.length} رحلة ملوكية مخصصة تتضمن مساراتها زيارة معالم ${localizedName}.`
                  : `We have ${relatedTours.length} authentic, fully guided tour package(s) configured that include visiting ${monument.name}.`}
              </p>
              <div className="space-y-3">
                {relatedTours.map(tour => {
                  let subTitle = tour.title;
                  if (language === 'ar') {
                    if (tour.title.includes("Giza Pyramids")) subTitle = "رحلة أهرامات الجيزة الخالدة والسر الفلكي";
                    else if (tour.title.includes("Karnak")) subTitle = "بعثة طيبة العظيمة والأقصر العتيقة";
                    else if (tour.title.includes("Philae")) subTitle = "عبور فيلة المقدس والنوبة القديمة بمصر العليا";
                  }

                  return (
                    <button
                      key={tour.id}
                      id={`mon-tour-link-${tour.id}`}
                      onClick={() => {
                        onSelectTourId(tour.id);
                        onSetView('tour_details');
                      }}
                      className="w-full text-left p-3 rounded-lg bg-[#121212] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 transition-all text-xs font-semibold flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <h4 className="text-gray-200 group-hover:text-[#D4AF37] transition-colors truncate max-w-[200px]">{subTitle}</h4>
                        <p className="text-gray-500 font-mono font-medium text-[10px] mt-0.5">
                          {tour.duration_days} {language === 'ar' ? 'أيام' : 'Days'} • {language === 'ar' ? 'نظام باقة كاملة تبدأ بسعر' : 'From'} ${tour.price}
                        </p>
                      </div>
                      <span className="text-[#D4AF37] underline uppercase text-[10px] font-bold shrink-0 ml-2">
                        {language === 'ar' ? 'احجز الآن' : 'Book Tour'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#121212] border border-[#D4AF37]/20 p-6 rounded-2xl text-center">
              <Calendar className="text-[#D4AF37]/60 mx-auto mb-2" size={24} />
              <h4 className="text-xs font-bold text-white">{language === 'ar' ? 'لا توجد حزم ملوكية مباشرة' : 'No Dedicated Package Found'}</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'لا تتوفر برامج رحلات مخصصة مع هذا الصرح حالياً. يمكنك استعراض دليل الرحلات المتاحة للتجول.'
                  : "No scheduled single tours match this landmark. Please review our full catalogs for custom tours or request a private guide."}
              </p>
              <button 
                onClick={() => onSetView('tours')}
                className="mt-3 px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'تصفح باقة المعابر' : 'Browse All Tours'}
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Description / Chronicle Section */}
      <section className="mt-16 pt-10 border-t border-[#D4AF37]/10 space-y-6">
        <h2 className="text-2xl font-serif font-black text-[#D4AF37] tracking-wide">
          {language === 'ar' ? 'المدونات التاريخية والأرشيف المعماري' : 'Historical Chronicle & Architecture'}
        </h2>
        <div className="prose max-w-none text-gray-300 font-serif leading-relaxed text-base space-y-4">
          <p>{localizedDesc}</p>
          <p>
            {language === 'ar' 
              ? 'تشير سجلات التنقيب والألواح الهيروغليفية التاريخية المكتشفة إلى أن هذا الموقع المهيب قد خدم كمحور ثقافي وروحي فرعي طوال العصور المصرية القديمة. وقد قضى مئات الآلاف من البنائين والفيزيائيين والفلكيين وأمهر النحاتين أجيالاً متعاقبة لإكمال هندسته الدقيقة وتوجيه الصروح والممرات لتتناسب بدقة وسلاسة مع المسارات الفلكية في السماء وعلامات الاعتدالين والاتجاهات الجغرافية.' 
              : 'Excavation records and historical hieroglyphic tablets indicate that this majestic location served as both a cultural pivot and a divine center. Thousands of stonemasons, architects, astronomers, and artists spent generations perfecting its geometry, aligning its structures precisely with astrological pathways and celestial meridians.'}
          </p>
          <p>
            {language === 'ar' 
              ? 'خلال زيارتك التاريخية، تلمّس عظمة المقاييس والنقوش الملونة والأصوات العجيبة الحية الباقية المنسوجة بالبناء نفسه. وتتوفر باقة وافية من أدلة الأثريين المعتمدين والمفسرين لترجمة جداريات المعابد والمسلات مباشرة من هيروغليفية الأسلاف لتقديم فك تاريخي متكامل.' 
              : 'During your tour, witness the grand scale of the columns, the vibrancy of ancient color pigments, and the legendary acoustic properties built directly into the halls. Fully trained private Egyptology guides are available to translate historical narratives directly from the walls.'}
          </p>
        </div>
      </section>

    </div>
  );
};
