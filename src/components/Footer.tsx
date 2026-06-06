import React from 'react';
import { Compass, Mail, Phone, MapPin, Landmark, Heart, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onSetView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSetView }) => {
  return (
    <footer className="bg-[#070707] text-stone-300 border-t border-[#D4AF37]/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Leftmost branding */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col">
            <span className="text-2xl font-serif tracking-[0.3em] text-[#D4AF37] font-bold uppercase">
              NEFERTARI
            </span>
            <span className="text-xs font-mono tracking-[0.45em] text-[#D4AF37]/60 uppercase">
              نفرتاري • ROYAL PASSAGE
            </span>
          </div>
          <p className="text-sm font-sans leading-relaxed text-stone-400 max-w-md">
            Our mission is to safeguard, catalog, and share the eternal wonders of ancient Egyptian history. Working with local guilds, traditional craftsmen, and certified Egyptological historical scholars to bring custom tours and authentic handicraft relics directly to you.
          </p>
          <div className="flex gap-4 pt-2">
            <div className="p-2 rounded-lg bg-zinc-900/60 text-[#D4AF37] hover:text-white border border-[#D4AF37]/20 cursor-pointer">
              <Compass size={18} />
            </div>
            <div className="p-2 rounded-lg bg-zinc-900/60 text-[#D4AF37] hover:text-white border border-[#D4AF37]/20 cursor-pointer">
              <Landmark size={18} />
            </div>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="font-serif text-sm font-semibold text-stone-100 uppercase tracking-widest border-b border-[#D4AF37]/10 pb-3 mb-4">
            Destinations
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button onClick={() => onSetView('explore')} className="hover:text-[#D4AF37] text-stone-400 font-sans tracking-wide">
                Giza & Cairo Plateau
              </button>
            </li>
            <li>
              <button onClick={() => onSetView('explore')} className="hover:text-[#D4AF37] text-stone-400 font-sans tracking-wide">
                Luxor East & West Banks
              </button>
            </li>
            <li>
              <button onClick={() => onSetView('explore')} className="hover:text-[#D4AF37] text-stone-400 font-sans tracking-wide">
                Aswan Philae Sanctuary
              </button>
            </li>
            <li>
              <button onClick={() => onSetView('explore')} className="hover:text-[#D4AF37] text-stone-400 font-sans tracking-wide">
                Marine Reserves of Sinai
              </button>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="font-serif text-sm font-semibold text-stone-100 uppercase tracking-widest border-b border-[#D4AF37]/10 pb-3 mb-4">
            Contact Bureau
          </h3>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-center gap-2.5 text-stone-400">
              <MapPin size={16} className="text-[#D4AF37] shrink-0" />
              <span className="font-sans leading-tight">Ministry of Tourism St, Heliopolis, Cairo, EG</span>
            </li>
            <li className="flex items-center gap-2.5 text-stone-400">
              <Phone size={16} className="text-[#D4AF37]" />
              <span className="font-sans tracking-wide">+20 (2) 2345 6789</span>
            </li>
            <li className="flex items-center gap-2.5 text-stone-400">
              <Mail size={16} className="text-[#D4AF37]" />
              <span className="font-sans tracking-wide">heritage@nefertari.gov.eg</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-zinc-900 border-[#D4AF37]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-stone-500 font-mono">
          &copy; {new Date().getFullYear()} NEFERTARI INC. ALL RIGHTS RESERVED. REGISTERED WITH THE MINISTRY OF CULTURAL ANTIQUITIES.
        </p>
        <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
          <span>Made with</span>
          <Heart size={12} className="text-red-600 fill-red-600" />
          <span>in Egypt</span>
          <span className="mx-2">•</span>
          <div className="flex items-center gap-1">
            <ShieldAlert size={12} />
            <span>RLS Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
