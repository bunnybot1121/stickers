import React, { useEffect } from 'react';
import { X, Gift, Sparkles, Lock, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PackSelectionState, PackRule, Sticker } from '../types';
import { isBonusUnlocked, getRemainingBaseCount, getRemainingBonusCount, isPackComplete } from '../lib/packRules';

interface PackBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: PackSelectionState;
  rule: PackRule;
  stickersMap: Map<string, Sticker>;
  onRemove: (stickerId: string) => void;
  onProceedToOrder: () => void;
  onExploreMore: () => void;
}

export const PackBuilderModal: React.FC<PackBuilderModalProps> = ({
  isOpen,
  onClose,
  selection,
  rule,
  stickersMap,
  onRemove,
  onProceedToOrder,
  onExploreMore,
}) => {
  const bonusUnlocked = isBonusUnlocked(selection.baseStickerIds, rule);
  const remainingBase = getRemainingBaseCount(selection.baseStickerIds, rule);
  const remainingBonus = getRemainingBonusCount(selection.bonusStickerIds, rule);
  const packComplete = isPackComplete(selection, rule);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pack-builder-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="card-neo w-full max-w-3xl bg-white overflow-hidden relative shadow-neo-xl max-h-[92vh] flex flex-col border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching reference */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-black/10 bg-[#FAF7F2]">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="pack-builder-title" className="font-display font-black text-xl sm:text-2xl text-brand-dark">
                My Pack
              </h2>
              <span className="badge-neo bg-[#FFE4EF] text-[#D81B60] text-[10px]">
                10 + 2 OFFER
              </span>
            </div>
            <p className="font-body text-xs text-gray-500 font-medium">
              Select 10 stickers and get 2 <strong className="text-[#FF6EB4]">FREE!</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-black/20 bg-white hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Stepper Bar matching reference (1 through 10 -> +2) */}
        <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 mx-auto">
            {Array.from({ length: rule.base_quantity }).map((_, idx) => {
              const isFilled = idx < selection.baseStickerIds.length;
              return (
                <div
                  key={`step-${idx}`}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-mono font-bold text-[11px] transition-all border ${
                    isFilled
                      ? 'bg-[#FF6EB4] text-white border-[#FF6EB4] scale-105'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}
                >
                  {idx + 1}
                </div>
              );
            })}

            <span className="text-gray-400 font-bold px-1">→</span>

            {/* Glowing +2 Bonus Step */}
            <div
              className={`px-2.5 py-1 rounded-full font-mono font-black text-xs border transition-all ${
                bonusUnlocked
                  ? 'bg-[#FACC15] text-black border-black shadow-sm animate-pulse'
                  : 'bg-gray-100 text-gray-400 border-gray-300'
              }`}
            >
              +2 FREE
            </div>
          </div>
        </div>

        {/* Scrollable Center Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Base Stickers Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-gray-500">
                Base Stickers ({selection.baseStickerIds.length}/{rule.base_quantity})
              </span>
              {remainingBase > 0 ? (
                <span className="text-xs font-mono text-amber-700 font-bold">
                  Pick {remainingBase} more
                </span>
              ) : (
                <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 10 Base Complete!
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Array.from({ length: rule.base_quantity }).map((_, idx) => {
                const stickerId = selection.baseStickerIds[idx];
                const sticker = stickerId ? stickersMap.get(stickerId) : null;

                if (sticker) {
                  return (
                    <div
                      key={`base-${idx}`}
                      className="p-3 rounded-2xl border-2 border-black/80 bg-white relative group flex flex-col items-center justify-between text-center min-h-[125px] shadow-sm hover:shadow-neo-sm transition-all"
                    >
                      <button
                        onClick={() => onRemove(sticker.id)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="w-14 h-14 my-auto flex items-center justify-center">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                        />
                      </div>
                      <span className="font-display font-bold text-[11px] text-brand-dark truncate w-full">
                        {sticker.name}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={`empty-base-${idx}`}
                    onClick={onExploreMore}
                    className="p-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center min-h-[125px] cursor-pointer hover:bg-[#FAF7F2] transition-colors"
                  >
                    <span className="text-gray-400 font-mono text-xs">#{idx + 1}</span>
                    <span className="text-xl text-gray-300 font-bold">+</span>
                    <span className="text-[10px] font-mono text-gray-500">Add sticker</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* +2 Bonus Stickers Section */}
          <div className="p-4 rounded-2xl bg-[#FFE4EF]/30 border-2 border-[#FF6EB4]/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#FF6EB4]" />
                <h3 className="font-display font-bold text-sm text-brand-dark">
                  Bonus Reward Stickers (2 Free)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#FF6EB4]">
                {selection.bonusStickerIds.length}/{rule.bonus_quantity} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: rule.bonus_quantity }).map((_, idx) => {
                const stickerId = selection.bonusStickerIds[idx];
                const sticker = stickerId ? stickersMap.get(stickerId) : null;

                if (sticker) {
                  return (
                    <div
                      key={`bonus-${idx}`}
                      className="p-3 rounded-xl border-2 border-[#FF6EB4] bg-white flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <span className="badge-neo bg-[#FFE4EF] text-[#D81B60] text-[9px] py-0 mb-0.5">
                            BONUS #{idx + 1}
                          </span>
                          <span className="font-display font-bold text-xs text-brand-dark block truncate max-w-[140px]">
                            {sticker.name}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(sticker.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={`bonus-empty-${idx}`}
                    onClick={() => {
                      if (bonusUnlocked) onExploreMore();
                    }}
                    className={`p-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 min-h-[64px] ${
                      bonusUnlocked
                        ? 'border-[#FF6EB4] bg-white/70 cursor-pointer hover:bg-white text-[#FF6EB4]'
                        : 'border-gray-300 bg-gray-50/50 cursor-not-allowed text-gray-400'
                    }`}
                  >
                    {bonusUnlocked ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span className="font-display font-bold text-xs">
                      {bonusUnlocked
                        ? `Pick Bonus Sticker #${idx + 1}`
                        : `Bonus Slot #${idx + 1} (Select 10 Base First)`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t-2 border-black/10 bg-[#FAF7F2] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono font-bold text-gray-600">
            Total Pack: {selection.baseStickerIds.length + selection.bonusStickerIds.length} / 12 Stickers
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onExploreMore}
              className="btn-neo-white text-xs py-2 px-4 flex-1 sm:flex-initial"
            >
              Browse Catalogue
            </button>

            {packComplete ? (
              <button
                id="pack-proceed-checkout-btn"
                onClick={onProceedToOrder}
                className="btn-neo-yellow text-xs sm:text-sm py-2 px-5 flex-1 sm:flex-initial flex items-center justify-center gap-2 shadow-neo animate-bounce"
              >
                <span>Proceed to Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : bonusUnlocked && remainingBonus > 0 ? (
              <button
                onClick={onExploreMore}
                className="btn-neo-pink text-xs sm:text-sm py-2 px-5 flex-1 sm:flex-initial flex items-center justify-center gap-2 animate-pulse"
              >
                <span>Choose {remainingBonus} Bonus</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled
                className="btn-neo bg-gray-200 text-gray-400 text-xs py-2 px-5 flex-1 sm:flex-initial cursor-not-allowed"
              >
                Select {remainingBase} more base
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
