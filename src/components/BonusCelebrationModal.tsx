import React, { useEffect } from 'react';
import { X, Sparkles, Gift, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BonusCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseBonus: () => void;
}

export const BonusCelebrationModal: React.FC<BonusCelebrationModalProps> = ({
  isOpen,
  onClose,
  onChooseBonus,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti bursts
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#00D4D8', '#FF6EB4', '#F5E642', '#FFFFFF'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
        });
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in zoom-in-95 duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[32px] bg-slate-900 text-white border border-yellow-400/30 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow behind */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FF6EB4]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30 text-xs font-mono font-bold mb-4 shadow-soft-xs">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>10 BASE STICKERS COMPLETED</span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-black text-3xl sm:text-4xl text-amber-300 tracking-tight leading-none mb-1">
          YAY!
        </h2>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-4">
          +2 FREE STICKERS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6EB4] to-purple-400">UNLOCKED!</span>
        </h3>

        {/* Center Illustration: 2 Mystery Cards */}
        <div className="my-6 flex items-center justify-center gap-3">
          <div className="w-20 h-28 rounded-2xl bg-white/10 border-2 border-dashed border-[#FF6EB4] flex flex-col items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform shadow-soft">
            <Gift className="w-7 h-7 text-yellow-300 animate-bounce" />
            <span className="text-xs font-mono text-yellow-300 font-bold mt-1.5">#1 FREE</span>
          </div>
          <div className="w-20 h-28 rounded-2xl bg-white/10 border-2 border-dashed border-amber-400 flex flex-col items-center justify-center transform rotate-6 hover:rotate-0 transition-transform shadow-soft">
            <Sparkles className="w-7 h-7 text-pink-300 animate-pulse" />
            <span className="text-xs font-mono text-pink-300 font-bold mt-1.5">#2 FREE</span>
          </div>
        </div>

        <p className="font-body text-xs text-slate-300 mb-6 font-normal leading-relaxed">
          A little extra joy for you! Choose 2 bonus collectible designs from our catalogue completely on us.
        </p>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            onChooseBonus();
          }}
          className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-yellow-300 hover:to-amber-400 text-slate-950 py-3.5 px-6 rounded-full text-sm font-display font-black flex items-center justify-center gap-2 shadow-glow-yellow/50 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Choose 2 Free Bonus Stickers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
