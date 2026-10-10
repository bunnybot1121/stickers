import React from 'react';
import { Eye, Plus, Check, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { Sticker } from '../types';

interface StickerCardProps {
  sticker: Sticker;
  isSelectedBase: boolean;
  isSelectedBonus: boolean;
  isBaseFull: boolean;
  isBonusFull: boolean;
  bonusUnlocked: boolean;
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
  onSelectBase,
  onSelectBonus,
  onRemove,
  onInspect,
}) => {
  const isSelected = isSelectedBase || isSelectedBonus;
  const isOutOfStock = sticker.track_inventory && (sticker.stock_on_hand ?? 0) < 1;
  const isLowStock =
    sticker.track_inventory &&
    !isOutOfStock &&
    (sticker.stock_on_hand ?? 0) <= (sticker.low_stock_threshold ?? 10);

  return (
    <div
      className={`card-neo flex flex-col justify-between overflow-hidden relative group transition-all duration-200 ${
        isSelectedBase
          ? 'border-brand-dark bg-yellow-50/70 ring-3 ring-brand-yellow ring-offset-2'
          : isSelectedBonus
          ? 'border-brand-dark bg-pink-50/70 ring-3 ring-brand-pink ring-offset-2'
          : isOutOfStock
          ? 'opacity-70 bg-gray-50'
          : 'bg-white hover:-translate-y-1 hover:shadow-neo-lg'
      }`}
    >
      {/* Selection Status Flag */}
      {isSelectedBase && (
        <div className="absolute top-3 left-3 z-10 badge-neo bg-brand-yellow text-brand-dark flex items-center gap-1 shadow-neo-sm">
          <Check className="w-3.5 h-3.5" />
          <span>BASE PACK</span>
        </div>
      )}
      {isSelectedBonus && (
        <div className="absolute top-3 left-3 z-10 badge-neo bg-brand-pink text-white flex items-center gap-1 shadow-neo-sm animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BONUS REWARD</span>
        </div>
      )}

      {/* Style Pill on top right */}
      {!isSelected && (
        <div className="absolute top-3 right-3 z-10 badge-neo bg-white text-brand-dark text-[11px]">
          {sticker.style}
        </div>
      )}

      {/* Artwork Canvas Area */}
      <div
        onClick={() => onInspect(sticker)}
        className="relative pt-6 pb-4 px-6 flex items-center justify-center cursor-pointer select-none bg-gradient-to-b from-gray-50/50 to-transparent group-hover:bg-brand-cream/40 transition-colors"
      >
        <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-2 transition-transform duration-200">
          <img
            src={sticker.image_path}
            alt={sticker.name}
            loading="lazy"
            className="w-full h-full object-contain filter drop-shadow-[2px_4px_0px_rgba(0,0,0,0.15)]"
          />
        </div>

        {/* Quick View Overlay icon on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInspect(sticker);
          }}
          title="Inspect sticker details"
          className="absolute bottom-2 right-2 p-2 rounded-xl bg-white/90 border-2 border-brand-dark text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity shadow-neo-sm hover:bg-brand-yellow"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Metadata & Actions */}
      <div className="p-4 pt-2 border-t-2 border-brand-dark/10 bg-white flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              onClick={() => onInspect(sticker)}
              className="font-display font-black text-base text-brand-dark hover:text-brand-pink cursor-pointer truncate"
              title={sticker.name}
            >
              {sticker.name}
            </h3>
          </div>

          <p className="font-body text-xs text-gray-500 line-clamp-2 mb-3">
            {sticker.description}
          </p>

          {/* Low Stock Indicator */}
          {isLowStock && (
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-700 mb-2">
              <AlertCircle className="w-3 h-3" />
              <span>Only {sticker.stock_on_hand} left in stock!</span>
            </div>
          )}
          {isOutOfStock && (
            <div className="text-[11px] font-mono font-bold text-red-600 mb-2">
              Out of stock
            </div>
          )}
        </div>

        {/* Action Button Strip */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          {isSelected ? (
            <button
              onClick={() => onRemove(sticker.id)}
              className="w-full py-2 px-3 rounded-xl border-2 border-brand-dark bg-red-50 hover:bg-red-100 text-red-700 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove from Pack</span>
            </button>
          ) : isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl border-2 border-gray-300 bg-gray-100 text-gray-400 font-display font-bold text-xs cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : !isBaseFull ? (
            <button
              onClick={() => onSelectBase(sticker)}
              className="w-full btn-neo-yellow py-2 px-3 text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Base Pack</span>
            </button>
          ) : bonusUnlocked && !isBonusFull ? (
            <button
              onClick={() => onSelectBonus(sticker)}
              className="w-full btn-neo-pink py-2 px-3 text-xs flex items-center justify-center gap-1.5 animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add as Bonus Free</span>
            </button>
          ) : (
            <button
              onClick={() => onInspect(sticker)}
              className="w-full py-2 px-3 rounded-xl border-2 border-brand-dark bg-gray-100 text-brand-dark font-display font-bold text-xs hover:bg-gray-200 transition-colors"
            >
              Pack Complete (View)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
