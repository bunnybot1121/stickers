import React, { useEffect } from 'react';
import { X, Plus, Trash2, Sparkles, Check, Package, Tag as TagIcon } from 'lucide-react';
import { Sticker } from '../types';

interface StickerModalProps {
  sticker: Sticker | null;
  onClose: () => void;
  isSelectedBase: boolean;
  isSelectedBonus: boolean;
  isBaseFull: boolean;
  isBonusFull: boolean;
  bonusUnlocked: boolean;
  onSelectBase: (sticker: Sticker) => void;
  onSelectBonus: (sticker: Sticker) => void;
  onRemove: (stickerId: string) => void;
}

export const StickerModal: React.FC<StickerModalProps> = ({
  sticker,
  onClose,
  isSelectedBase,
  isSelectedBonus,
  isBaseFull,
  isBonusFull,
  bonusUnlocked,
  onSelectBase,
  onSelectBonus,
  onRemove,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!sticker) return null;

  const isSelected = isSelectedBase || isSelectedBonus;
  const isOutOfStock = sticker.track_inventory && (sticker.stock_on_hand ?? 0) < 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sticker-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="card-neo w-full max-w-lg bg-white overflow-hidden relative shadow-neo-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between p-4 border-b-3 border-brand-dark bg-brand-yellow/30">
          <div className="flex items-center gap-2">
            <span className="badge-neo bg-brand-cyan text-brand-dark">{sticker.style}</span>
            {sticker.categories?.map((cat) => (
              <span key={cat.id} className="badge-neo bg-white text-brand-dark">
                {cat.name}
              </span>
            ))}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100 shadow-neo-sm transition-all"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-brand-dark" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Big Artwork Preview */}
          <div className="w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-brand-cream to-white border-3 border-brand-dark shadow-neo-sm flex items-center justify-center p-4">
            <img
              src={sticker.image_path}
              alt={sticker.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-[4px_8px_0px_rgba(0,0,0,0.15)]"
            />
          </div>

          <div>
            <h2 id="sticker-modal-title" className="font-display font-black text-2xl sm:text-3xl text-brand-dark mb-2">
              {sticker.name}
            </h2>
            <p className="font-body text-base text-gray-700 leading-relaxed font-medium">
              {sticker.description}
            </p>
          </div>

          {/* Details specs */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl border-2 border-brand-dark bg-gray-50 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-purple" />
              <div>
                <span className="text-gray-500 block">Inventory:</span>
                <span className="font-bold text-brand-dark">
                  {sticker.track_inventory
                    ? `${sticker.stock_on_hand ?? 0} in stock`
                    : 'Print to order'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl border-2 border-brand-dark bg-gray-50 flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-brand-pink" />
              <div>
                <span className="text-gray-500 block">Offer Status:</span>
                <span className="font-bold text-brand-dark">Eligible for 10+2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t-3 border-brand-dark bg-gray-50 flex items-center justify-end gap-3">
          {isSelected ? (
            <button
              onClick={() => {
                onRemove(sticker.id);
                onClose();
              }}
              className="btn-neo bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove from Pack</span>
            </button>
          ) : isOutOfStock ? (
            <button disabled className="btn-neo bg-gray-200 text-gray-400 cursor-not-allowed text-sm">
              Sold Out
            </button>
          ) : (
            <div className="flex gap-2">
              {!isBaseFull && (
                <button
                  onClick={() => {
                    onSelectBase(sticker);
                    onClose();
                  }}
                  className="btn-neo-yellow flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Base (10)</span>
                </button>
              )}
              {bonusUnlocked && !isBonusFull && (
                <button
                  onClick={() => {
                    onSelectBonus(sticker);
                    onClose();
                  }}
                  className="btn-neo-pink flex items-center gap-2 text-sm animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Add as +2 Bonus Free</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
