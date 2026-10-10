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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-[28px] overflow-hidden relative shadow-soft-xl max-h-[92vh] flex flex-col border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-black/[0.06] bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 id="pack-builder-title" className="font-display font-black text-xl sm:text-2xl text-slate-900">
                My Curated Pack
              </h2>
              <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#FF6EB4]" />
                <span>10 + 2 OFFER</span>
              </span>
            </div>
            <p className="font-body text-xs text-slate-500 font-medium mt-0.5">
              Select 10 base stickers to unlock 2 bonus stickers <strong className="text-pink-600">completely free</strong>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-black/10 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-soft-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Bar (1 through 10 -> +2) */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 mx-auto">
            {Array.from({ length: rule.base_quantity }).map((_, idx) => {
              const isFilled = idx < selection.baseStickerIds.length;
              return (
                <div
                  key={`step-${idx}`}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[11px] transition-all border ${
                    isFilled
                      ? 'bg-slate-900 text-white border-slate-900 shadow-soft-xs scale-105'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {idx + 1}
                </div>
              );
            })}

            <span className="text-slate-300 font-bold px-1">→</span>

            {/* Glowing +2 Bonus Step */}
            <div
              className={`px-3 py-1 rounded-full font-mono font-bold text-xs border transition-all ${
                bonusUnlocked
                  ? 'bg-gradient-to-r from-[#FF6EB4] to-purple-600 text-white border-pink-300 shadow-glow-pink/30 animate-pulse'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
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
              <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">
                Base Stickers ({selection.baseStickerIds.length}/{rule.base_quantity})
              </span>
              {remainingBase > 0 ? (
                <span className="text-xs font-mono text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Pick {remainingBase} more
                </span>
              ) : (
                <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
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
                      className="p-3 rounded-2xl border border-black/[0.08] bg-white relative group flex flex-col items-center justify-between text-center min-h-[130px] shadow-soft hover:shadow-soft-md transition-all"
                    >
                      <button
                        onClick={() => onRemove(sticker.id)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="w-14 h-14 my-auto flex items-center justify-center">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                        />
                      </div>
                      <span className="font-display font-bold text-[11px] text-slate-900 truncate w-full">
                        {sticker.name}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={`empty-base-${idx}`}
                    onClick={onExploreMore}
                    className="p-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center text-center min-h-[130px] cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all group"
                  >
                    <span className="text-slate-400 font-mono text-xs font-medium">#{idx + 1}</span>
                    <span className="text-xl text-slate-300 group-hover:text-slate-500 font-bold my-1 transition-colors">+</span>
                    <span className="text-[10px] font-mono text-slate-500 font-medium">Add sticker</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* +2 Bonus Stickers Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50/70 via-purple-50/50 to-pink-50/70 border border-pink-200">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#FF6EB4]" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Bonus Reward Stickers (2 Free Collectibles)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-pink-700 bg-pink-100/80 px-2.5 py-0.5 rounded-full">
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
                      className="p-3.5 rounded-2xl border border-pink-300 bg-white flex items-center justify-between gap-3 shadow-soft"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <span className="inline-block bg-pink-100 text-pink-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mb-0.5">
                            BONUS #{idx + 1} FREE
                          </span>
                          <span className="font-display font-bold text-xs text-slate-900 block truncate max-w-[140px]">
                            {sticker.name}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(sticker.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
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
                    className={`p-3.5 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 min-h-[68px] transition-all ${
                      bonusUnlocked
                        ? 'border-pink-300 bg-white cursor-pointer hover:bg-pink-50 text-pink-600 shadow-soft-xs'
                        : 'border-slate-200 bg-slate-50/50 cursor-not-allowed text-slate-400'
                    }`}
                  >
                    {bonusUnlocked ? <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" /> : <Lock className="w-4 h-4 text-slate-300" />}
                    <span className="font-display font-bold text-xs">
                      {bonusUnlocked
                        ? `Pick Bonus Sticker #${idx + 1}`
                        : `Bonus Slot #${idx + 1} (Fill 10 Base First)`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-black/[0.06] bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono font-bold text-slate-600">
            Total Pack: <strong className="text-slate-900">{selection.baseStickerIds.length + selection.bonusStickerIds.length}</strong> / 12 Stickers
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onExploreMore}
              className="btn-neo-white text-xs py-2.5 px-4 flex-1 sm:flex-initial rounded-full"
            >
              Browse Catalogue
            </button>

            {packComplete ? (
              <button
                id="pack-proceed-checkout-btn"
                onClick={onProceedToOrder}
                className="btn-neo-yellow text-xs sm:text-sm py-2.5 px-6 flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full shadow-glow-yellow/50 animate-bounce"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : bonusUnlocked && remainingBonus > 0 ? (
              <button
                onClick={onExploreMore}
                className="btn-neo-pink text-xs sm:text-sm py-2.5 px-6 flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full shadow-glow-pink/40 animate-pulse"
              >
                <span>Choose {remainingBonus} Bonus</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled
                className="btn-neo bg-slate-200 text-slate-400 text-xs py-2.5 px-5 flex-1 sm:flex-initial rounded-full cursor-not-allowed"
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
