import React from 'react';
import { Heart, Plus, Check, Trash2, Sparkles, Eye } from 'lucide-react';
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

  // Aesthetic pastel tint for the sticker preview stage
  const getStageColor = (style: string) => {
    switch (style) {
      case 'Kawaii':
        return 'bg-[#FFF0F5] border-[#FFD1DC]';
      case 'Neo-Brutal':
        return 'bg-[#FEFCE8] border-[#FEF08A]';
      case 'Pixel Art':
        return 'bg-[#F0F9FF] border-[#BAE6FD]';
      case 'Holographic':
        return 'bg-[#FAF5FF] border-[#E9D5FF]';
      case 'Retro':
        return 'bg-[#FFF7ED] border-[#FED7AA]';
      default:
        return 'bg-[#F0FDF4] border-[#BBF7D0]';
    }
  };

  const getCategoryBadgeColor = (style: string) => {
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
      className={`flex flex-col justify-between rounded-3xl border-2 border-black/80 bg-white overflow-hidden relative group transition-all duration-200 select-none ${
        isSelectedBase
          ? 'ring-3 ring-[#FACC15] shadow-neo bg-amber-50/20'
          : isSelectedBonus
          ? 'ring-3 ring-[#FF6EB4] shadow-neo bg-pink-50/20'
          : 'shadow-neo-sm hover:shadow-neo hover:-translate-y-1'
      }`}
    >
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {isSelectedBase ? (
          <span className="badge-neo bg-[#FACC15] text-brand-dark text-[10px] py-0.5 px-2.5 font-mono font-bold shadow-sm">
            ✓ IN PACK
          </span>
        ) : isSelectedBonus ? (
          <span className="badge-neo bg-[#FF6EB4] text-white text-[10px] py-0.5 px-2.5 font-mono font-bold shadow-sm animate-pulse">
            ★ +2 FREE BONUS
          </span>
        ) : (
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-xs ${getCategoryBadgeColor(
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
          className={`pointer-events-auto p-1.5 rounded-full border border-black/15 bg-white/95 hover:scale-110 active:scale-95 transition-transform shadow-xs ${
            isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-black'
          }`}
          title="Favorite sticker"
          aria-label="Favorite sticker"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Die-Cut Sticker Stage (Visual Showcase) */}
      <div
        onClick={() => onInspect(sticker)}
        className={`relative pt-10 pb-6 px-4 flex items-center justify-center cursor-pointer m-2.5 rounded-2xl border transition-all duration-300 ${getStageColor(
          sticker.style
        )}`}
      >
        <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center relative">
          <img
            src={sticker.image_path}
            alt={sticker.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.16)] drop-shadow-[0_4px_6px_rgba(0,0,0,0.08)] group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-300 ease-out"
          />
        </div>

        {/* Quick View Hover Pill */}
        <div className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="px-2.5 py-1 rounded-full bg-black/80 text-white font-mono text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <Eye className="w-3 h-3" /> Quick Look
          </span>
        </div>
      </div>

      {/* Info & Purchase Area */}
      <div className="p-4 pt-1 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              onClick={() => onInspect(sticker)}
              className="font-display font-black text-sm text-brand-dark hover:text-[#FF6EB4] cursor-pointer truncate"
              title={sticker.name}
            >
              {sticker.name}
            </h3>
            <span className="font-mono font-extrabold text-xs text-brand-dark flex-shrink-0">
              ₹49
            </span>
          </div>

          <p className="font-body text-[11px] text-gray-500 line-clamp-1 mb-3">
            {sticker.description}
          </p>
        </div>

        {/* Action Button */}
        <div>
          {isSelected ? (
            <button
              onClick={() => onRemove(sticker.id)}
              className="w-full py-2 px-3 rounded-xl border-2 border-red-400 bg-red-50 hover:bg-red-100 text-red-700 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs active:translate-y-0.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove from Pack</span>
            </button>
          ) : isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-400 font-display font-bold text-xs cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : !isBaseFull ? (
            <button
              onClick={() => onSelectBase(sticker)}
              className="w-full py-2 px-3 rounded-xl border-2 border-brand-dark bg-[#FACC15] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 text-brand-dark font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-neo-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Pack</span>
            </button>
          ) : bonusUnlocked && !isBonusFull ? (
            <button
              onClick={() => onSelectBonus(sticker)}
              className="w-full py-2 px-3 rounded-xl border-2 border-brand-dark bg-[#FF6EB4] hover:bg-pink-600 active:translate-x-0.5 active:translate-y-0.5 text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-neo-sm animate-pulse transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Select as +2 Free Bonus</span>
            </button>
          ) : (
            <button
              onClick={() => onInspect(sticker)}
              className="w-full py-2 px-3 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-50 text-brand-dark font-display font-bold text-xs flex items-center justify-center gap-1 shadow-neo-sm transition-all"
            >
              <span>View Specs</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
