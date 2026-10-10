import React, { useEffect } from 'react';
import { X, Plus, Trash2, Sparkles, Heart, Droplets, Check, ShieldCheck, Laptop } from 'lucide-react';
import { Sticker } from '../types';

interface StickerModalProps {
  sticker: Sticker | null;
  allStickers: Sticker[];
  onClose: () => void;
  isSelectedBase: boolean;
  isSelectedBonus: boolean;
  isBaseFull: boolean;
  isBonusFull: boolean;
  bonusUnlocked: boolean;
  onSelectBase: (sticker: Sticker) => void;
  onSelectBonus: (sticker: Sticker) => void;
  onRemove: (stickerId: string) => void;
  onSelectSimilar: (sticker: Sticker) => void;
}

export const StickerModal: React.FC<StickerModalProps> = ({
  sticker,
  allStickers,
  onClose,
  isSelectedBase,
  isSelectedBonus,
  isBaseFull,
  isBonusFull,
  bonusUnlocked,
  onSelectBase,
  onSelectBonus,
  onRemove,
  onSelectSimilar,
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
  const similarStickers = allStickers
    .filter((s) => s.id !== sticker.id && s.style === sticker.style)
    .slice(0, 4);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sticker-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="card-neo w-full max-w-2xl bg-white overflow-hidden relative shadow-neo-xl max-h-[92vh] flex flex-col border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Breadcrumbs & Close */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black/10 bg-[#FAF7F2]">
          <div className="text-xs font-mono text-gray-500 font-bold flex items-center gap-1.5">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-black">{sticker.categories?.[0]?.name || sticker.style}</span>
            <span>&gt;</span>
            <span className="text-[#FF6EB4]">{sticker.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-black/20 bg-white hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Content Body matching reference */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Left: Sticker Canvas Display */}
            <div className="sm:col-span-5 flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-[#FFE4EF]/30 to-[#E0F2FE]/30 border-2 border-black/10">
              <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
                <img
                  src={sticker.image_path}
                  alt={sticker.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[4px_6px_0px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>

            {/* Right: Specifications & Title */}
            <div className="sm:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="badge-neo bg-[#FFE4EF] text-[#D81B60] text-[10px]">
                  {sticker.categories?.[0]?.name || sticker.style}
                </span>
                <span className="badge-neo bg-[#FEF9C3] text-amber-800 text-[10px]">
                  {sticker.style}
                </span>
              </div>

              <h2 id="sticker-modal-title" className="font-display font-black text-2xl text-brand-dark">
                {sticker.name}
              </h2>

              <p className="font-body text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                {sticker.description || 'A cute collectible sticker buddy for your laptop, notebook or anywhere you like!'}
              </p>

              {/* Specs Box matching reference 03 */}
              <div className="p-3.5 rounded-xl border border-black/10 bg-gray-50/80 space-y-1.5 text-xs font-body">
                <div className="flex items-center gap-2 text-gray-700">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span><strong>Material:</strong> Waterproof Vinyl</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span><strong>Finish:</strong> Premium Matte Finish</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span><strong>Size:</strong> ~5 cm Laser Die-Cut</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Laptop className="w-3.5 h-3.5 text-purple-500" />
                  <span><strong>Use on:</strong> Laptops, Bottles, Notebooks</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isSelected ? (
                  <button
                    onClick={() => {
                      onRemove(sticker.id);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-red-300 bg-red-50 text-red-700 font-display font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove from Pack</span>
                  </button>
                ) : !isBaseFull ? (
                  <button
                    onClick={() => {
                      onSelectBase(sticker);
                      onClose();
                    }}
                    className="w-full btn-neo-pink py-2.5 px-4 text-xs font-black flex items-center justify-center gap-2 shadow-neo"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Pack</span>
                  </button>
                ) : bonusUnlocked && !isBonusFull ? (
                  <button
                    onClick={() => {
                      onSelectBonus(sticker);
                      onClose();
                    }}
                    className="w-full btn-neo-pink py-2.5 px-4 text-xs font-black flex items-center justify-center gap-2 shadow-neo animate-pulse"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Add as Bonus Free (10+2)</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-400 font-display font-bold text-xs cursor-not-allowed"
                  >
                    Pack Full (12/12 Selected)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Similar Stickers Row matching reference */}
          {similarStickers.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">
                Similar Stickers You Might Like
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {similarStickers.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectSimilar(sim)}
                    className="p-2 rounded-xl border border-black/10 bg-gray-50 hover:bg-white hover:border-black cursor-pointer text-center transition-all flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-1">
                      <img src={sim.image_path} alt={sim.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="font-display font-bold text-[10px] text-brand-dark truncate w-full">
                      {sim.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
