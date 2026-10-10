import React from 'react';
import { Heart, Plus, Check, Trash2, Sparkles, AlertCircle } from 'lucide-react';
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

  // Category pill pastel color helper
  const getCategoryColor = (style: string) => {
    switch (style) {
      case 'Kawaii':
        return 'bg-[#FFE4EF] text-[#D81B60] border-[#FFC1D9]';
      case 'Neo-Brutal':
        return 'bg-[#FEF9C3] text-amber-800 border-[#FDE047]';
      case 'Pixel Art':
        return 'bg-[#E0F2FE] text-sky-800 border-[#BAE6FD]';
      case 'Holographic':
        return 'bg-[#F3E8FF] text-purple-800 border-[#E9D5FF]';
      case 'Retro':
        return 'bg-[#FFEDD5] text-orange-800 border-[#FED7AA]';
      default:
        return 'bg-[#DCFCE7] text-emerald-800 border-[#BBF7D0]';
    }
  };

  return (
    <div
      className={`card-neo flex flex-col justify-between overflow-hidden relative group transition-all duration-200 select-none ${
        isSelectedBase
          ? 'bg-[#FEF9C3]/50 ring-2 ring-[#FACC15]'
          : isSelectedBonus
          ? 'bg-[#FFE4EF]/50 ring-2 ring-[#FF6EB4]'
          : 'bg-white hover:-translate-y-1 hover:shadow-neo-lg'
      }`}
    >
      {/* Top Bar: Left Selection Flag, Right Heart Favorite button */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {isSelectedBase ? (
          <span className="badge-neo bg-[#FACC15] text-brand-dark text-[10px] py-0.5 px-2 font-mono font-bold shadow-sm">
            ✓ BASE PACK
          </span>
        ) : isSelectedBonus ? (
          <span className="badge-neo bg-[#FF6EB4] text-white text-[10px] py-0.5 px-2 font-mono font-bold shadow-sm animate-pulse">
            ★ BONUS
          </span>
        ) : (
          <span />
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(sticker.id);
          }}
          className={`pointer-events-auto p-1.5 rounded-full border border-black/10 bg-white/90 hover:scale-110 transition-transform shadow-sm ${
            isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-black'
          }`}
          title="Favorite sticker"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Centered Sticker Artwork Display */}
      <div
        onClick={() => onInspect(sticker)}
        className="relative pt-8 pb-4 px-6 flex items-center justify-center cursor-pointer bg-gradient-to-b from-gray-50/40 to-transparent group-hover:scale-105 transition-transform duration-200"
      >
        <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
          <img
            src={sticker.image_path}
            alt={sticker.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain filter drop-shadow-[2px_4px_0px_rgba(0,0,0,0.12)]"
          />
        </div>
      </div>

      {/* Bottom Information & Add Control matching reference */}
      <div className="p-4 pt-2 bg-white flex flex-col justify-between flex-1 border-t border-gray-100">
        <div>
          <h3
            onClick={() => onInspect(sticker)}
            className="font-display font-black text-sm text-brand-dark hover:text-[#FF6EB4] cursor-pointer truncate mb-1"
            title={sticker.name}
          >
            {sticker.name}
          </h3>

          {/* Category Chip in Pastel */}
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(
                sticker.style
              )}`}
            >
              {sticker.categories?.[0]?.name || sticker.style}
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              {sticker.style}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isSelected ? (
            <button
              onClick={() => onRemove(sticker.id)}
              className="w-full py-1.5 px-3 rounded-xl border border-red-400 bg-red-50 hover:bg-red-100 text-red-700 font-display font-bold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          ) : isOutOfStock ? (
            <button
              disabled
              className="w-full py-1.5 px-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-400 font-display font-bold text-xs cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : !isBaseFull ? (
            <button
              onClick={() => onSelectBase(sticker)}
              className="w-full btn-neo-yellow py-1.5 px-3 text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Pack</span>
            </button>
          ) : bonusUnlocked && !isBonusFull ? (
            <button
              onClick={() => onSelectBonus(sticker)}
              className="w-full btn-neo-pink py-1.5 px-3 text-xs flex items-center justify-center gap-1 shadow-sm animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add as Bonus Free</span>
            </button>
          ) : (
            <button
              onClick={() => onInspect(sticker)}
              className="w-full py-1.5 px-3 rounded-xl border border-black/30 bg-gray-50 text-brand-dark font-display font-bold text-xs hover:bg-gray-100 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
