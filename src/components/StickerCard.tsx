import React, { useState } from 'react';
import { Heart, Plus, Check, Trash2, Sparkles } from 'lucide-react';
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

  // Trigger confetti burst on add
  const handleAddWithAnimation = (e: React.MouseEvent<HTMLButtonElement>, isBonus: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 20,
      spread: 50,
      origin: { x, y },
      colors: isBonus ? ['#FF2E93', '#FACC15', '#00F0FF'] : ['#00F0FF', '#FF2E93', '#FFFFFF'],
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

  // Formatted category string matching screenshot
  const categoryLabel = sticker.categories && sticker.categories.length > 0
    ? sticker.categories.map((c) => c.name).slice(0, 2).join(' · ')
    : sticker.style || 'Vinyl';

  return (
    <article className="min-w-0 bg-[#111319] rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none">
      
      {/* Product Image Stage: Dark studio surface with large square viewport */}
      <div
        onClick={() => onInspect(sticker)}
        className="relative aspect-square bg-[#171922] p-4 sm:p-5 flex items-center justify-center cursor-pointer overflow-hidden group-hover:bg-[#1a1d28] transition-colors"
        role="button"
        tabIndex={0}
        aria-label={`View ${sticker.name}`}
      >
        {/* Wishlist Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(sticker.id);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited
              ? 'bg-[#FF2E93] text-white shadow-sm'
              : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/70'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Die-Cut Sticker Image with Realistic Drop Shadow */}
        <div className="w-full h-full flex items-center justify-center relative p-2 sm:p-3">
          <img
            src={sticker.image_path}
            alt={sticker.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.55)] group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Card Meta & Action Bar matching screenshot */}
      <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-1">
        <div>
          <h3
            onClick={() => onInspect(sticker)}
            className="font-display font-bold text-sm sm:text-base text-white hover:text-[#00F0FF] transition-colors line-clamp-1 cursor-pointer leading-tight"
            title={sticker.name}
          >
            {sticker.name}
          </h3>

          <p className="text-xs text-[#8E95A5] mt-1 line-clamp-1 font-normal">
            {categoryLabel}
          </p>
        </div>

        {/* Bottom Row: Price + Add Button matching screenshot */}
        <div className="flex items-center justify-between pt-3.5 mt-2 border-t border-white/[0.06]">
          <span className="font-display font-black text-sm sm:text-base text-white">
            ₹{Math.round(sticker.price * 10) || 49}
          </span>

          {isSelected ? (
            <button
              onClick={() => onRemove(sticker.id)}
              className="bg-[#00F0FF] text-black font-display font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              <span>Added ✓</span>
            </button>
          ) : isOutOfStock ? (
            <span className="text-[11px] text-slate-500 font-bold px-2 py-0.5">Sold out</span>
          ) : !isBaseFull ? (
            <button
              onClick={(e) => handleAddWithAnimation(e, false)}
              className="border border-white/20 hover:border-white hover:bg-white hover:text-black text-white/90 font-display font-bold text-xs px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Add to pack</span>
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          ) : bonusUnlocked && !isBonusFull ? (
            <button
              onClick={(e) => handleAddWithAnimation(e, true)}
              className="bg-[#FF2E93] text-white font-display font-black text-xs px-3 py-1 rounded-full shadow-md animate-pulse cursor-pointer"
            >
              Free Bonus +
            </button>
          ) : (
            <button
              onClick={() => onInspect(sticker)}
              className="border border-white/20 text-white/80 font-display font-medium text-xs px-3 py-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              View specs
            </button>
          )}
        </div>
      </div>

    </article>
  );
};
