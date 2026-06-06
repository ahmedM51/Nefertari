import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header & Navigation
    'home': 'Home',
    'explore': 'Explore Egypt',
    'tours': 'Tours',
    'store': 'Heritage Store',
    'cart': 'Cart',
    'logout': 'Logout',
    'admin_dashboard': 'Admin Console',
    'user_dashboard': 'User Desktop',
    'sign_in': 'Sign In',
    'welcome': 'Welcome',
    'login_title': 'Passport Portal Auth',
    'database_active': 'Supabase PostgreSQL Active',
    'demo_mode': 'Demoland Mode (Simulated DB)',
    'experience_banner': 'Experience Ancient Egyptian Majesty & Tourism Heritage',
    'sign_in_title': 'Sign In with Passport',
    'enter_email': 'Passport Email Address',
    'enter_password': 'Security Authorization Code',
    'sign_in_btn': 'Authorize Passage',
    'sign_in_help': 'Login as Admin: admin@gmail.com / ADMIN1234. Any other email logs in as User.',
    'invalid_credentials': 'Invalid credentials. Please inspect entry coordinates.',

    // Home Screen
    'hero_title': 'Nefertari Heritage',
    'hero_subtitle': 'Bespoke Royal Expeditions & Handcrafted Antiquities',
    'hero_desc': 'Trace the sacred footsteps of pharaohs, book coordinates to hidden tombs in Luxor, and purchase certified reproductions directly from regional guilds.',
    'explore_button': 'Explore Sacred Landmarks',
    'popular_monuments': 'Sacred Monuments Collection',
    'popular_monuments_sub': 'Curated historical sites and structural marvels from antiquity',
    'experience_tours': 'Immersive Guided Expeditions',
    'experience_tours_sub': 'Secure your royal passage with Egyptologist scholars',
    'explore_bazaar': 'Imperial Pharaonic Bazaar',
    'explore_bazaar_sub': 'Support legacy guilds holding generation-old craft secrets',
    'view_all': 'View Full Collection',
    'book_now': 'Book Expedition',
    'buy_handcrafts': 'Browse Pharaonic Bazaar',

    // Explore / Monuments Map
    'search_placeholder': 'Filter sacred monuments, sites, temples...',
    'governorate': 'Governorate Location',
    'all_regions': 'All Legacy Governorates',
    'historical': 'Historical Site',
    'temple': 'Sacred Temple Sanctuary',
    'tomb': 'Royal Vault / Tomb',
    'museum': 'Heritage Sanctuary Museum',
    'read_chronicle': 'Decode Chronicle Detail',
    'opening_hours': 'Operating Timings',
    'ticket_prices': 'Entry coordinates ticket costs',
    'foreign_adult': 'Foreign Visitor Access',
    'egyptian_adult': 'Egyptian National Access',
    'book_tour_associated': 'Associated Expeditions & Passages',
    'back_to_explore': 'Back to Explorer Cartography',

    // Tours / Expeditions
    'tour_search': 'Search active tour caravans...',
    'slots_left': 'seats remaining',
    'days': 'days itinerary',
    'slots_count': 'Caravan Open Slots',
    'price_usd': 'Passage Price (USD)',
    'expedition_itinerary': 'Expedition Sacred Itinerary',
    'day_prefix': 'Day Coordinates',
    'initiate_booking': 'Configure Caravan Ticket Booking',
    'travel_date': 'Target Departure Date',
    'party_size': 'Number of Caravan Travelers',
    'alt_phone': 'Alternate Notification Phone',
    'notes': 'Special accommodations / Royal requests',
    'submit_booking': 'File Royal Expedition Reservation',
    'people': 'travelers',

    // Heritage Store
    'store_title': 'Imperial Pharaonic Bazaar',
    'store_subtitle': 'Genuine handcrafted sculptures, papyrus paintings, and royal accessories',
    'all_categories': 'All Legacy Guilds',
    'category_statues': 'Sculptured Monoliths',
    'category_papyrus': 'Papyrus Illustrated Art',
    'category_accessories': 'Jewelry Jewelry & Relics',
    'add_to_cart': 'Apportion to Basket',
    'out_of_stock': 'Antiquity Depleted',
    'items_left': 'relics remaining',
    'search_goods': 'Search Pharaonic relics catalog...',

    // Basket & Cart
    'basket_title': 'Your Imperial Selection Basket',
    'empty_basket_desc': 'No precious relics or caravan departures are queued in your session.',
    'review_selection': 'Review Your Legacy Handcrafts',
    'shipping_coor': 'Physical Delivery Coordinates',
    'shipping_address_placeholder': 'Enter full physical street address for safe courier arrival...',
    'full_name_on_receipt': 'Recipient Dignitary Name',
    'checkout_summary': 'Checkout Passage Valuation',
    'subtotal': 'Guild Artifacts Valuation',
    'shipping_cost': 'Courier Caravan Fee',
    'free': 'Complimentary Gift',
    'total_price_usd': 'Total Imperial Sacrifices (USD)',
    'execute_order': 'Process Sacred Relics Delivery Order',
    'continue_journey': 'Continue Heritage Journey',

    // Dashboards
    'personal_coordinates': 'Tourist Account Coordinates',
    'full_name': 'Full Registered Name',
    'phone': 'Registry Mobile Contact',
    'address': 'Durable Lodging Address',
    'save_changes': 'Confirm Register Coordinates',
    'tour_receipts': 'Expedition Caravan Registries',
    'order_receipts': 'Legacy Relics Acquisition Orders',
    'order_id': 'Acquisition ID',
    'total_payment': 'Processed Amount',
    'travelers_count': 'travelers',
    'registered_date': 'Indexed Date',
    'status_pending': 'Pending Review',
    'status_confirmed': 'Confirmed Passage',
    'status_rejected': 'Passage Cancelled',
    'status_delivered': 'Delivered Successfully',
    'status_shipped': 'In Courier Transit',
    'status_processing': 'Preparing Dispatch',
    
    // Admin dashboard specific translations
    'admin_kpi': 'Metrics oversight',
    'admin_monuments': 'Monuments',
    'admin_tours': 'Tours packages',
    'admin_products': 'Products inventory',
    'admin_bookings': 'Tour Bookings',
    'admin_orders': 'Merchant Orders',
  },
  ar: {
    // Header & Navigation
    'home': 'الرئيسية',
    'explore': 'استكشف مصر',
    'tours': 'الرحلات السياحية',
    'store': 'متجر التراث',
    'cart': 'العربة',
    'logout': 'تسجيل الخروج',
    'admin_dashboard': 'بوابة الإشراف',
    'user_dashboard': 'بوابة السائح',
    'sign_in': 'تسجيل الدخول',
    'welcome': 'مرحباً بك',
    'login_title': 'بوابة أوراق الاعتماد',
    'database_active': 'قاعدة بيانات سوبابيز نشطة',
    'demo_mode': 'نمط المحاكاة (المحلي)',
    'experience_banner': 'عِش جلالة وعظمة مصر القديمة والتراث السياحي الفريد',
    'sign_in_title': 'تسجيل الدخول عبر جواز السفر',
    'enter_email': 'البريد الإلكتروني المسجل',
    'enter_password': 'شفرة المرور الأمنية',
    'sign_in_btn': 'اعتماد الولوج والعبور',
    'sign_in_help': 'للدخول كمسؤول: admin@gmail.com / الشفرة ADMIN1234. أي بريد آخر يدخل كحساب سائح عادي.',
    'invalid_credentials': 'الإحداثيات المدخلة غير صحيحة. يرجى مراجعة بيانات جواز السفر.',

    // Home Screen
    'hero_title': 'تراث نفرتاري',
    'hero_subtitle': 'رحلات ملكية خاصة ومصوغات تراثية فريدة يدوية الصنع',
    'hero_desc': 'تتبع خطى الفراعنة والمقابر الملكية الساحرة، واحجز تذاكر مقاعدك في الأقصر، واقتنِ أهم التحف والمنحوتات المعتمدة من نقابات الحرف اليدوية الرائدة مباشرة.',
    'explore_button': 'استكشف الأثر التاريخي الفرعوني',
    'popular_monuments': 'مجموعة المعالم والأوابد الفرعونية',
    'popular_monuments_sub': 'مواقع أثرية مختارة وعجائب معمارية ساحرة من أعماق التاريخ القديم',
    'experience_tours': 'البعثات والرحلات الإرشادية الغامرة',
    'experience_tours_sub': 'أمّن عبورك الملكي برفقة كبار علماء وخبراء المصريات',
    'explore_bazaar': 'البازار الإمبراطوري الملكي',
    'explore_bazaar_sub': 'ادعم نقابات المهن التراثية التاريخية وحافظ على أسرار الصنعة الأزلية',
    'view_all': 'عرض المجموعة الكاملة',
    'book_now': 'احجز الرحلة الإرشادية',
    'buy_handcrafts': 'تصفح معروضات البازار',

    // Explore / Monuments Map
    'search_placeholder': 'ابحث عن المعالم، المعابد، المقابر الأثرية والسياحية...',
    'governorate': 'المحافظة الحالية',
    'all_regions': 'جميع محافظات مصر العريقة',
    'historical': 'موقع أثري تاريخي',
    'temple': 'صرح المعبد المقدس',
    'tomb': 'الضريح / المقبرة الملكية',
    'museum': 'صرح المتحف التراثي',
    'read_chronicle': 'قراءة أطلال وسير التاريخ',
    'opening_hours': 'أوقات العمل واستقبال الزوار',
    'ticket_prices': 'أسعار تذاكر العبور والدخول للأثريات',
    'foreign_adult': 'للزائر الأجنبي (بالجنيه)',
    'egyptian_adult': 'للمواطن المصري (بالجنيه)',
    'book_tour_associated': 'البعثات والرحلات المرتبطة بهذا المعلم',
    'back_to_explore': 'العودة لخريطة الاستكشاف',

    // Tours / Expeditions
    'tour_search': 'ابحث في قوافل الرحلات المتاحة...',
    'slots_left': 'مقاعد متبقية',
    'days': 'أيام الرحلة',
    'slots_count': 'المقاعد المتاحة بالقافلة',
    'price_usd': 'تكلفة الفرد الملكية (دولار)',
    'expedition_itinerary': 'المسار الزمني للرحلة الاستكشافية',
    'day_prefix': 'إحداثيات اليوم',
    'initiate_booking': 'تهيئة تفاصيل حجز الرحلة الاستكشافية',
    'travel_date': 'تاريخ المغادرة والتحرك المطلوب',
    'party_size': 'عدد رفاق الرحلة والمرافقين',
    'alt_phone': 'رقم الاتصال المساعد / البديل',
    'notes': 'طلبات ملكية / تجهيزات خاصة مرغوبة',
    'submit_booking': 'إعلان وتسجيل طلب الحجز السياحي',
    'people': 'مسافرين',

    // Heritage Store
    'store_title': 'البازار الإمبراطوري الفرعوني',
    'store_subtitle': 'منحوتات يدوية فريدة، لوحات ورق البردي الرائعة، ومصوغات فرعونية تاريخية معتمدة',
    'all_categories': 'جميع طوائف ونقابات الحرف',
    'category_statues': 'مجسمات ومنحوتات حجرية وملونة',
    'category_papyrus': 'فن لوحات ورق البردي الفريدة',
    'category_accessories': 'مجوهرات وحلي ملوكية ملونة',
    'add_to_cart': 'إضافة لعربة المقتنيات',
    'out_of_stock': 'نفدت القطعة من المخزون',
    'items_left': 'قطع متبقية فقط',
    'search_goods': 'ابحث في بوابة المنتجات والتذكارات الأثرية...',

    // Basket & Cart
    'basket_title': 'عربة المقتنيات الإمبراطورية الخاصة بك',
    'empty_basket_desc': 'لا توجد تذكارات فريدة أو برامج رحلات معلقة في جلستك الحالية.',
    'review_selection': 'مراجعة المنسوجات والتحف التاريخية المحجوزة',
    'shipping_coor': 'إحداثيات وبيانات شحن الطرود',
    'shipping_address_placeholder': 'يرجى كتابة العنوان والمدينة بدقة لتوصيل الشحنة الملكية...',
    'full_name_on_receipt': 'اسم الشخص المستلم بالكامل ثلاثي',
    'checkout_summary': 'تقرير قيمة مقتنيات السلة الكلية',
    'subtotal': 'تقدير المنتجات والمقتنيات',
    'shipping_cost': 'رسوم تحرك قافلة الشحن والتوصيل',
    'free': 'هدية ترحيبية مجانية',
    'total_price_usd': 'مجموع القرابين المقدس (USD)',
    'execute_order': 'تجهيز وتثبيت أمر تسليم التحف الأثرية',
    'continue_journey': 'متابعة الاستكشاف الفرعوني',

    // Dashboards
    'personal_coordinates': 'إحداثيات حساب السائح الكريم',
    'full_name': 'الاسم الكامل المسجل',
    'phone': 'رقم للتواصل المباشر',
    'address': 'موقع الإقامة المعتمد والمعنون',
    'save_changes': 'اعتماد وتثبيت البيانات الشخصية',
    'tour_receipts': 'سجل حجوزات الرحلات الملكية التراثية',
    'order_receipts': 'سجل طلبات واقتناء السلع التراثية الفريدة',
    'order_id': 'معرف الاقتناء والطلب',
    'total_payment': 'إجمالي الرسوم المدفوعة',
    'travelers_count': 'مسافرين',
    'registered_date': 'تاريخ القيد والتأشير',
    'status_pending': 'قيد مراجعة المفتشين',
    'status_confirmed': 'حجز مسجل ومؤكد',
    'status_rejected': 'الطلب ملغى / غير مؤكد',
    'status_delivered': 'تم التسليم وتأكيد العهدة',
    'status_shipped': 'على متن قافلة الشحن والتوصيل',
    'status_processing': 'قيد فرز المقتنيات والتوضيب',
    
    // Admin dashboard specific translations
    'admin_kpi': 'أرقام مؤشرات الأداء الحالية (KPI)',
    'admin_monuments': 'إدارة المعالم الأثرية والمزارات',
    'admin_tours': 'البرامج والرحلات السياحية',
    'admin_products': 'الجرد العام لسلع البازار المعتمدة',
    'admin_bookings': 'التحقق والموافقة على حجوزات السائحين',
    'admin_orders': 'رقابة وتوجيه شحنات مقتنيات البازار',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('nefertari_lang') as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nefertari_lang', lang);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    // Dynamic document body class and direction switch
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    if (dir === 'rtl') {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-arabic');
    }
  }, [dir, language]);

  const t = (key: string): string => {
    const localeDict = translations[language] || translations['en'];
    return localeDict[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used inside a LanguageProvider');
  }
  return context;
};
