import React from 'react';
import { ShoppingBag, ShieldCheck, Database, Gift, Search, Heart, Sparkles } from 'lucide-react';
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
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b-2 border-brand-dark px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo matching STICKERZ in reference */}
          <div
            onClick={() => handleNavClick('home', 'home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-display font-black text-lg transform group-hover:-rotate-6 transition-transform">
              ★
            </div>
            <span className="font-display font-black text-2xl tracking-tighter text-brand-dark">
              STICKER<span className="text-[#FF6EB4]">Z</span>
            </span>
          </div>

          {/* Center Navigation Links matching reference Screen 01/02 */}
          <nav className="hidden md:flex items-center gap-8 font-display font-bold text-sm text-gray-700">
            <button
              onClick={() => handleNavClick('home', 'home')}
              className={`hover:text-black transition-colors ${
                activeNav === 'home' ? 'text-black border-b-2 border-black pb-0.5' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalogue-section', 'shop')}
              className={`hover:text-black transition-colors ${
                activeNav === 'shop' ? 'text-black border-b-2 border-black pb-0.5' : ''
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNavClick('catalogue-section', 'categories')}
              className={`hover:text-black transition-colors ${
                activeNav === 'categories' ? 'text-black border-b-2 border-black pb-0.5' : ''
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('about-section', 'about')}
              className={`hover:text-black transition-colors ${
                activeNav === 'about' ? 'text-black border-b-2 border-black pb-0.5' : ''
              }`}
            >
              About
            </button>
          </nav>

          {/* Right Controls matching mockup */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Supabase Status Pill */}
            <div
              title={isSupabase ? 'Supabase Live Connection' : 'Local Resilient Demo Mode'}
              className={`hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${
                isSupabase ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-amber-100 text-amber-800 border-amber-400'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>{isSupabase ? 'Supabase' : 'Demo Mode'}</span>
            </div>

            {/* Build Your Pack Button matching reference */}
            <button
              id="open-pack-builder-btn"
              onClick={onOpenPackBuilder}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl border-2 border-brand-dark font-display font-bold text-xs sm:text-sm transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 ${
                bonusUnlocked
                  ? 'bg-[#FF6EB4] text-white shadow-neo animate-pulse'
                  : totalBase > 0
                  ? 'bg-[#FACC15] text-brand-dark shadow-neo'
                  : 'bg-white text-brand-dark shadow-neo-sm hover:bg-gray-50'
              }`}
            >
              {bonusUnlocked ? (
                <Gift className="w-4 h-4 animate-bounce" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              <span>
                {totalBase === 0 ? 'Build Your Pack' : `${totalBase}/${rule.base_quantity}`}
                {totalBonus > 0 && ` + ${totalBonus}`}
              </span>
            </button>

            {/* Admin portal shortcut */}
            <button
              id="open-admin-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100 text-brand-dark text-xs font-display font-bold shadow-neo-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Matching Mobile Reference Screens) */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-brand-dark px-4 py-2 flex items-center justify-around text-[10px] font-display font-bold shadow-lg">
        <button
          onClick={() => handleNavClick('home', 'home')}
          className={`flex flex-col items-center gap-1 ${activeNav === 'home' ? 'text-[#FF6EB4]' : 'text-gray-500'}`}
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => handleNavClick('catalogue-section', 'shop')}
          className={`flex flex-col items-center gap-1 ${activeNav === 'shop' ? 'text-[#FF6EB4]' : 'text-gray-500'}`}
        >
          <span className="text-base">🛍️</span>
          <span>Shop</span>
        </button>
        <button
          onClick={onOpenPackBuilder}
          className="relative flex flex-col items-center gap-1 text-black"
        >
          <div className="w-8 h-8 rounded-full bg-[#FACC15] border-2 border-black flex items-center justify-center -mt-4 shadow-neo-sm">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-[10px]">Pack ({totalItems})</span>
        </button>
        <button
          onClick={onOpenAiVibe}
          className="flex flex-col items-center gap-1 text-purple-600"
        >
          <span className="text-base">✨</span>
          <span>AI Vibe</span>
        </button>
        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center gap-1 text-gray-500"
        >
          <span className="text-base">🔒</span>
          <span>Admin</span>
        </button>
      </nav>
    </>
  );
};
