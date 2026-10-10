import React from 'react';
import { ShoppingBag, ShieldCheck, Database, Gift, Sparkles } from 'lucide-react';
import { PackSelectionState, PackRule } from '../types';
import { isBonusUnlocked } from '../lib/packRules';
import { storeService } from '../services/storeService';
import { groqService } from '../services/groqService';

interface NavbarProps {
  selection: PackSelectionState;
  rule: PackRule;
  onOpenPackBuilder: () => void;
  onOpenAdmin: () => void;
  onNavigateHome: () => void;
  onOpenAiVibe: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selection,
  rule,
  onOpenPackBuilder,
  onOpenAdmin,
  onNavigateHome,
  onOpenAiVibe,
  activeNav,
  setActiveNav,
}) => {
  const totalBase = selection.baseStickerIds.length;
  const totalBonus = selection.bonusStickerIds.length;
  const totalItems = totalBase + totalBonus;
  const bonusUnlocked = isBonusUnlocked(selection.baseStickerIds, rule);
  const isSupabase = storeService.isConnectedToSupabase;
  const hasGroq = groqService.isAvailable();

  const handleNavClick = (sectionId: string, navName: string) => {
    setActiveNav(navName);
    if (sectionId === 'home') {
      onNavigateHome();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Desktop / Main Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-soft-xs px-4 py-3 sm:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo with modern aesthetic badge */}
          <div
            onClick={() => handleNavClick('home', 'home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-purple-950 to-[#FF6EB4] text-white flex items-center justify-center font-display font-black text-lg shadow-soft group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
              <span className="text-yellow-300">★</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
                STICKER<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6EB4] to-purple-600">VERSE</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase -mt-0.5">
                Curated Vinyl Studio
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-black/[0.04] font-display font-semibold text-xs text-slate-600">
            <button
              onClick={() => handleNavClick('home', 'home')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                activeNav === 'home'
                  ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalogue-section', 'shop')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                activeNav === 'shop'
                  ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Shop Collection
            </button>
            <button
              onClick={() => handleNavClick('offer-explainer-section', 'offer')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                activeNav === 'offer'
                  ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              How 10+2 Works
            </button>
            <button
              onClick={onOpenAiVibe}
              className="px-3.5 py-1.5 rounded-full text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4] animate-pulse" />
              <span>AI Vibe Stylist</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Supabase Status Pill */}
            <div
              title={isSupabase ? 'Supabase Live Connection' : 'Local Resilient Demo Mode'}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold border ${
                isSupabase
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>{isSupabase ? 'Supabase' : 'Demo Mode'}</span>
            </div>

            {/* Build Your Pack Button */}
            <button
              id="open-pack-builder-btn"
              onClick={onOpenPackBuilder}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-display font-bold text-xs sm:text-sm transition-all duration-200 ${
                bonusUnlocked
                  ? 'bg-gradient-to-r from-[#FF6EB4] to-purple-600 text-white shadow-glow-pink/40 animate-pulse-subtle'
                  : totalBase > 0
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-soft-md'
                  : 'bg-white text-slate-800 border border-black/10 hover:border-black/20 hover:bg-slate-50 shadow-soft-xs'
              }`}
            >
              {bonusUnlocked ? (
                <Gift className="w-4 h-4 text-yellow-300" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              <span>
                {totalBase === 0 ? 'My Pack (0/10)' : `${totalBase}/${rule.base_quantity}`}
                {totalBonus > 0 && ` +${totalBonus} Free`}
              </span>
            </button>

            {/* Admin portal shortcut */}
            <button
              id="open-admin-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/10 bg-white hover:bg-slate-50 text-slate-700 text-xs font-display font-semibold shadow-soft-xs hover:border-black/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-black/[0.08] px-4 py-2 flex items-center justify-around text-[10px] font-display font-bold shadow-soft-lg">
        <button
          onClick={() => handleNavClick('home', 'home')}
          className={`flex flex-col items-center gap-0.5 ${activeNav === 'home' ? 'text-[#FF6EB4]' : 'text-slate-500'}`}
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => handleNavClick('catalogue-section', 'shop')}
          className={`flex flex-col items-center gap-0.5 ${activeNav === 'shop' ? 'text-[#FF6EB4]' : 'text-slate-500'}`}
        >
          <span className="text-base">🛍️</span>
          <span>Shop</span>
        </button>
        <button
          onClick={onOpenPackBuilder}
          className="relative flex flex-col items-center gap-0.5 text-slate-900"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FF6EB4] to-purple-600 text-white flex items-center justify-center -mt-4 shadow-soft-md border-2 border-white">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-[10px]">Pack ({totalItems})</span>
        </button>
        <button
          onClick={onOpenAiVibe}
          className="flex flex-col items-center gap-0.5 text-purple-600"
        >
          <span className="text-base">✨</span>
          <span>AI Vibe</span>
        </button>
        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center gap-0.5 text-slate-500"
        >
          <span className="text-base">🔒</span>
          <span>Admin</span>
        </button>
      </nav>
    </>
  );
};
