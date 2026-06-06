import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, ShoppingCart, Star, Heart, FileText, Gift, Sparkles, Filter, X } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from '../contexts/LanguageContext';

interface HeritageStoreProps {
  onSetView: (view: string) => void;
}

export const HeritageStore: React.FC<HeritageStoreProps> = ({ onSetView }) => {
  const { t, language } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  
  // Selected product details modal
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const res = await fetch('/api/products?' + params.toString());
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const categories: ProductCategory[] = ['statues', 'papyrus', 'accessories', 'handicrafts'];

  return (
    <div id="store-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-300">
      
      {/* Title */}
      <div className="space-y-4 mb-10 text-center md:text-left">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full text-[#D4AF37]">
          {language === 'ar' ? 'البازار التراثي للمصوغات والتحف الفرعونية' : 'Pharaonic Relics & Crafts Bazaar'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
          {t('store_title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-sans text-stone-400">
          {t('store_subtitle')}
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#121212] border border-[#D4AF37]/25 rounded-2xl p-6 shadow-sm mb-10 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Search */}
          <div className="lg:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              id="search-product-input"
              type="text"
              placeholder={t('search_goods')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#D4AF37]/35 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-black text-sm text-white focus:bg-black font-sans placeholder-stone-500"
            />
          </div>

          {/* Category Quick Filter badges */}
          <div className="lg:col-span-7 flex flex-wrap gap-2 select-none justify-start lg:justify-end">
            <button
              id="prod-cat-all"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-sm font-bold'
                  : 'bg-black border-[#D4AF37]/25 hover:bg-[#D4AF37]/10 text-gray-300'
              }`}
            >
              {t('all_categories')}
            </button>
            {categories.map(cat => {
              let label: string = cat;
              if (cat === 'statues') label = t('category_statues');
              else if (cat === 'papyrus') label = t('category_papyrus');
              else if (cat === 'accessories') label = t('category_accessories');
              else if (cat === 'handicrafts') label = language === 'ar' ? 'حرف فريدة' : 'Handicrafts';

              return (
                <button
                  key={cat}
                  id={`prod-cat-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 uppercase tracking-wider ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-sm font-bold'
                      : 'bg-black border-[#D4AF37]/25 hover:bg-[#D4AF37]/10 text-gray-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Product List Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-gray-400">
            {language === 'ar' ? 'جاري تحرّي مخزون مشاغل كبار الحرفيين بمصر العتيقة...' : 'Unveiling ancient workshops inventories...'}
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#121212] border border-[#D4AF37]/25 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto">
          <ShoppingBag className="mx-auto text-[#D4AF37]/50" size={48} />
          <h3 className="font-serif text-xl font-bold text-white">
            {language === 'ar' ? 'الكتالوج شاغر حالياً' : 'Catalogue is Empty'}
          </h3>
          <p className="text-gray-400 text-sm text-stone-400-300">
            {language === 'ar' ? 'لم نعثر على مقتنيات أو مدونات تراثية مطابقة لبحثك في الخان حالياً.' : "We couldn't discover any relics matching the desired query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => {
            let localizedName = product.name;
            let localizedDesc = product.description;
            let localizedCat = product.category;

            if (language === 'ar') {
              if (product.name.includes("Papyrus") || product.name.includes("Dead")) {
                localizedName = "مخطوطة كتاب الموتى الفرعونية الأصلية";
                localizedCat = "ورق بردي فخم";
                localizedDesc = "مخطوطة ورقية حقيقية من نبات البردي النيلي، مرسومة يدوياً بماء الذهب والألوان التراثية محاكية لطقوس وتعاويذ كتاب الموتى.";
              } else if (product.name.includes("Canopic") || product.name.includes("Jar")) {
                localizedName = "مجموعة الأواني الكانوبية الأربعة للأحشاء";
                localizedCat = "منحوتات جرانيت";
                localizedDesc = "مجموعة من أربعة أواني كانوبية فاخرة مصنوعة من الحجر الجيري المنقوش مطابقة لمقابر الأسرة الثامنة عشر بالأقصر.";
              } else if (product.name.includes("Statue") || product.name.includes("Bastet")) {
                localizedName = "مجسم الإلهة باستيت من حجر البازلت الأسود";
                localizedCat = "تماثيل صخرية";
                localizedDesc = "تمثال منحوت بحرفية مذهلة يمثل القطة باستيت رمز الأمان والخصوبة الدافئة في بيوت المصريين القدماء.";
              } else if (product.name.includes("Necklace") || product.name.includes("Cartouche")) {
                localizedName = "قلادة الخرطوشة الملكية المذهبة عيار 18";
                localizedCat = "مجوهرات وحلي";
                localizedDesc = "خرطوشة تراثية فاخرة مصنعة باسم السائح المطلوب وصائغي خان الخليلي بالقاهرة.";
              } else if (product.name.includes("Alabaster") || product.name.includes("Urn")) {
                localizedName = "مزهرية حجر الألبستر والمرمر المنقوش";
                localizedCat = "منسوجات وتحف";
                localizedDesc = "إناء رخامي ملوكي منحوت يدوياً بوهج دافئ للغرف وتناغم صخور جبل القرنة العريق بالأقصر.";
              }
            }

            return (
              <div
                key={product.id}
                className="bg-[#121212] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative duration-300 transform hover:-translate-y-1"
              >
                
                {/* Product Card Top Visual */}
                <div 
                  className="relative h-64 bg-zinc-900 overflow-hidden border-b border-[#D4AF37]/10" 
                  onClick={() => setActiveProductModal({ ...product, name: localizedName, description: localizedDesc, category: localizedCat })}
                >
                  <img 
                    src={product.image_urls[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'} 
                    alt={localizedName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category tag */}
                  <div className="absolute top-4 left-4 bg-black/85 border border-[#D4AF37]/35 text-[#D4AF37] text-[9px] tracking-widest uppercase font-black px-2 py-0.5 rounded shadow">
                    {localizedCat}
                  </div>

                  {/* Rating element */}
                  <div className="absolute bottom-3 left-3 bg-black/90 border border-[#D4AF37]/20 text-white font-semibold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono shadow-sm">
                    <Star size={11} className="text-[#D4AF37] fill-[#D4AF37]" />
                    {product.rating}
                  </div>

                  {/* Sell alert stock */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-white font-mono text-xs font-bold tracking-widest border border-[#D4AF37] p-2 uppercase">
                        {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Body details */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-[#121212]">
                  <div className="space-y-2 cursor-pointer" onClick={() => setActiveProductModal({ ...product, name: localizedName, description: localizedDesc, category: localizedCat })}>
                    <h3 className="font-serif text-sm font-bold text-white line-clamp-1 group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {localizedName}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed text-stone-400">
                      {localizedDesc}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-550 font-bold block uppercase tracking-wider">{language === 'ar' ? 'سعر التوريد' : 'Price cost'}</span>
                      <span className="text-base font-bold text-[#D4AF37] font-sans">${product.price} <span className="text-[9px] text-gray-400 font-mono">USD</span></span>
                    </div>
                    
                    {/* Cart CTA Trigger */}
                    <button
                      id={`add-to-cart-btn-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ ...product, name: localizedName, description: localizedDesc, category: localizedCat });
                      }}
                      disabled={product.stock === 0}
                      className="p-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] disabled:bg-zinc-900 disabled:text-zinc-650 disabled:border-zinc-800 text-slate-950 transition-all flex items-center justify-center gap-1 border border-amber-600/10 hover:shadow-md cursor-pointer duration-200"
                      title="Add relic to shopping cart"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================================
          PRODUCT INFO EXPANSION DETAILED MODAL
          ========================================================== */}
      {activeProductModal && (
        <div id="product-detail-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative border border-[#D4AF37]/35 flex flex-col md:flex-row max-h-[90vh] md:max-h-none">
            
            {/* Close */}
            <button
              id="close-product-modal"
              onClick={() => setActiveProductModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Left Col Visual */}
            <div className="md:w-1/2 h-72 md:h-auto overflow-hidden bg-zinc-900 relative shrink-0">
              <img 
                src={activeProductModal.image_urls[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'} 
                alt={activeProductModal.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 bg-black/85 text-[#D4AF37] border border-[#D4AF37]/30 font-mono font-medium text-[10px] px-2.5 py-1 rounded">
                {language === 'ar' ? 'تحفة فنية معتمدة يدوياً' : 'Authentic Certified Artifact'}
              </div>
            </div>

            {/* Right Col Meta */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-black text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2.5 py-1 rounded-full tracking-widest inline-block select-none border border-[#D4AF37]/20">
                  {language === 'ar' ? `كتالوج ${activeProductModal.category}` : `${activeProductModal.category} Catalog`}
                </span>
                <h2 className="text-xl md:text-2xl font-serif text-white font-bold leading-tight">
                  {activeProductModal.name}
                </h2>
                
                {/* Rating star view */}
                <div className="flex items-center gap-1 text-xs font-mono text-gray-500">
                  <div className="flex text-[#D4AF37]">
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                  </div>
                  <span>({activeProductModal.rating} {language === 'ar' ? 'تقييم زوار معتمد' : 'Verified Rating'})</span>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans pt-2">
                  {activeProductModal.description}
                </p>

                <div className="space-y-2 bg-black/50 border border-[#D4AF37]/20 p-4 rounded-xl text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === 'ar' ? 'الوفرة بالمخزن:' : 'Stock Availability:'}</span>
                    <span className={`font-mono font-bold ${activeProductModal.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {activeProductModal.stock > 0 
                        ? (language === 'ar' ? `متوفر (${activeProductModal.stock} قطع)` : `${activeProductModal.stock} units remaining`) 
                        : (language === 'ar' ? 'نفذت الكمية' : 'Out of stock')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === 'ar' ? 'ائتلاف ورش التبادل:' : 'Maker Heritage Guild:'}</span>
                    <span className="font-medium text-[#D4AF37]">
                      {language === 'ar' ? 'كبار الحرفيين التقليديين بمصر العليا والجمالية' : 'Traditional Cairo Artisans'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase action bottom */}
              <div className="mt-8 pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-gray-505 font-bold uppercase tracking-widest block">{language === 'ar' ? 'تكلفة الاقتناء' : 'Relic Cost'}</span>
                  <span className="text-2xl font-serif font-bold text-[#D4AF37]">${activeProductModal.price} <span className="text-[11px] font-mono text-gray-400">USD</span></span>
                </div>
                <button
                  id="checkout-modal-add-btn"
                  onClick={() => {
                    addToCart(activeProductModal);
                    setActiveProductModal(null);
                  }}
                  disabled={activeProductModal.stock === 0}
                  className="flex-1 max-w-[180px] py-3.5 bg-[#D4AF37] hover:bg-[#F3E5AB] border border-[#D4AF37]/30 text-black font-bold rounded-xl text-xs tracking-wider uppercase transition-all disabled:bg-zinc-900 disabled:text-zinc-650 disabled:border-zinc-800 flex items-center justify-center gap-2 duration-200 cursor-pointer"
                >
                  <ShoppingCart size={15} /> {language === 'ar' ? 'إضافة للسلة' : 'Add To Basket'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
