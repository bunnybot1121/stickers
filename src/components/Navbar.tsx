import React from 'react';
import { Sparkles, ShoppingBag, ShieldCheck, Database, Gift } from 'lucide-react';
import { PackSelectionState, PackRule } from '../types';
import { isBonusUnlocked } from '../lib/packRules';
import { storeService } from '../services/storeService';

interface NavbarProps {
  selection: PackSelectionState;
  rule: PackRule;
  onOpenPackBuilder: () => void;
  onOpenAdmin: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selection,
  rule,
  onOpenPackBuilder,
  onOpenAdmin,
  onNavigateHome,
}) => {
  const totalBase = selection.baseStickerIds.length;
  const totalBonus = selection.bonusStickerIds.length;
  const totalItems = totalBase + totalBonus;
  const bonusUnlocked = isBonusUnlocked(selection.baseStickerIds, rule);
  const isSupabase = storeService.isConnectedToSupabase;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-3 border-brand-dark px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-yellow border-3 border-brand-dark shadow-neo-sm flex items-center justify-center transform group-hover:-rotate-6 transition-transform">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-brand-dark">
                STICKER<span className="text-brand-pink">VERSE</span>
              </span>
              <span className="hidden sm:inline-block badge-neo bg-brand-cyan text-brand-dark text-[10px] px-2 py-0.5">
                10 + 2 PACK DEAL
              </span>
            </div>
            <p className="text-[11px] font-mono text-gray-500 hidden md:block">
              Collect 10 → Unlock 2 Bonus Stickers Free
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Supabase Status Pill */}
          <div
            title={isSupabase ? 'Connected to live Supabase backend' : 'Running in Local Demo Mode (awaiting Supabase credentials)'}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border-2 border-brand-dark ${
              isSupabase ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabase ? 'Supabase Live' : 'Demo Mode'}</span>
          </div>

          {/* Pack Tray Counter Button */}
          <button
            id="open-pack-builder-btn"
            onClick={onOpenPackBuilder}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border-3 border-brand-dark shadow-neo-sm font-display font-bold text-sm transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              bonusUnlocked
                ? 'bg-brand-pink text-white hover:bg-pink-500 animate-pulse'
                : totalBase > 0
                ? 'bg-brand-yellow text-brand-dark hover:bg-yellow-300'
                : 'bg-white text-brand-dark hover:bg-gray-100'
            }`}
          >
            {bonusUnlocked ? (
              <Gift className="w-4 h-4 animate-bounce" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
            <span>
              {totalBase}/{rule.base_quantity} Base
              {totalBonus > 0 && ` + ${totalBonus} Bonus`}
            </span>
            {totalItems > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-brand-coral border border-brand-dark absolute -top-1 -right-1" />
            )}
          </button>

          {/* Admin link */}
          <button
            id="open-admin-btn"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100 text-brand-dark text-xs sm:text-sm font-display font-bold shadow-neo-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-brand-purple" />
            <span className="hidden sm:inline">Admin Studio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
