import React, { useState } from 'react';
import { ShoppingBag, Shield, User, Database, LogOut, Sparkles, X, Key, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentView: string;
  onSetView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onSetView }) => {
  const { user, role, logout, loginAsRole, loginWithCredentials, registerAccount, isDbConfigured } = useAuth();
  const { cartCount } = useCart();
  const { language, setLanguage, t } = useTranslation();

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Login Modal State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsLoading] = useState(false);

  const links = [
    { id: 'home', labelKey: 'home' },
    { id: 'explore', labelKey: 'explore' },
    { id: 'tours', labelKey: 'tours' },
    { id: 'store', labelKey: 'store' },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (authMode === 'register') {
        const result = await registerAccount(cleanEmail, cleanPassword, fullName.trim());
        if (result.success) {
          setLoginSuccess(t('register_success'));
          setAuthMode('login');
          setPassword('');
        } else {
          setLoginError(result.error || t('register_failed'));
        }
        return;
      }

      const success = await loginWithCredentials(cleanEmail, cleanPassword);
      if (success) {
        setIsLoginOpen(false);
        setEmail('');
        setPassword('');
        setFullName('');
        if (cleanEmail === 'admin@gmail.com') {
          onSetView('admin_dashboard');
        } else {
          onSetView('user_dashboard');
        }
      } else {
        setLoginError(t('invalid_credentials'));
      }
    } catch {
      setLoginError(t('invalid_credentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const isRtl = language === 'ar';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a] text-[#e5e7eb] border-b border-[#D4AF37]/25 shadow-xl">
      {/* Top Warning/Status Bar */}
      <div className="w-full bg-[#070707] text-[#D4AF37] border-b border-[#D4AF37]/10 text-xs px-4 py-1.5 font-medium flex justify-between items-center sm:px-6">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="animate-pulse flex-shrink-0" />
          <span className="truncate max-w-[220px] xs:max-w-none text-[10px] sm:text-xs">{t('experience_banner')}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-black/60 border border-[#D4AF37]/25 rounded-md px-1 py-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                language === 'en' ? 'bg-[#D4AF37] text-black font-extrabold' : 'text-stone-400 hover:text-[#D4AF37]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors font-arabic ${
                language === 'ar' ? 'bg-[#D4AF37] text-black font-extrabold' : 'text-stone-400 hover:text-[#D4AF37]'
              }`}
            >
              العربية
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-2.5">
          
          {/* Logo */}
          <div 
            onClick={() => {
              onSetView('home');
              setIsMobileMenuOpen(false);
            }} 
            className="flex flex-col items-start cursor-pointer group"
          >
            <span className="text-lg sm:text-2xl font-serif tracking-[0.2em] sm:tracking-[0.3em] text-[#D4AF37] font-black group-hover:text-[#D4AF37]/80 transition-colors uppercase">
              Nefertari
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] sm:tracking-[0.4em] text-stone-400 pl-0.5 uppercase group-hover:text-[#D4AF37]/60 transition-colors">
              نفرتاري • ROYAL PASSAGE
            </span>
          </div>

          {/* Nav Links - Desktop only */}
          <nav className="hidden md:flex items-center gap-1.5">
            {links.map((link) => (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                onClick={() => onSetView(link.id)}
                className={`px-3.5 py-2 rounded-md text-xs tracking-[0.15em] font-semibold transition-all uppercase ${
                  currentView === link.id
                    ? 'text-[#D4AF37] bg-[#070707] border-b-2 border-[#D4AF37]'
                    : 'text-stone-300 hover:text-[#D4AF37] hover:bg-zinc-900/60'
                } ${language === 'ar' ? 'font-arabic' : ''}`}
              >
                {t(link.labelKey)}
              </button>
            ))}
          </nav>

          {/* Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Role Switcher Toggle - Desktop only */}
            <div className="hidden lg:flex bg-[#070707] border border-[#D4AF37]/20 rounded-lg px-2 py-1 items-center gap-1 text-[11px]">
              <span className="text-stone-400 font-mono text-[9px] mr-1 uppercase">Role Dev Toggle:</span>
              <button
                id="toggle-role-user"
                onClick={() => loginAsRole('user')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all uppercase ${
                  role === 'user' ? 'bg-[#D4AF37] text-black font-bold' : 'text-stone-300 hover:bg-zinc-900'
                }`}
              >
                User
              </button>
              <button
                id="toggle-role-admin"
                onClick={() => loginAsRole('admin')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all uppercase ${
                  role === 'admin' ? 'bg-[#D4AF37] text-black font-bold' : 'text-stone-300 hover:bg-zinc-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => {
                onSetView('cart');
                setIsMobileMenuOpen(false);
              }}
              className="p-2 text-[#e5e7eb] hover:text-[#D4AF37] hover:bg-[#070707] rounded-full transition-all relative flex items-center justify-center border border-transparent hover:border-[#D4AF37]/20 cursor-pointer"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Cabinet Dashboard and Credentials Gate info - Desktop only */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <button
                  id="header-dashboard-btn"
                  onClick={() => onSetView(role === 'admin' ? 'admin_dashboard' : 'user_dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    role === 'admin' 
                      ? 'bg-black text-[#D4AF37] border-[#D4AF37]/45 hover:bg-[#D4AF37]/10' 
                      : 'bg-black text-[#D4AF37] border-[#D4AF37]/35 hover:bg-[#D4AF37]/10'
                  }`}
                >
                  {role === 'admin' ? <Shield size={13} /> : <User size={13} />}
                  <span className="max-w-[80px] truncate">{user.full_name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    onSetView('home');
                  }}
                  className="p-1 px-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 cursor-pointer text-xs flex items-center gap-1 transition-colors"
                  title={t('logout')}
                >
                  <LogOut size={12} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setLoginError(null);
                  setIsLoginOpen(true);
                }}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase bg-[#D4AF37] text-black hover:bg-[#F3E5AB] cursor-pointer transition-all tracking-wider"
              >
                <Key size={13} />
                <span>{t('sign_in')}</span>
              </button>
            )}

            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#e5e7eb] hover:text-[#D4AF37] hover:bg-[#070707] rounded-lg border border-[#D4AF37]/20 transition-all cursor-pointer flex items-center justify-center bg-black/40"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Side Drawer Content */}
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`relative z-10 w-4/5 max-w-sm h-full bg-[#0d0d0d] border-${isRtl ? 'r' : 'l'} border-[#D4AF37]/35 shadow-2xl p-6 flex flex-col justify-between`}
            >
              <div className="flex flex-col gap-6 overflow-y-auto">
                {/* Header inside Drawer */}
                <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-serif tracking-[0.2em] text-[#D4AF37] font-extrabold uppercase">
                      Nefertari
                    </span>
                    <span className="text-[8px] font-mono tracking-[0.3em] text-stone-400 uppercase">
                      نفرتاري • ROYAL PASSAGE
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-stone-400 hover:text-[#D4AF37] hover:bg-zinc-900 border border-[#D4AF37]/20 rounded-md transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation Links inside Drawer */}
                <nav className="flex flex-col gap-2">
                  {links.map((link) => (
                    <button
                      key={link.id}
                      id={`nav-mob-drawer-${link.id}`}
                      onClick={() => {
                        onSetView(link.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-xs tracking-[0.15em] font-bold text-start transition-all uppercase flex items-center justify-between ${
                        currentView === link.id
                          ? 'text-[#D4AF37] bg-[#070707] border-b-2 border-[#D4AF37] shadow-md'
                          : 'text-stone-300 hover:text-[#D4AF37] hover:bg-zinc-900/60'
                      } ${language === 'ar' ? 'font-arabic' : ''}`}
                    >
                      <span>{t(link.labelKey)}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40"></span>
                    </button>
                  ))}
                </nav>

                {/* Divider & Account Controls */}
                <div className="border-t border-[#D4AF37]/10 pt-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-black border border-[#D4AF37]/15 rounded-xl flex items-center gap-3">
                        <div className="p-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full">
                          {role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="text-[9px] font-mono uppercase text-stone-400">
                            {role === 'admin' ? t('admin_dashboard') : t('user_dashboard')}
                          </span>
                          <span className="text-xs font-bold text-stone-200 truncate">{user.full_name}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            onSetView(role === 'admin' ? 'admin_dashboard' : 'user_dashboard');
                            setIsMobileMenuOpen(false);
                          }}
                          className={`py-2.5 bg-black text-[#D4AF37] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-center text-[11px] font-extrabold uppercase transition-all tracking-wider cursor-pointer ${language === 'ar' ? 'font-arabic' : ''}`}
                        >
                          {role === 'admin' ? t('admin_dashboard').split(' ')[0] : t('user_dashboard').split(' ')[0]}
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            onSetView('home');
                            setIsMobileMenuOpen(false);
                          }}
                          className={`py-2.5 bg-red-950/20 hover:bg-red-950/35 text-red-400 border border-red-900/40 rounded-xl text-center text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${language === 'ar' ? 'font-arabic' : ''}`}
                        >
                          <LogOut size={12} />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setLoginError(null);
                        setIsLoginOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-extrabold uppercase tracking-widest rounded-xl cursor-pointer text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Key size={14} />
                      <span>{t('sign_in')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Drawer Footer controls */}
              <div className="border-t border-[#D4AF37]/15 pt-4 space-y-4">
                {/* Embedded Role Dev Toggle in mobile menu */}
                <div className="bg-black/90 border border-[#D4AF37]/20 rounded-xl p-3">
                  <span className="block text-[8px] font-mono tracking-widest text-stone-400 text-center uppercase mb-2">
                    Developer Role Switcher
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="drawer-toggle-role-user"
                      onClick={() => loginAsRole('user')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase ${
                        role === 'user' ? 'bg-[#D4AF37] text-black font-extrabold' : 'text-stone-300 hover:bg-zinc-950 bg-black/40'
                      }`}
                    >
                      User
                    </button>
                    <button
                      id="drawer-toggle-role-admin"
                      onClick={() => loginAsRole('admin')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase ${
                        role === 'admin' ? 'bg-[#D4AF37] text-black font-extrabold' : 'text-stone-300 hover:bg-zinc-950 bg-black/40'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {/* Embedded Language switcher inside mobile nav */}
                <div className="flex bg-black/90 border border-[#D4AF37]/20 rounded-xl p-1.5 justify-between items-center">
                  <span className="text-[10px] font-mono text-stone-400 px-2 uppercase">Language:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                        language === 'en' ? 'bg-[#D4AF37] text-black font-extrabold' : 'text-stone-400 hover:text-[#D4AF37]'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ar');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors font-arabic ${
                        language === 'ar' ? 'bg-[#D4AF37] text-black font-extrabold' : 'text-stone-400 hover:text-[#D4AF37]'
                      }`}
                    >
                      العربية
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Royal Passport Authentication Gate Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#121212] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-[#D4AF37] transition-colors p-1"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <span className="inline-block p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mb-3">
                <Key size={24} />
              </span>
              <h3 className="text-xl font-bold font-serif text-[#D4AF37] uppercase tracking-wide">
                {authMode === 'login' ? t('sign_in_title') : t('register_title')}
              </h3>
              <p className="text-stone-400 text-xs mt-1">
                {authMode === 'login' ? t('login_title') : t('register_subtitle')}
              </p>
            </div>

            <div className="flex mb-5 bg-black/50 border border-[#D4AF37]/20 rounded-xl p-1">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setLoginError(null); setLoginSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
                  authMode === 'login' ? 'bg-[#D4AF37] text-black' : 'text-stone-400 hover:text-[#D4AF37]'
                }`}
              >
                {t('sign_in')}
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setLoginError(null); setLoginSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
                  authMode === 'register' ? 'bg-[#D4AF37] text-black' : 'text-stone-400 hover:text-[#D4AF37]'
                }`}
              >
                {t('register_btn')}
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-widest mb-1.5">
                    {t('full_name')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('full_name')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black text-white border border-[#D4AF37]/25 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-widest mb-1.5">
                  {t('enter_email')}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black text-white border border-[#D4AF37]/25 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-widest mb-1.5">
                  {t('enter_password')}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black text-white border border-[#D4AF37]/25 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/30 border border-red-500/35 rounded-xl text-red-300 text-xs font-medium">
                  {loginError}
                </div>
              )}

              {loginSuccess && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/35 rounded-xl text-emerald-300 text-xs font-medium">
                  {loginSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold uppercase tracking-wider rounded-xl cursor-pointer text-xs transition-colors"
              >
                {isSubmitting
                  ? (authMode === 'login' ? 'Authenticating...' : 'Creating account...')
                  : (authMode === 'login' ? t('sign_in_btn') : t('register_submit'))}
              </button>

              {authMode === 'login' && (
                <p className="text-[10px] text-stone-500 text-center leading-relaxed">
                  {t('sign_in_help')}
                </p>
              )}
            </form>

          </div>
        </div>
      )}
    </header>
  );
};
