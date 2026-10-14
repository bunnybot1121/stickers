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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#111319] text-white rounded-[28px] overflow-hidden relative shadow-2xl max-h-[92vh] flex flex-col border border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0A0B0E]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 id="pack-builder-title" className="font-display font-black text-xl sm:text-2xl text-white">
                My Curated Pack
              </h2>
              <span className="inline-flex items-center gap-1 bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#FF2E93]" />
                <span>10 + 2 OFFER</span>
              </span>
            </div>
            <p className="font-body text-xs text-slate-400 font-medium mt-0.5">
              Select 10 base stickers to unlock 2 bonus stickers <strong className="text-[#FF2E93]">completely free</strong>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Bar (1 through 10 -> +2) */}
        <div className="px-6 py-3 bg-[#0A0B0E] border-b border-white/10 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 mx-auto">
            {Array.from({ length: rule.base_quantity }).map((_, idx) => {
              const isFilled = idx < selection.baseStickerIds.length;
              return (
                <div
                  key={`step-${idx}`}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[11px] transition-all border ${
                    isFilled
                      ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-sm shadow-[#00F0FF]/30 scale-105 font-black'
                      : 'bg-white/5 text-slate-500 border-white/10'
                  }`}
                >
                  {idx + 1}
                </div>
              );
            })}

            <span className="text-slate-500 font-bold px-1">→</span>

            {/* Glowing +2 Bonus Step */}
            <div
              className={`px-3 py-1 rounded-full font-mono font-bold text-xs border transition-all ${
                bonusUnlocked
                  ? 'bg-[#FF2E93] text-white border-[#FF2E93] shadow-lg shadow-[#FF2E93]/30 animate-pulse'
                  : 'bg-white/5 text-slate-500 border-white/10'
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
                <span className="text-xs font-mono text-[#FACC15] font-bold bg-[#FACC15]/10 px-2.5 py-0.5 rounded-full border border-[#FACC15]/20">
                  Pick {remainingBase} more
                </span>
              ) : (
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
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
                      className="p-3 rounded-2xl border border-white/10 bg-[#171922] relative group flex flex-col items-center justify-between text-center min-h-[130px] hover:border-white/20 transition-all"
                    >
                      <button
                        onClick={() => onRemove(sticker.id)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="w-14 h-14 my-auto flex items-center justify-center">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-md"
                        />
                      </div>
                      <span className="font-display font-bold text-[11px] text-white truncate w-full">
                        {sticker.name}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={`empty-base-${idx}`}
                    onClick={onExploreMore}
                    className="p-3 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-center min-h-[130px] cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <span className="text-slate-500 font-mono text-xs font-medium">#{idx + 1}</span>
                    <span className="text-xl text-slate-500 group-hover:text-white font-bold my-1 transition-colors">+</span>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">Add sticker</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* +2 Bonus Stickers Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FF2E93]/10 via-purple-500/10 to-[#00F0FF]/10 border border-[#FF2E93]/30">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#FF2E93]" />
                <h3 className="font-display font-bold text-sm text-white">
                  Bonus Reward Stickers (2 Free Collectibles)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#FF2E93] bg-[#FF2E93]/20 px-2.5 py-0.5 rounded-full border border-[#FF2E93]/30">
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
                      className="p-3.5 rounded-2xl border border-[#FF2E93]/40 bg-[#171922] flex items-center justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="w-12 h-12 object-contain filter drop-shadow-md"
                        />
                        <div>
                          <span className="inline-block bg-[#FF2E93]/20 text-[#FF2E93] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mb-0.5">
                            BONUS #{idx + 1} FREE
                          </span>
                          <span className="font-display font-bold text-xs text-white block truncate max-w-[140px]">
                            {sticker.name}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(sticker.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
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
                        ? 'border-[#FF2E93]/40 bg-[#171922] cursor-pointer hover:bg-[#1f222e] text-[#FF2E93]'
                        : 'border-white/10 bg-white/5 cursor-not-allowed text-slate-500'
                    }`}
                  >
                    {bonusUnlocked ? <Sparkles className="w-4 h-4 text-[#FACC15] animate-spin" /> : <Lock className="w-4 h-4 text-slate-500" />}
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
        <div className="p-4 px-6 border-t border-white/10 bg-[#0A0B0E] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono font-bold text-slate-400">
            Total Pack: <strong className="text-white">{selection.baseStickerIds.length + selection.bonusStickerIds.length}</strong> / 12 Stickers
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onExploreMore}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs transition-colors cursor-pointer"
            >
              Browse Catalogue
            </button>

            {packComplete ? (
              <button
                id="pack-proceed-checkout-btn"
                onClick={onProceedToOrder}
                className="bg-[#00F0FF] hover:bg-[#38f3ff] text-black font-display font-black text-xs sm:text-sm py-2.5 px-6 flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full shadow-lg shadow-[#00F0FF]/25 cursor-pointer uppercase tracking-wider"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : bonusUnlocked && remainingBonus > 0 ? (
              <button
                onClick={onExploreMore}
                className="bg-[#FF2E93] hover:bg-[#ff4fa5] text-white font-display font-black text-xs sm:text-sm py-2.5 px-6 flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full shadow-lg shadow-[#FF2E93]/25 animate-pulse cursor-pointer uppercase tracking-wider"
              >
                <span>Choose {remainingBonus} Bonus</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <button
                disabled
                className="bg-white/5 border border-white/10 text-slate-500 text-xs py-2.5 px-5 flex-1 sm:flex-initial rounded-full cursor-not-allowed font-display font-bold"
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
