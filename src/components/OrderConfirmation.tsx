import React, { useEffect } from 'react';
import { CheckCircle2, ArrowRight, Printer, Sparkles, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Sticker, PackSelectionState } from '../types';

interface OrderConfirmationProps {
  orderNumber: string;
  orderId: string;
  selection: PackSelectionState;
  stickersMap: Map<string, Sticker>;
  onReset: () => void;
  onOpenAdmin: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderNumber,
  orderId,
  selection,
  stickersMap,
  onReset,
  onOpenAdmin,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // Big double confetti explosion for the confirmation screen!
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#00D4D8', '#FF6EB4', '#F5E642', '#111111'],
    });

    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-3xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="card-neo p-6 sm:p-10 bg-white text-center shadow-neo-xl border-3 border-brand-dark">
        {/* Celebration Trophy/Icon */}
        <div className="w-20 h-20 rounded-3xl bg-brand-yellow border-3 border-brand-dark shadow-neo flex items-center justify-center mx-auto mb-6 transform -rotate-3 animate-bounce">
          <span className="text-4xl">🎉</span>
        </div>

        <span className="badge-neo bg-brand-pink text-white mb-2">ORDER ACCEPTED</span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-brand-dark tracking-tight mb-3">
          Pack Successfully Created!
        </h1>

        <p className="font-body text-base sm:text-lg text-gray-700 max-w-lg mx-auto font-medium mb-6">
          Thank you for sticking with us! Your custom <strong>10 + 2 collector pack</strong> is now registered and queued for production.
        </p>

        {/* Order Reference Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-brand-cream border-3 border-brand-dark shadow-neo-sm max-w-md mx-auto mb-8 flex items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
              Order Reference Number
            </span>
            <span id="order-reference-code" className="font-mono font-black text-xl sm:text-2xl text-brand-dark">
              {orderNumber}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100 shadow-neo-sm transition-all"
            title="Copy order number"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-brand-dark" />}
          </button>
        </div>

        {/* Selected Items Snapshot Grid */}
        <div className="text-left mb-8">
          <h3 className="font-display font-bold text-lg text-brand-dark mb-3 flex items-center justify-between">
            <span>Your 12 Chosen Designs:</span>
            <span className="text-xs font-mono text-gray-500 font-bold">10 Base + 2 Bonus Free</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {[...selection.baseStickerIds, ...selection.bonusStickerIds].map((id, idx) => {
              const sticker = stickersMap.get(id);
              const isBonus = idx >= 10;

              return (
                <div
                  key={`${id}-${idx}`}
                  className={`p-2.5 rounded-xl border-2 border-brand-dark flex flex-col items-center text-center ${
                    isBonus ? 'bg-pink-50 ring-2 ring-brand-pink/50' : 'bg-gray-50'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center my-1">
                    {sticker?.image_path ? (
                      <img src={sticker.image_path} alt={sticker.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-brand-pink" />
                    )}
                  </div>
                  <span className="font-display font-bold text-[11px] text-brand-dark truncate w-full">
                    {sticker?.name || 'Sticker'}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {isBonus ? '★ Bonus' : `#${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps Information */}
        <div className="p-4 rounded-xl bg-cyan-50/60 border-2 border-brand-dark text-left mb-8 text-xs font-medium text-gray-700 space-y-1.5">
          <div className="font-display font-bold text-sm text-brand-dark flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-brand-cyan" />
            <span>Next Steps in Production:</span>
          </div>
          <p>• Our studio reviews line items and batches them into the Print Studio queue.</p>
          <p>• High-definition laser cutting &amp; UV lamination begins.</p>
          <p>• You will be contacted via your provided details when your pack is dispatched!</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            id="build-another-pack-btn"
            onClick={onReset}
            className="btn-neo-yellow text-sm sm:text-base py-3 px-6 flex items-center gap-2"
          >
            <span>Build Another Pack</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAdmin}
            className="btn-neo-white text-sm sm:text-base py-3 px-6"
          >
            <span>View Order in Admin Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
