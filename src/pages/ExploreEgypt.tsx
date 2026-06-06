import React, { useState, useEffect } from 'react';
import { Search, MapPin, Ticket, Clock, Filter, Sparkles, BookOpen } from 'lucide-react';
import { Monument, MonumentCategory } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ExploreEgyptProps {
  onSelectMonumentId: (id: string) => void;
  onSetView: (view: string) => void;
}

export const ExploreEgypt: React.FC<ExploreEgyptProps> = ({ onSelectMonumentId, onSetView }) => {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MonumentCategory | 'all'>('all');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const { t, language } = useTranslation();

  // Load monuments from server
  useEffect(() => {
    fetchMonuments();
  }, [searchTerm, selectedCategory, selectedGovernorate]);

  const fetchMonuments = async () => {
    setIsLoading(true);
    try {
      let url = '/api/monuments?';
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedGovernorate !== 'all') params.append('governorate', selectedGovernorate);

      const res = await fetch(url + params.toString());
      if (res.ok) {
        const data = await res.json();
        setMonuments(data);
      }
    } catch (e) {
      console.error("Failed to load monuments:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const governorates = ['Giza', 'Luxor', 'Aswan'];

  return (
    <div id="explore-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-300">
      
      {/* Title */}
      <div className="space-y-4 mb-10 text-center md:text-left">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full text-[#D4AF37]">
          {language === 'ar' ? 'الفهرس الرسمي للآثار المصرية القديمة' : 'Egyptian Antiquities Index'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
          {language === 'ar' ? 'استكشاف الكنوز والآثار الخالدة' : 'Explore Ancient Egypt'}
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-sans text-stone-400">
          {language === 'ar' 
            ? 'دليل المعابد التاريخية الكبرى، مقابر الملوك والملكات، والأبنية الأسطورية الموثقة. ارتحل آلاف السنين عبر الزمن والتاريخ.'
            : 'Index of pre-eminent historical temples, tomb cities, and natural preserves. Travel thousands of years through time.'}
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#121212] border border-[#D4AF37]/25 rounded-2xl p-6 shadow-sm mb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              id="search-monument-input"
              type="text"
              placeholder={language === 'ar' ? 'البحث عن الأهرامات، المعابد، المقابر الكبرى...' : 'Search Pyramids, Temples, Sphinx...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#D4AF37]/35 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-black text-sm text-white focus:bg-black font-sans placeholder-stone-500"
            />
          </div>

          {/* Governorate Select */}
          <div className="md:col-span-4 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
              <MapPin size={18} />
            </span>
            <select
              id="filter-governorate-select"
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#D4AF37]/35 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-black text-sm text-white focus:bg-black appearance-none"
            >
              <option value="all">{language === 'ar' ? 'كل المحافظات والأقاليم' : 'All Governorates'}</option>
              {governorates.map(gov => {
                let transGov = gov;
                if (gov === 'Giza') transGov = language === 'ar' ? 'الجيزة' : 'Giza';
                else if (gov === 'Luxor') transGov = language === 'ar' ? 'الأقصر' : 'Luxor';
                else if (gov === 'Aswan') transGov = language === 'ar' ? 'أسوان' : 'Aswan';
                return (
                  <option key={gov} value={gov}>{transGov}</option>
                );
              })}
            </select>
          </div>

          {/* Category Select Toggles */}
          <div className="md:col-span-3">
            <div className="flex gap-1.5 h-full">
              <button
                id="cat-btn-all"
                onClick={() => setSelectedCategory('all')}
                className={`flex-1 py-3 text-xs tracking-wider uppercase font-semibold rounded-xl border transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold'
                    : 'bg-black border-[#D4AF37]/25 text-gray-300 hover:bg-[#D4AF37]/10'
                }`}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </button>
              {(['historical', 'religious'] as MonumentCategory[]).map(cat => (
                <button
                  key={cat}
                  id={`cat-btn-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 py-3 text-xs tracking-wider uppercase font-semibold rounded-xl border transition-all duration-200 capitalize ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold'
                      : 'bg-black border-[#D4AF37]/25 text-gray-300 hover:bg-[#D4AF37]/10'
                  }`}
                >
                  {cat === 'historical' ? (language === 'ar' ? 'تاريخي' : 'Historical') : (language === 'ar' ? 'معابد/ديني' : 'Relics')}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Grid Results */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-gray-400">
            {language === 'ar' ? 'جارٍ إعادة استحضار وسرد الأرشيف الكهنوتي والمقدس...' : 'Retrieving monumental archives...'}
          </p>
        </div>
      ) : monuments.length === 0 ? (
        <div className="bg-[#121212] border border-[#D4AF37]/25 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <BookOpen className="mx-auto text-[#D4AF37]/50" size={48} />
          <h3 className="font-serif text-xl font-bold text-white">
            {language === 'ar' ? 'لم يعثر على معالم تاريخية' : 'No Monuments Discovered'}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed text-stone-400">
            {language === 'ar' 
              ? 'لم يعثر الأرشيف التراثي المفتوح لدينا على سجلات تطابق خيارات ومحددات الفرز الحالية.'
              : 'Your filter attributes did not match any historical archives in our records. Try adjusting search criteria.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedGovernorate('all');
            }}
            className="px-5 py-2 text-xs font-bold bg-[#D4AF37] text-black rounded-lg hover:bg-[#F3E5AB] uppercase tracking-wider duration-200"
          >
            {language === 'ar' ? 'إعادة تعيين المرشحات' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {monuments.map((mon) => {
            // Localized variables
            let localizedName = mon.name;
            let localizedGov = mon.governorate;
            let localizedDesc = mon.description;
            let localizedCategory = mon.category;

            if (language === 'ar') {
              if (mon.name === 'Giza Pyramids') {
                localizedName = "أهرامات الجيزة الخالدة وسر خوفو";
                localizedGov = "الجيزة";
                localizedDesc = "تعد الجيزة وأهراماتها الثلاثة العظيمة، دهوراً من الهندسة الفلكية الفريدة ومقابر الفراعنة والملوك الخالدين.";
                localizedCategory = "هرم ملكي";
              } else if (mon.name === 'Karnak Temple') {
                localizedName = "معبد الكرنك الإمبراطوري العظيم وبوابة آمون";
                localizedGov = "الأقصر";
                localizedDesc = "معبد الكرنك الأسطوري بالأقصر يضم صالة الأعمدة التاريخية الكبرى، وبوابة الالهة والمعابد المتداخلة للأسرة الحديثة.";
                localizedCategory = "معبد أثري";
              } else if (mon.name === 'Philae Temple') {
                localizedName = "معبد فيلة المقدس وجزيرة إيزيس البهية";
                localizedGov = "أسوان";
                localizedDesc = "معبد فيلة المخصص لعبادة الإلهة إيزيس تتركز روحه في جزيرة النيل العريقة ممتزجاً بنقاء الطقوس النوبية.";
                localizedCategory = "معبد أثري";
              }
            }

            return (
              <div 
                key={mon.id}
                onClick={() => {
                  onSelectMonumentId(mon.id);
                  onSetView('monument_details');
                }}
                className="bg-[#121212] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden bg-zinc-900 border-b border-[#D4AF37]/10">
                  <img 
                    src={mon.image_urls[0] || 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=800&q=80'} 
                    alt={localizedName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/85 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] tracking-widest uppercase font-bold px-2.5 py-1 rounded shadow">
                    {localizedGov}
                  </div>
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-black text-[10px] uppercase font-black px-2 py-1 rounded shadow-md capitalize">
                    {localizedCategory}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {localizedName}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed font-sans text-stone-450">
                      {localizedDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Clock size={13} className="text-[#D4AF37]" />
                      <span>{language === 'ar' ? mon.opening_hours.replace("AM", "صباحاً").replace("PM", "مساءً") : mon.opening_hours}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ticket size={13} className="text-[#D4AF37]" />
                      <span>{mon.ticket_prices.local} L.E. {language === 'ar' ? '(للمصريين)' : '(Egyptian Adult)'}</span>
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
