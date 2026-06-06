import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { Tour } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ToursProps {
  onSelectTourId: (id: string) => void;
  onSetView: (view: string) => void;
}

export const Tours: React.FC<ToursProps> = ({ onSelectTourId, onSetView }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const { t, language } = useTranslation();

  useEffect(() => {
    fetchTours();
  }, [searchTerm, selectedCity]);

  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCity !== 'all') params.append('city', selectedCity);

      const res = await fetch('/api/tours?' + params.toString());
      if (res.ok) {
        const data = await res.json();
        setTours(data);
      }
    } catch (e) {
      console.error("Failed to fetch tours:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const cities = ['Cairo & Giza', 'Luxor', 'Aswan & Edfu'];

  return (
    <div id="tours-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-300">
      
      {/* Title */}
      <div className="space-y-4 mb-10 text-center md:text-left">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full">
          {language === 'ar' ? 'باقات وحزم المعابر الملكية الإرشادية' : 'Guided Royal Passage Packages'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
          {language === 'ar' ? 'الرحلات والبعثات التراثية بمصر' : 'Egypt Heritage Tours'}
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-sans">
          {language === 'ar' 
            ? 'مسارات تاريخية منسقة بعناية حول الأوابد الفرعونية والرموز القديمة الملوكية. بتوجيه خاص من كبار الأكاديميين ومفتشي الآثار ومشتملات النزل والانتقالات الفاخرة.'
            : 'Curated historical travels designed around pre-eminent ancient monuments. Accompanied by private scholars, transfers, and premium accommodations.'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[#121212] border border-[#D4AF37]/25 rounded-2xl p-6 shadow-sm mb-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              id="search-tour-input"
              type="text"
              placeholder={t('tour_search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#D4AF37]/35 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-black text-sm text-white focus:bg-black font-sans placeholder-stone-500"
            />
          </div>

          {/* City Selection */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
              <MapPin size={18} />
            </span>
            <select
              id="filter-tour-city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-[#D4AF37]/35 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-black text-sm text-white focus:bg-black appearance-none"
            >
              <option value="all">{language === 'ar' ? 'جميع الأقاليم المتاحة' : 'All Cities / Regions'}</option>
              {cities.map(ct => {
                let transCity = ct;
                if (ct === 'Cairo & Giza') transCity = language === 'ar' ? 'القاهرة والجيزة' : 'Cairo & Giza';
                else if (ct === 'Luxor') transCity = language === 'ar' ? 'الأقصر العريقة' : 'Luxor';
                else if (ct === 'Aswan & Edfu') transCity = language === 'ar' ? 'أسوان وإدفو' : 'Aswan & Edfu';
                return (
                  <option key={ct} value={ct}>{transCity}</option>
                );
              })}
            </select>
          </div>

        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-gray-400">
            {language === 'ar' ? 'جارٍ جلب برامج وعروض قوافل الرحلات الملكية...' : 'Retrieving expeditions catalogs...'}
          </p>
        </div>
      ) : tours.length === 0 ? (
        <div className="bg-[#121212] border border-[#D4AF37]/25 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <Calendar className="mx-auto text-[#D4AF37]/50" size={48} />
          <h3 className="font-serif text-xl font-bold text-white">
            {language === 'ar' ? 'لم يتم العثور على رحلات مجدولة' : 'No Scheduled Tours Found'}
          </h3>
          <p className="text-gray-400 text-sm">
            {language === 'ar' 
              ? 'لا توجد قوافل مسجلة تطابق مدخلات البحث الحالية، يرجى تصفية أو توسيع معايير الفرز والبحث.'
              : "We currently don't hold schedule files matching these filters. Try broadening your keywords or regions."}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCity('all');
            }}
            className="px-5 py-2 text-xs font-bold bg-[#D4AF37] text-black rounded-lg hover:bg-[#F3E5AB] uppercase tracking-wider duration-200"
          >
            {language === 'ar' ? 'إعادة ضبط مرشحات البحث' : 'Clear Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map(tour => {
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
              <div
                key={tour.id}
                onClick={() => {
                  onSelectTourId(tour.id);
                  onSetView('tour_details');
                }}
                className="bg-[#121212] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group duration-300 transform hover:-translate-y-1"
              >
                <div>
                  {/* Visual card top */}
                  <div className="relative h-56 overflow-hidden bg-zinc-900 border-b border-[#D4AF37]/10">
                    <img 
                      src={tour.image_urls[0] || 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80'} 
                      alt={localizedTitle} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-black/85 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded">
                      {localizedCity}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-[#D4AF37] text-black text-xs font-black px-3 py-1 rounded shadow-md">
                      {tour.duration_days} {language === 'ar' ? 'أيام مذهلة' : 'Days'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {localizedTitle}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed font-sans">
                      {localizedDesc}
                    </p>
                  </div>
                </div>

                {/* Action and Price footer */}
                <div className="p-6 pt-0 mt-2">
                  <div className="pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        {language === 'ar' ? 'تكلفة الفرد بالدولار' : 'Price Per Person'}
                      </span>
                      <span className="text-xl font-bold text-[#D4AF37] font-sans">${tour.price} <span className="text-[10px] text-gray-400 font-mono">USD</span></span>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-black border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold font-mono">
                        <Users size={12} className="text-[#D4AF37]" />
                        {tour.slots_available} {language === 'ar' ? 'شاغر متبقٍ' : 'Slots Left'}
                      </span>
                      <span className="text-xs text-[#D4AF37] font-bold flex items-center gap-1 justify-end mt-1 group-hover:translate-x-1 transition-all">
                        {language === 'ar' ? 'مسار الرحلة' : 'View Itinerary'} <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
