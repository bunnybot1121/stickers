import React from 'react';
import { ShoppingBag, ArrowRight, Gift, Sparkles } from 'lucide-react';
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

  if (totalItems === 0) return null;

  return (
    <aside
      aria-label="Current pack selection"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 animate-in slide-in-from-bottom duration-300"
    >
      <div className="card-neo p-3.5 bg-white/95 backdrop-blur-md shadow-neo-xl border-3 border-brand-dark flex items-center justify-between gap-3">
        {/* Left Thumbnails & Counter */}
        <div
          onClick={onOpenPackBuilder}
          className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
        >
          {/* Avatar Stack of first few selected stickers */}
          <div className="flex -space-x-3 overflow-hidden flex-shrink-0">
            {selection.baseStickerIds.slice(0, 4).map((id) => {
              const sticker = stickersMap.get(id);
              if (!sticker) return null;
              return (
                <div
                  key={id}
                  className="w-10 h-10 rounded-full bg-white border-2 border-brand-dark p-0.5 flex-shrink-0 shadow-sm"
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
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm text-brand-dark">
                {totalBase}/{rule.base_quantity} Base
              </span>
              {bonusUnlocked && (
                <span className="badge-neo bg-brand-pink text-white text-[10px] py-0">
                  +2 BONUS UNLOCKED!
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-gray-500 truncate">
              {packComplete
                ? 'All 12 items chosen! Ready to order.'
                : bonusUnlocked
                ? `Choose ${rule.bonus_quantity - totalBonus} bonus designs.`
                : `Need ${rule.base_quantity - totalBase} more base stickers.`}
            </p>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {packComplete ? (
            <button
              onClick={onProceedToOrder}
              className="btn-neo-yellow text-xs sm:text-sm py-2 px-3.5 flex items-center gap-1.5 animate-bounce"
            >
              <span>Order Pack</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenPackBuilder}
              className="btn-neo-cyan text-xs sm:text-sm py-2 px-3 flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View Pack ({totalItems}/12)</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
