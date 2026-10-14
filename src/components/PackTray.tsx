import React from 'react';
import { ShoppingBag, ArrowRight, Gift, Sparkles, Check } from 'lucide-react';
import { PackSelectionState, PackRule, Sticker } from '../types';
import { isBonusUnlocked, isPackComplete } from '../lib/packRules';

interface PackTrayProps {
  selection: PackSelectionState;
  rule: PackRule;
  stickersMap: Map<string, Sticker>;
  onOpenPackBuilder: () => void;
  onProceedToOrder: () => void;
}

export const PackTray: React.FC<PackTrayProps> = ({
  selection,
  rule,
  stickersMap,
  onOpenPackBuilder,
  onProceedToOrder,
}) => {
  const totalBase = selection.baseStickerIds.length;
  const totalBonus = selection.bonusStickerIds.length;
  const totalItems = totalBase + totalBonus;
  const bonusUnlocked = isBonusUnlocked(selection.baseStickerIds, rule);
  const packComplete = isPackComplete(selection, rule);

  // Hide the floating dock when pack is empty so Hero and initial viewport remain completely unobstructed
  if (totalItems === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Pack status and action dock"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] sm:w-auto sm:min-w-[420px] max-w-lg transition-all duration-300"
    >
      <div className="backdrop-blur-xl bg-[#111319]/95 text-white rounded-2xl py-2 px-3.5 sm:px-4 border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3">
        {/* Left: Pack Thumbnails & Progress */}
        <div
          onClick={onOpenPackBuilder}
          className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenPackBuilder();
            }
          }}
          aria-label={`Pack contains ${totalBase} base and ${totalBonus} bonus stickers. Click to open pack summary.`}
        >
          {/* Avatar stack */}
          <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
            {selection.baseStickerIds.slice(0, 3).map((id) => {
              const sticker = stickersMap.get(id);
              if (!sticker) return null;
              return (
                <div
                  key={id}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-900 p-0.5 flex-shrink-0 shadow-soft-xs"
                >
                  <img
                    src={sticker.image_path}
                    alt={sticker.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              );
            })}
            {selection.bonusStickerIds.map((id) => {
              const sticker = stickersMap.get(id);
              if (!sticker) return null;
              return (
                <div
                  key={id}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pink-100 border border-[#FF6EB4] p-0.5 flex-shrink-0 shadow-soft-xs"
                >
                  <img
                    src={sticker.image_path}
                    alt={sticker.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              );
            })}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-display font-bold text-xs sm:text-sm text-white">
                Pack: {totalBase}/{rule.base_quantity} Base
              </span>
              {bonusUnlocked && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                  <Gift className="w-2.5 h-2.5 text-yellow-300" />
                  <span>+{totalBonus}/2 BONUS</span>
                </span>
              )}
            </div>
            <p className="font-mono text-[10px] sm:text-[11px] text-slate-300 truncate">
              {packComplete
                ? 'Pack complete (12/12) • Ready to order'
                : bonusUnlocked
                  ? `Pick ${rule.bonus_quantity - totalBonus} free bonus sticker${rule.bonus_quantity - totalBonus === 1 ? '' : 's'}`
                  : `Add ${rule.base_quantity - totalBase} more for 2 bonus stickers`}
            </p>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {packComplete ? (
            <button
              onClick={onProceedToOrder}
              className="bg-[#00F0FF] hover:bg-[#3bf4ff] text-black font-display font-black text-xs py-2.5 px-4 rounded-full flex items-center gap-1.5 shadow-lg shadow-[#00F0FF]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer uppercase"
            >
              <span>Order Pack (12)</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : bonusUnlocked && totalBonus < rule.bonus_quantity ? (
            <button
              onClick={onOpenPackBuilder}
              className="bg-[#FF2E93] hover:bg-[#ff4fa5] text-white font-display font-black text-xs py-2.5 px-4 rounded-full flex items-center gap-1.5 shadow-lg shadow-[#FF2E93]/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer animate-pulse"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Claim Bonus</span>
            </button>
          ) : (
            <button
              onClick={onOpenPackBuilder}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 font-display font-bold text-xs py-2 px-3.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>View ({totalItems})</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
