import React, { useEffect, useRef } from 'react';
import { X, Gift, Sparkles, Lock, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
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
  const prevBonusUnlockedRef = useRef(false);
  const bonusUnlocked = isBonusUnlocked(selection.baseStickerIds, rule);
  const remainingBase = getRemainingBaseCount(selection.baseStickerIds, rule);
  const remainingBonus = getRemainingBonusCount(selection.bonusStickerIds, rule);
  const packComplete = isPackComplete(selection, rule);

  // Trigger celebration moment when bonus is unlocked!
  useEffect(() => {
    if (bonusUnlocked && !prevBonusUnlockedRef.current) {
      // Trigger canvas-confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00D4D8', '#FF6EB4', '#F5E642', '#111111', '#FFFFFF'],
      });
    }
    prevBonusUnlockedRef.current = bonusUnlocked;
  }, [bonusUnlocked]);

  // Keyboard Escape
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="card-neo w-full max-w-4xl bg-white overflow-hidden relative shadow-neo-xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-brand-dark bg-brand-yellow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-3 border-brand-dark shadow-neo-sm flex items-center justify-center font-display font-black text-xl">
              📦
            </div>
            <div>
              <h2 id="pack-builder-title" className="font-display font-black text-xl sm:text-2xl text-brand-dark leading-tight">
                Your 10 + 2 Pack Studio
              </h2>
              <p className="font-mono text-xs text-brand-dark font-bold">
                {selection.baseStickerIds.length}/{rule.base_quantity} Base Selected •{' '}
                {selection.bonusStickerIds.length}/{rule.bonus_quantity} Bonus Claimed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100 shadow-neo-sm transition-all"
            aria-label="Close Pack Studio"
          >
            <X className="w-5 h-5 text-brand-dark" />
          </button>
        </div>

        {/* Scrollable Center Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-8">
          {/* SECTION 1: Base Pack Grid (10 Slots) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="badge-neo bg-brand-cyan text-brand-dark">STEP 1</span>
                <h3 className="font-display font-black text-lg sm:text-xl text-brand-dark">
                  Base Stickers ({selection.baseStickerIds.length}/{rule.base_quantity})
                </h3>
              </div>
              {remainingBase > 0 ? (
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
                  Select {remainingBase} more
                </span>
              ) : (
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Base Complete!
                </span>
              )}
            </div>

            {/* 10 Grid Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Array.from({ length: rule.base_quantity }).map((_, idx) => {
                const stickerId = selection.baseStickerIds[idx];
                const sticker = stickerId ? stickersMap.get(stickerId) : null;

                if (sticker) {
                  return (
                    <div
                      key={`base-slot-${idx}`}
                      className="p-3 rounded-xl border-2 border-brand-dark bg-yellow-50/50 relative group flex flex-col items-center justify-between text-center min-h-[140px] shadow-neo-sm"
                    >
                      <span className="absolute top-1.5 left-2 font-mono text-[10px] font-bold text-gray-500">
                        #{idx + 1}
                      </span>
                      <button
                        onClick={() => onRemove(sticker.id)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-100 border border-brand-dark text-red-600 hover:bg-red-200 transition-colors"
                        title="Remove sticker"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="w-16 h-16 my-auto flex items-center justify-center">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                        />
                      </div>
                      <p className="font-display font-bold text-xs text-brand-dark truncate w-full mt-1">
                        {sticker.name}
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={`base-empty-${idx}`}
                    onClick={onExploreMore}
                    className="p-3 rounded-xl border-2 border-dashed border-gray-400 bg-gray-50/50 flex flex-col items-center justify-center text-center min-h-[140px] cursor-pointer hover:bg-brand-cream/50 transition-colors select-none"
                  >
                    <span className="font-mono text-xs font-bold text-gray-400 mb-1">
                      Slot #{idx + 1}
                    </span>
                    <span className="text-xl text-gray-400 font-light">+</span>
                    <span className="text-[11px] font-mono text-gray-500 font-medium mt-1">
                      Choose design
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Bonus Reward Section (+2 Slots) */}
          <div
            className={`p-5 rounded-2xl border-3 border-brand-dark transition-all duration-300 ${
              bonusUnlocked
                ? 'bg-gradient-to-r from-pink-50 via-white to-purple-50 shadow-neo-md'
                : 'bg-gray-100 opacity-80'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl border-2 border-brand-dark flex items-center justify-center ${
                    bonusUnlocked ? 'bg-brand-pink text-white animate-bounce' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {bonusUnlocked ? <Gift className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge-neo ${
                        bonusUnlocked ? 'bg-brand-pink text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      STEP 2: +2 BONUS
                    </span>
                    <h3 className="font-display font-black text-lg text-brand-dark">
                      Bonus Reward Slots (2 Free)
                    </h3>
                  </div>
                  <p className="font-body text-xs text-gray-600 font-medium">
                    {bonusUnlocked
                      ? 'Woohoo! 10 base stickers selected. Claim your two free bonus designs below.'
                      : `Locked! Add ${remainingBase} more base stickers to unlock your 2 free bonus designs.`}
                  </p>
                </div>
              </div>

              {bonusUnlocked && (
                <span className="badge-neo bg-brand-yellow text-brand-dark font-mono text-xs">
                  {selection.bonusStickerIds.length}/{rule.bonus_quantity} Claimed
                </span>
              )}
            </div>

            {/* Bonus Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: rule.bonus_quantity }).map((_, idx) => {
                const stickerId = selection.bonusStickerIds[idx];
                const sticker = stickerId ? stickersMap.get(stickerId) : null;

                if (sticker) {
                  return (
                    <div
                      key={`bonus-slot-${idx}`}
                      className="p-4 rounded-xl border-3 border-brand-dark bg-pink-50 relative group flex items-center gap-4 shadow-neo-sm"
                    >
                      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white rounded-lg border-2 border-brand-dark p-1">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="badge-neo bg-brand-pink text-white text-[10px] py-0 mb-1">
                          BONUS #{idx + 1}
                        </span>
                        <h4 className="font-display font-bold text-sm text-brand-dark truncate">
                          {sticker.name}
                        </h4>
                        <span className="text-xs font-mono text-emerald-700 font-bold">$0.00 (Free Reward)</span>
                      </div>
                      <button
                        onClick={() => onRemove(sticker.id)}
                        className="p-2 rounded-xl bg-white border-2 border-brand-dark text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove bonus sticker"
                      >
                        <Trash2 className="w-4 h-4" />
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
                    className={`p-4 rounded-xl border-2 border-dashed flex items-center gap-4 select-none min-h-[96px] ${
                      bonusUnlocked
                        ? 'border-brand-pink bg-pink-50/40 cursor-pointer hover:bg-pink-50 transition-colors'
                        : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center font-bold text-gray-400">
                      {bonusUnlocked ? '✨' : <Lock className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-display font-bold text-sm text-brand-dark block">
                        Bonus Reward #{idx + 1}
                      </span>
                      <span className="font-mono text-xs text-gray-500">
                        {bonusUnlocked
                          ? 'Click to choose from catalogue'
                          : 'Unlocks after 10 base stickers'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Summary & Proceed CTA */}
        <div className="p-4 sm:p-5 border-t-3 border-brand-dark bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="font-display font-bold text-sm sm:text-base text-brand-dark">
              Total Pack: <strong>{selection.baseStickerIds.length + selection.bonusStickerIds.length}</strong> / 12 Stickers
            </div>
            <div className="font-mono text-xs text-gray-600">
              10 Base Custom Curations + 2 Free Bonus Stickers
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onExploreMore}
              className="btn-neo-white text-xs sm:text-sm py-2.5 px-4 flex-1 sm:flex-initial"
            >
              Browse More
            </button>

            {packComplete ? (
              <button
                id="pack-proceed-checkout-btn"
                onClick={onProceedToOrder}
                className="btn-neo-yellow text-sm sm:text-base py-2.5 px-5 flex-1 sm:flex-initial flex items-center justify-center gap-2 group animate-bounce"
              >
                <span>Proceed to Order</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                disabled
                className="btn-neo bg-gray-200 text-gray-500 text-xs sm:text-sm py-2.5 px-5 flex-1 sm:flex-initial cursor-not-allowed"
              >
                {remainingBase > 0
                  ? `Select ${remainingBase} more base`
                  : `Select ${remainingBonus} bonus`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
