import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles, Heart, Droplets, Check, ShieldCheck, Laptop, Smartphone, Coffee, Layers, Sun } from 'lucide-react';
import confetti from 'canvas-confetti';
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
  const [activeSurface, setActiveSurface] = useState<'cutout' | 'laptop' | 'phone' | 'bottle'>('cutout');

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

  const handleAddWithParticle = (e: React.MouseEvent<HTMLButtonElement>, isBonus: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 20,
      spread: 55,
      origin: { x, y },
      colors: isBonus ? ['#FF6EB4', '#FACC15', '#9B51E0'] : ['#00D4D8', '#FF6EB4', '#FACC15'],
      scalar: 0.75,
      ticks: 75,
    });

    if (isBonus) {
      onSelectBonus(sticker);
    } else {
      onSelectBase(sticker);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sticker-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-[28px] overflow-hidden relative shadow-soft-xl max-h-[92vh] flex flex-col border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Breadcrumbs & Close */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-black/[0.06] bg-slate-50/70">
          <div className="text-xs font-mono text-slate-500 font-medium flex items-center gap-1.5">
            <span>Catalogue</span>
            <span>&gt;</span>
            <span className="text-slate-800 font-semibold">{sticker.categories?.[0]?.name || sticker.style}</span>
            <span>&gt;</span>
            <span className="text-[#FF6EB4] font-bold">{sticker.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-black/10 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-soft-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Left: Sticker Canvas Display with Lifestyle Mockup Switcher */}
            <div className="sm:col-span-6 flex flex-col items-center">
              {/* Mockup Canvas */}
              <div className="relative w-full aspect-square rounded-2xl bg-slate-100/80 border border-black/[0.06] flex items-center justify-center overflow-hidden shadow-inner">
                {activeSurface === 'cutout' && (
                  <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center relative holo-foil">
                    <img
                      src={sticker.image_path}
                      alt={sticker.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.18)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}

                {activeSurface === 'laptop' && (
                  <div className="relative w-full h-full bg-gradient-to-tr from-slate-700 via-slate-600 to-slate-500 p-6 flex flex-col items-center justify-center">
                    {/* MacBook lid simulation */}
                    <div className="w-full h-44 rounded-xl bg-gradient-to-b from-slate-600 to-slate-700 border border-slate-500/50 shadow-2xl relative flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-white/20 absolute top-3.5 blur-[0.5px]" />
                      {/* Placed Sticker */}
                      <div className="w-24 h-24 relative z-10 transform -rotate-3 hover:rotate-0 transition-transform">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-300 mt-2">Space Grey MacBook Lid</span>
                  </div>
                )}

                {activeSurface === 'phone' && (
                  <div className="relative w-full h-full bg-slate-200 p-4 flex flex-col items-center justify-center">
                    {/* iPhone back simulation */}
                    <div className="w-28 h-48 rounded-[24px] bg-slate-900 border-2 border-slate-700 shadow-xl relative flex flex-col items-center justify-center p-2">
                      <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-600" />
                      </div>
                      {/* Placed Sticker */}
                      <div className="w-16 h-16 relative z-10 mt-6 transform rotate-2">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 mt-2">Matte Phone Case</span>
                  </div>
                )}

                {activeSurface === 'bottle' && (
                  <div className="relative w-full h-full bg-gradient-to-b from-teal-50 to-emerald-100 p-4 flex flex-col items-center justify-center">
                    {/* Hydroflask cylinder simulation */}
                    <div className="w-28 h-48 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-500 to-teal-800 border border-teal-600 shadow-xl relative flex items-center justify-center overflow-hidden">
                      <div className="absolute top-0 bottom-0 left-6 w-3 bg-white/20 blur-[1px]" />
                      {/* Placed Sticker curved on bottle */}
                      <div className="w-16 h-16 relative z-10">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 mt-2">Hydroflask Tumbler</span>
                  </div>
                )}
              </div>

              {/* Surface Switcher Pills with Vector Icons (No raw emojis) */}
              <div className="flex items-center gap-1.5 mt-3 bg-slate-100 p-1 rounded-full border border-black/[0.05]">
                <button
                  onClick={() => setActiveSurface('cutout')}
                  className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition-all flex items-center gap-1 ${
                    activeSurface === 'cutout'
                      ? 'bg-white text-slate-900 shadow-soft-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#FF6EB4]" />
                  <span>Die-Cut</span>
                </button>
                <button
                  onClick={() => setActiveSurface('laptop')}
                  className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition-all flex items-center gap-1 ${
                    activeSurface === 'laptop'
                      ? 'bg-white text-slate-900 shadow-soft-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Laptop className="w-3 h-3 text-sky-600" />
                  <span>Laptop</span>
                </button>
                <button
                  onClick={() => setActiveSurface('phone')}
                  className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition-all flex items-center gap-1 ${
                    activeSurface === 'phone'
                      ? 'bg-white text-slate-900 shadow-soft-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3 h-3 text-purple-600" />
                  <span>Phone</span>
                </button>
                <button
                  onClick={() => setActiveSurface('bottle')}
                  className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition-all flex items-center gap-1 ${
                    activeSurface === 'bottle'
                      ? 'bg-white text-slate-900 shadow-soft-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Coffee className="w-3 h-3 text-amber-600" />
                  <span>Bottle</span>
                </button>
              </div>
            </div>

            {/* Right: Specifications & Title */}
            <div className="sm:col-span-6 space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-50 text-pink-700 border border-pink-200">
                  {sticker.categories?.[0]?.name || sticker.style}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {sticker.style}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <h2 id="sticker-modal-title" className="font-display font-black text-2xl text-slate-900 leading-tight">
                  {sticker.name}
                </h2>
                <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full flex-shrink-0">
                  ₹49
                </span>
              </div>

              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {sticker.description || 'A collectible die-cut vinyl sticker precision cut for everyday gear, laptops, and water bottles.'}
              </p>

              {/* Specs Box with Vector Icons & Natural Copy */}
              <div className="p-3.5 rounded-2xl border border-black/[0.06] bg-slate-50/80 space-y-2 text-xs font-body">
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span><strong>Material:</strong> Weatherproof Vinyl</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span><strong>Protection:</strong> UV Sun Fade Resistance</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span><strong>Finish:</strong> Premium Matte Touch Finish</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-sky-500" />
                  <span><strong>Adhesive:</strong> Residue-Free Clean Peel</span>
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
                    className="w-full py-3 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-soft-xs active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove from Pack</span>
                  </button>
                ) : !isBaseFull ? (
                  <button
                    onClick={(e) => handleAddWithParticle(e, false)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-soft hover:shadow-soft-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Pack</span>
                  </button>
                ) : bonusUnlocked && !isBonusFull ? (
                  <button
                    onClick={(e) => handleAddWithParticle(e, true)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6EB4] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-glow-pink/30 animate-pulse transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Claim as Free Bonus (10+2)</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 font-display font-bold text-xs cursor-not-allowed"
                  >
                    Pack Full (12/12 Selected)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Similar Stickers Row */}
          {similarStickers.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                More from {sticker.style} Collection
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {similarStickers.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectSimilar(sim)}
                    className="p-2.5 rounded-2xl border border-black/[0.06] bg-slate-50 hover:bg-white hover:shadow-soft hover:border-black/15 cursor-pointer text-center transition-all flex flex-col items-center justify-center group"
                  >
                    <div className="w-14 h-14 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                      <img src={sim.image_path} alt={sim.name} className="max-h-full max-w-full object-contain filter drop-shadow-sm" />
                    </div>
                    <span className="font-display font-semibold text-[11px] text-slate-800 truncate w-full">
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
