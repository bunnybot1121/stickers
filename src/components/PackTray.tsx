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

  // Always show the dock so customer has persistent awareness of 10+2 offer progress
  return (
    <aside
      aria-label="Current pack selection"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl transition-all duration-300"
    >
      <div className="backdrop-blur-2xl bg-slate-900/90 text-white rounded-full p-2.5 px-4 sm:px-5 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Pack Thumbnails & Counter */}
        <div
          onClick={onOpenPackBuilder}
          className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
        >
          {/* Avatar stack or empty indicator */}
          {totalItems > 0 ? (
            <div className="flex -space-x-2.5 overflow-hidden flex-shrink-0">
              {selection.baseStickerIds.slice(0, 4).map((id) => {
                const sticker = stickersMap.get(id);
                if (!sticker) return null;
                return (
                  <div
                    key={id}
                    className="w-9 h-9 rounded-full bg-white border-2 border-slate-900 p-0.5 flex-shrink-0 shadow-soft transform group-hover:scale-105 transition-transform"
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
                    className="w-9 h-9 rounded-full bg-pink-100 border-2 border-[#FF6EB4] p-0.5 flex-shrink-0 shadow-soft animate-pulse"
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
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-pink-400 flex-shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xs sm:text-sm text-white">
                {totalBase}/{rule.base_quantity} Base
              </span>
              {bonusUnlocked && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FF6EB4] to-purple-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-soft-xs animate-pulse">
                  <Gift className="w-3 h-3 text-yellow-300" />
                  <span>+2 BONUS UNLOCKED</span>
                </span>
              )}
            </div>
            <p className="font-mono text-[11px] text-slate-300 truncate">
              {totalItems === 0
                ? 'Select 10 stickers to unlock +2 free!'
                : packComplete
                ? 'Pack complete! Ready to order.'
                : bonusUnlocked
                ? `Pick ${rule.bonus_quantity - totalBonus} free bonus designs!`
                : `Pick ${rule.base_quantity - totalBase} more for bonus unlock.`}
            </p>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {packComplete ? (
            <button
              onClick={onProceedToOrder}
              className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-display font-black text-xs sm:text-sm py-2 px-4 rounded-full flex items-center gap-1.5 shadow-glow-yellow/50 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Order Pack (12)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : bonusUnlocked ? (
            <button
              onClick={onOpenPackBuilder}
              className="bg-gradient-to-r from-[#FF6EB4] to-purple-600 text-white font-display font-bold text-xs sm:text-sm py-2 px-4 rounded-full flex items-center gap-1.5 shadow-glow-pink/50 hover:scale-105 active:scale-95 transition-all animate-bounce"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Claim +2 Gifts</span>
            </button>
          ) : (
            <button
              onClick={onOpenPackBuilder}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 font-display font-semibold text-xs sm:text-sm py-2 px-4 rounded-full flex items-center gap-1.5 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />
              <span>Pack ({totalItems})</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
