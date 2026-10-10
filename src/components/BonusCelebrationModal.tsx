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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95 duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#12131A] text-white border-2 border-yellow-400/50 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden"
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-xs font-mono font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>10 BASE STICKERS COMPLETED</span>
        </div>

        {/* Headline matching screenshot 07 */}
        <h2 className="font-display font-black text-3xl sm:text-4xl text-[#FACC15] tracking-tight leading-none mb-1">
          YAY!
        </h2>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-4">
          +2 FREE STICKERS <br />
          <span className="text-[#FF6EB4]">UNLOCKED!</span>
        </h3>

        {/* Center Illustration: 2 Mystery Cards / Gift Box matching reference */}
        <div className="my-6 flex items-center justify-center gap-3">
          <div className="w-20 h-28 rounded-2xl bg-white/10 border-2 border-dashed border-[#FF6EB4] flex flex-col items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform">
            <span className="text-2xl">🎁</span>
            <span className="text-xs font-mono text-yellow-300 font-bold mt-1">#1 FREE</span>
          </div>
          <div className="w-20 h-28 rounded-2xl bg-white/10 border-2 border-dashed border-[#FACC15] flex flex-col items-center justify-center transform rotate-6 hover:rotate-0 transition-transform">
            <span className="text-2xl">✨</span>
            <span className="text-xs font-mono text-pink-300 font-bold mt-1">#2 FREE</span>
          </div>
        </div>

        <p className="font-body text-xs text-gray-300 mb-6 font-medium">
          A little extra happiness for you! Select 2 bonus sticker designs from the catalogue on us.
        </p>

        {/* Action Button matching reference */}
        <button
          onClick={() => {
            onClose();
            onChooseBonus();
          }}
          className="w-full btn-neo-yellow py-3 px-5 text-sm sm:text-base font-black flex items-center justify-center gap-2 shadow-neo animate-bounce"
        >
          <span>Choose Your 2 Bonus Stickers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
