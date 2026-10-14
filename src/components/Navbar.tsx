import React from 'react';
import { ShoppingBag, Search, User, Sparkles } from 'lucide-react';
import { PackSelectionState, PackRule } from '../types';
import { isBonusUnlocked } from '../lib/packRules';

interface NavbarProps {
  selection: PackSelectionState;
  rule: PackRule;
  onOpenPackBuilder: () => void;
  onNavigateHome: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selection,
  rule,
  onOpenPackBuilder,
  onNavigateHome,
  activeNav,
  setActiveNav,
}) => {
  const totalBase = selection.baseStickerIds.length;
  const totalBonus = selection.bonusStickerIds.length;
  const totalItems = totalBase + totalBonus;
  const bonusUnlocked = isBonusUnlocked(selection.baseStickerIds, rule);

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
      {/* Top Yellow Announcement Banner matching Mockup */}
      <div className="h-[34px] bg-[#FACC15] flex items-center justify-center text-center text-xs font-mono font-black uppercase tracking-[0.15em] text-black select-none px-4">
        <span>✦&nbsp;&nbsp;PICK 10 · GET 2 BONUS&nbsp;&nbsp;✦</span>
      </div>

      {/* Main Pitch Black Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0A0B0E]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 lg:px-12 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          {/* Logo matching screenshot: STICKERVERSE✦ */}
          <div
            onClick={() => handleNavClick('home', 'shop')}
            className="font-display font-black text-xl sm:text-2xl tracking-tight text-white cursor-pointer select-none flex items-center gap-1 group"
          >
            <span className="tracking-tighter">STICKER<span className="text-[#00F0FF]">VERSE</span></span>
            <span className="text-[#FF2E93] text-lg font-bold">✦</span>
          </div>

          {/* Center Navigation Links matching screenshot */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-display font-bold text-xs sm:text-[13px] text-white/80">
            <button
              onClick={() => handleNavClick('catalogue-section', 'shop')}
              className={`transition-all pb-1 cursor-pointer flex flex-col items-center ${
                activeNav === 'shop'
                  ? 'text-white font-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Shop</span>
              {activeNav === 'shop' && (
                <span className="w-full h-0.5 bg-[#00F0FF] rounded-full mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('catalogue-section', 'anime-chibi')}
              className={`transition-all pb-1 cursor-pointer flex flex-col items-center ${
                activeNav === 'anime-chibi'
                  ? 'text-white font-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Anime</span>
              {activeNav === 'anime-chibi' && (
                <span className="w-full h-0.5 bg-[#00F0FF] rounded-full mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('catalogue-section', 'coding-tech')}
              className={`transition-all pb-1 cursor-pointer flex flex-col items-center ${
                activeNav === 'coding-tech'
                  ? 'text-white font-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Coding</span>
              {activeNav === 'coding-tech' && (
                <span className="w-full h-0.5 bg-[#00F0FF] rounded-full mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('catalogue-section', 'aesthetic-chill')}
              className={`transition-all pb-1 cursor-pointer flex flex-col items-center ${
                activeNav === 'aesthetic-chill'
                  ? 'text-white font-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Aesthetic</span>
              {activeNav === 'aesthetic-chill' && (
                <span className="w-full h-0.5 bg-[#00F0FF] rounded-full mt-0.5" />
              )}
            </button>

            <button
              onClick={onOpenPackBuilder}
              className="text-white/70 hover:text-white transition-all pb-1 cursor-pointer"
            >
              Build a Pack
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('catalogue-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white/70 hover:text-white transition-all pb-1 cursor-pointer"
            >
              Track Order
            </button>
          </nav>

          {/* Right Tools matching screenshot: Search Pill + Profile + Cart with Pink Badge */}
          <div className="flex items-center gap-3">
            {/* Search Pill */}
            <div
              onClick={() => {
                const el = document.getElementById('catalogue-search-input');
                if (el) {
                  el.focus();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hidden md:flex items-center gap-2.5 bg-[#141721] border border-white/10 rounded-full px-4 py-2 w-64 lg:w-80 cursor-text hover:border-white/20 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-400 truncate select-none">
                Search stickers... (e.g. gojo, python, cat, aesthetic)
              </span>
            </div>

            {/* Profile Button */}
            <button
              onClick={() => {
                const el = document.getElementById('catalogue-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Account"
              aria-label="Account"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Cart / Pack Button with Hot Pink Badge */}
            <button
              id="open-pack-builder-btn"
              onClick={onOpenPackBuilder}
              aria-label={`Open pack summary, currently ${totalItems} selected`}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors relative cursor-pointer"
              title="View your sticker pack"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-[#FF2E93] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-mono font-black shadow-sm">
                {totalItems}
              </span>
            </button>
          </div>

        </div>
      </header>
    </>
  );
};
