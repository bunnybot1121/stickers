import React, { useState } from 'react';
import { Heart, Plus, Check, Trash2, Sparkles, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Sticker } from '../types';

interface StickerCardProps {
  sticker: Sticker;
  isSelectedBase: boolean;
  isSelectedBonus: boolean;
  isBaseFull: boolean;
  isBonusFull: boolean;
  bonusUnlocked: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: (stickerId: string) => void;
  onSelectBase: (sticker: Sticker) => void;
  onSelectBonus: (sticker: Sticker) => void;
  onRemove: (stickerId: string) => void;
  onInspect: (sticker: Sticker) => void;
}

export const StickerCard: React.FC<StickerCardProps> = ({
  sticker,
  isSelectedBase,
  isSelectedBonus,
  isBaseFull,
  isBonusFull,
  bonusUnlocked,
  isFavorited = false,
  onToggleFavorite,
  onSelectBase,
  onSelectBonus,
  onRemove,
  onInspect,
}) => {
  const isSelected = isSelectedBase || isSelectedBonus;
  const isOutOfStock = sticker.track_inventory && (sticker.stock_on_hand ?? 0) < 1;
  const [justAdded, setJustAdded] = useState(false);

  // Trigger joyful micro-particle burst from button on add
  const handleAddWithAnimation = (e: React.MouseEvent<HTMLButtonElement>, isBonus: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 16,
      spread: 45,
      origin: { x, y },
      colors: isBonus ? ['#FF6EB4', '#FACC15', '#9B51E0'] : ['#00D4D8', '#FF6EB4', '#FACC15', '#11131A'],
      scalar: 0.75,
      ticks: 70,
      disableForReducedMotion: true,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);

    if (isBonus) {
      onSelectBonus(sticker);
    } else {
      onSelectBase(sticker);
    }
  };

  const getCategoryBadgeColor = (style: string) => {
    switch (style) {
      case 'Kawaii':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Neo-Brutal':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Pixel Art':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Holographic':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Retro':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Die-Cut':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pop Culture':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Vintage':
        return 'bg-amber-50/70 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl bg-white overflow-hidden relative group transition-all duration-300 select-none ${
        isSelectedBase
          ? 'ring-2 ring-slate-900 border-slate-900 shadow-soft-lg'
          : isSelectedBonus
          ? 'ring-2 ring-[#FF6EB4] border-[#FF6EB4] shadow-glow-pink/30'
          : 'border border-black/[0.07] shadow-soft hover:shadow-soft-xl hover:-translate-y-1 hover:border-black/15'
      } ${justAdded ? 'scale-[1.02] transition-transform duration-150' : ''}`}
    >
      {/* Top Floating Badges Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {isSelectedBase ? (
          <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-[10px] py-0.5 px-2.5 rounded-full font-mono font-bold shadow-soft-xs">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>IN PACK</span>
          </span>
        ) : isSelectedBonus ? (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FF6EB4] to-purple-600 text-white text-[10px] py-0.5 px-2.5 rounded-full font-mono font-bold shadow-soft-xs animate-pulse">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>BONUS FREE</span>
          </span>
        ) : (
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-soft-xs ${getCategoryBadgeColor(
              sticker.style
            )}`}
          >
            {sticker.categories?.[0]?.name || sticker.style}
          </span>
        )}

        {/* Favorite Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(sticker.id);
          }}
          className={`pointer-events-auto p-1.5 rounded-full border border-black/[0.08] bg-white/95 backdrop-blur-sm hover:scale-110 active:scale-95 transition-transform shadow-soft-xs ${
            isFavorited ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-slate-900'
          }`}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorited ? `Remove ${sticker.name} from favorites` : `Add ${sticker.name} to favorites`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Uniform Aspect-Ratio Die-Cut Sticker Stage */}
      <div
        onClick={() => onInspect(sticker)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onInspect(sticker);
          }
        }}
        aria-label={`View full specifications and mockups for ${sticker.name}`}
        className="relative w-full aspect-square p-4 flex items-center justify-center cursor-pointer bg-[#F8F9FA] sticker-stage-neutral border-b border-black/[0.04] overflow-hidden group-hover:bg-[#F3F4F6] transition-colors"
      >
        <div className="w-full h-full flex items-center justify-center relative p-2">
          <img
            src={sticker.image_path}
            alt={`${sticker.name} die-cut vinyl sticker`}
            loading="lazy"
            className={`max-h-full max-w-full object-contain sticker-die-cut group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-300 ease-out ${
              justAdded ? 'scale-110 -rotate-2 transition-transform duration-200' : ''
            }`}
          />
        </div>

        {/* Quick View Hover Hint */}
        <div className="absolute bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/85 text-white backdrop-blur-sm font-mono text-[10px] font-semibold flex items-center gap-1 shadow-soft">
            <Eye className="w-3 h-3 text-[#FF6EB4]" /> Quick View
          </span>
        </div>
      </div>

      {/* Info & Purchase Area */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div className="mb-2.5">
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h3
              onClick={() => onInspect(sticker)}
              className="font-body font-bold text-xs sm:text-sm text-slate-900 hover:text-[#FF6EB4] cursor-pointer line-clamp-2 min-h-[2.35rem] leading-snug transition-colors"
              title={sticker.name}
            >
              {sticker.name}
            </h3>
            <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md flex-shrink-0">
              ₹49
            </span>
          </div>

          <p className="font-body text-[11px] text-slate-500 line-clamp-1 font-normal">
            {sticker.description}
          </p>
        </div>

        {/* Action Button */}
        <div>
          {isSelected ? (
            <button
              onClick={() => onRemove(sticker.id)}
              className="w-full py-2 px-3 rounded-xl border border-red-200 bg-red-50/80 hover:bg-red-100 text-red-600 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-soft-xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove from Pack</span>
            </button>
          ) : isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 font-display font-bold text-xs cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : !isBaseFull ? (
            <button
              onClick={(e) => handleAddWithAnimation(e, false)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft hover:shadow-soft-md transition-all active:scale-95"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added to Pack</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Pack</span>
                </>
              )}
            </button>
          ) : bonusUnlocked && !isBonusFull ? (
            <button
              onClick={(e) => handleAddWithAnimation(e, true)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF6EB4] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-pink/30 animate-pulse transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Claim as Free Bonus</span>
            </button>
          ) : (
            <button
              onClick={() => onInspect(sticker)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-display font-semibold text-xs flex items-center justify-center gap-1 shadow-soft-xs transition-all"
            >
              <span>View Specs</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
