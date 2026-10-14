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
        className="w-full max-w-2xl bg-[#111319] text-white rounded-[28px] overflow-hidden relative shadow-2xl max-h-[92vh] flex flex-col border border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Breadcrumbs & Close */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#0A0B0E]">
          <div className="text-xs font-mono text-slate-400 font-medium flex items-center gap-1.5">
            <span>Catalogue</span>
            <span>&gt;</span>
            <span className="text-white font-semibold">{sticker.categories?.[0]?.name || sticker.style}</span>
            <span>&gt;</span>
            <span className="text-[#FF2E93] font-bold">{sticker.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-colors"
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
              <div className="relative w-full aspect-square rounded-2xl bg-[#171922] border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                {activeSurface === 'cutout' && (
                  <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center relative">
                    <img
                      src={sticker.image_path}
                      alt={sticker.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}

                {activeSurface === 'laptop' && (
                  <div className="relative w-full h-full bg-gradient-to-tr from-[#111319] via-[#1a1e28] to-[#252a38] p-6 flex flex-col items-center justify-center">
                    {/* MacBook lid simulation */}
                    <div className="w-full h-44 rounded-xl bg-gradient-to-b from-[#202534] to-[#151821] border border-white/10 shadow-2xl relative flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-white/30 absolute top-3.5 blur-[0.5px]" />
                      {/* Placed Sticker */}
                      <div className="w-24 h-24 relative z-10 transform -rotate-3 hover:rotate-0 transition-transform">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-2">Space Grey MacBook Lid</span>
                  </div>
                )}

                {activeSurface === 'phone' && (
                  <div className="relative w-full h-full bg-[#141721] p-4 flex flex-col items-center justify-center">
                    {/* iPhone back simulation */}
                    <div className="w-28 h-48 rounded-[24px] bg-[#0A0B0E] border-2 border-white/15 shadow-xl relative flex flex-col items-center justify-center p-2">
                      <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-xl bg-[#171922] border border-white/10 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/20" />
                      </div>
                      {/* Placed Sticker */}
                      <div className="w-16 h-16 relative z-10 mt-6 transform rotate-2">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-2">Matte Phone Case</span>
                  </div>
                )}

                {activeSurface === 'bottle' && (
                  <div className="relative w-full h-full bg-gradient-to-b from-[#0e1626] to-[#0A0B0E] p-4 flex flex-col items-center justify-center">
                    {/* Hydroflask cylinder simulation */}
                    <div className="w-28 h-48 rounded-2xl bg-gradient-to-r from-[#17253b] via-[#1f3250] to-[#121c2e] border border-white/15 shadow-xl relative flex items-center justify-center overflow-hidden">
                      <div className="absolute top-0 bottom-0 left-6 w-3 bg-white/10 blur-[1px]" />
                      {/* Placed Sticker curved on bottle */}
                      <div className="w-16 h-16 relative z-10">
                        <img
                          src={sticker.image_path}
                          alt={sticker.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-2">Hydroflask Tumbler</span>
                  </div>
                )}
              </div>

              {/* Surface Switcher Pills */}
              <div className="flex items-center gap-1.5 mt-3 bg-[#171922] p-1 rounded-full border border-white/10">
                <button
                  onClick={() => setActiveSurface('cutout')}
                  className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition-all flex items-center gap-1 ${
                    activeSurface === 'cutout'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#FF2E93]" />
                  <span>Die-Cut</span>
                </button>
                <button
                  onClick={() => setActiveSurface('laptop')}
                  className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition-all flex items-center gap-1 ${
                    activeSurface === 'laptop'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Laptop className="w-3 h-3 text-[#00F0FF]" />
                  <span>Laptop</span>
                </button>
                <button
                  onClick={() => setActiveSurface('phone')}
                  className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition-all flex items-center gap-1 ${
                    activeSurface === 'phone'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3 text-purple-400" />
                  <span>Phone</span>
                </button>
                <button
                  onClick={() => setActiveSurface('bottle')}
                  className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition-all flex items-center gap-1 ${
                    activeSurface === 'bottle'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Coffee className="w-3 h-3 text-amber-400" />
                  <span>Bottle</span>
                </button>
              </div>
            </div>

            {/* Right: Specifications & Title */}
            <div className="sm:col-span-6 space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF2E93]/15 text-[#FF2E93] border border-[#FF2E93]/30">
                  {sticker.categories?.[0]?.name || sticker.style}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                  {sticker.style}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <h2 id="sticker-modal-title" className="font-display font-black text-2xl text-white leading-tight">
                  {sticker.name}
                </h2>
                <span className="font-mono font-bold text-sm text-white bg-white/10 px-2.5 py-0.5 rounded-full flex-shrink-0">
                  ₹49
                </span>
              </div>

              <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {sticker.description || 'A collectible die-cut vinyl sticker precision cut for everyday gear, laptops, and water bottles.'}
              </p>

              {/* Specs Box */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-[#171922] space-y-2 text-xs font-body">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span><strong className="text-white">Material:</strong> Weatherproof Vinyl</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Sun className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span><strong className="text-white">Protection:</strong> UV Sun Fade Resistance</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span><strong className="text-white">Finish:</strong> Premium Matte Touch Finish</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span><strong className="text-white">Adhesive:</strong> Residue-Free Clean Peel</span>
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
                    className="w-full py-3 px-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove from Pack</span>
                  </button>
                ) : !isBaseFull ? (
                  <button
                    onClick={(e) => handleAddWithParticle(e, false)}
                    className="w-full py-3 px-4 rounded-xl bg-[#00F0FF] hover:bg-[#38f3ff] text-black font-display font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00F0FF]/20 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add to Pack</span>
                  </button>
                ) : bonusUnlocked && !isBonusFull ? (
                  <button
                    onClick={(e) => handleAddWithParticle(e, true)}
                    className="w-full py-3 px-4 rounded-xl bg-[#FF2E93] hover:bg-[#ff4fa5] text-white font-display font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF2E93]/30 animate-pulse transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Claim as Free Bonus (10+2)</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/5 text-slate-500 font-display font-bold text-xs cursor-not-allowed"
                  >
                    Pack Full (12/12 Selected)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Similar Stickers Row */}
          {similarStickers.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                More from {sticker.style} Collection
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {similarStickers.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectSimilar(sim)}
                    className="p-2.5 rounded-2xl border border-white/10 bg-[#171922] hover:bg-[#1c202c] hover:border-white/20 cursor-pointer text-center transition-all flex flex-col items-center justify-center group"
                  >
                    <div className="w-14 h-14 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                      <img src={sim.image_path} alt={sim.name} className="max-h-full max-w-full object-contain filter drop-shadow-sm" />
                    </div>
                    <span className="font-display font-semibold text-[11px] text-white truncate w-full">
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
