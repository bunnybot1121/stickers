import React from 'react';
import { ShoppingBag, Gift, Sparkles, Home, Compass, Info } from 'lucide-react';
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
      {/* Desktop / Main Top Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-black/[0.06] shadow-soft-xs px-4 py-3.5 sm:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo with modern aesthetic badge */}
          <div
            onClick={() => handleNavClick('home', 'home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-purple-950 to-[#FF6EB4] text-white flex items-center justify-center shadow-soft group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-yellow-300" />
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
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-full border border-black/[0.04] font-display font-semibold text-xs text-slate-600">
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
              10 + 2 Deal
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Build / View Pack Button */}
            <button
              id="open-pack-builder-btn"
              onClick={onOpenPackBuilder}
              aria-label={`Open pack summary, currently ${totalBase} of ${rule.base_quantity} base stickers selected`}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-display font-bold text-xs sm:text-sm transition-all duration-200 ${
                bonusUnlocked
                  ? 'bg-gradient-to-r from-[#FF6EB4] to-purple-600 text-white shadow-soft hover:shadow-soft-md'
                  : totalBase > 0
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-soft-xs'
                  : 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-soft-xs'
              }`}
            >
              {bonusUnlocked ? (
                <Gift className="w-3.5 h-3.5 text-yellow-300" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 text-pink-500" />
              )}
              <span>
                {totalBase === 0 ? 'Pack: 0/10' : `Pack: ${totalBase}/${rule.base_quantity}`}
                {totalBonus > 0 && ` +${totalBonus} Bonus`}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

