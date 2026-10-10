import React, { useEffect, useState } from 'react';
import { Package, ArrowLeft, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  const [showItems, setShowItems] = useState(false);

  // Format order ID like #STK2026-0017
  const formattedOrderId = orderNumber.startsWith('ORD-')
    ? `#STK2026-${orderNumber.replace('ORD-', '')}`
    : `#${orderNumber}`;

  useEffect(() => {
    // Joyful celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6EB4', '#FACC15', '#00D4D8', '#11131A'],
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOrderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-10 sm:py-16 px-4 max-w-md mx-auto animate-in zoom-in-95 duration-300">
      <div className="bg-white rounded-[32px] border border-black/10 p-6 sm:p-8 text-center shadow-soft-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF6EB4] via-[#FACC15] to-[#00D4D8]" />

        {/* Top Mini Header */}
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-lg tracking-tight text-slate-900">
              STICKER<span className="text-[#FF6EB4]">VERSE</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>10 + 2 PACK</span>
          </span>
        </div>

        {/* Cute Cat in Delivery Box SVG Illustration */}
        <div className="relative w-44 h-44 mx-auto my-3 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
            {/* Sparkles & Stars */}
            <circle cx="35" cy="40" r="4" fill="#FACC15" />
            <circle cx="165" cy="45" r="4" fill="#FACC15" />
            <circle cx="25" cy="90" r="3" fill="#FF6EB4" />
            <circle cx="175" cy="85" r="3.5" fill="#00D4D8" />
            <polygon points="40,25 43,33 51,33 45,38 47,46 40,41 33,46 35,38 29,33 37,33" fill="#FACC15" />
            <polygon points="160,20 162,26 168,26 163,30 165,36 160,32 155,36 157,30 152,26 158,26" fill="#FF6EB4" />

            {/* Black Cat Body & Head sitting inside box */}
            <path
              d="M 65 110 C 65 70, 135 70, 135 110 Z"
              fill="#18181B"
            />
            {/* Left Ear */}
            <polygon points="70,82 58,52 86,72" fill="#18181B" />
            <polygon points="71,80 64,58 83,72" fill="#FF6EB4" />
            {/* Right Ear */}
            <polygon points="130,82 142,52 114,72" fill="#18181B" />
            <polygon points="129,80 136,58 117,72" fill="#FF6EB4" />

            {/* Cat Face */}
            <ellipse cx="85" cy="92" rx="6" ry="8" fill="#FFFFFF" />
            <circle cx="86" cy="93" r="4.5" fill="#18181B" />
            <circle cx="87" cy="90" r="1.5" fill="#FFFFFF" />
            <ellipse cx="115" cy="92" rx="6" ry="8" fill="#FFFFFF" />
            <circle cx="114" cy="93" r="4.5" fill="#18181B" />
            <circle cx="113" cy="90" r="1.5" fill="#FFFFFF" />

            {/* Nose & Mouth */}
            <polygon points="98,99 102,99 100,102" fill="#FF6EB4" />
            <path d="M 97 103 Q 100 106 103 103" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            {/* Whiskers */}
            <line x1="72" y1="96" x2="56" y2="93" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="72" y1="101" x2="55" y2="102" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="128" y1="96" x2="144" y2="93" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="128" y1="101" x2="145" y2="102" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

            {/* Little Paws on top of the box edge */}
            <ellipse cx="78" cy="115" rx="7" ry="5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
            <ellipse cx="122" cy="115" rx="7" ry="5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />

            {/* Cardboard Box Front */}
            <path
              d="M 45 115 L 155 115 L 150 175 L 50 175 Z"
              fill="#EAD0A8"
              stroke="#18181B"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path d="M 45 115 L 100 130 L 155 115" stroke="#18181B" strokeWidth="3" fill="#DDBB88" />
            <rect x="90" y="125" width="20" height="48" fill="#F4E0BE" stroke="#18181B" strokeWidth="2" strokeDasharray="4 2" />
            <polygon points="100,146 102,151 107,151 103,154 105,159 100,156 95,159 97,154 93,151 98,151" fill="#B38959" />
          </svg>
        </div>

        {/* Headlines */}
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mb-2">
          Order Submitted!
        </h1>
        <p className="font-body text-xs sm:text-sm text-slate-500 font-normal max-w-xs mx-auto mb-5 leading-relaxed">
          Thank you! We've received your curated pack request. Your order is queued for laser die-cut production!
        </p>

        {/* Order ID & Status Box */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 mb-5 shadow-soft-xs flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              Order ID
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono font-bold text-sm sm:text-base text-slate-900">
                {formattedOrderId}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
              Status
            </span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Pending
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => onOpenAdmin()}
            className="w-full py-3 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm shadow-soft-md flex items-center justify-center gap-2 transition-all"
          >
            <Package className="w-4 h-4 text-pink-400" />
            <span>Track in Admin Console</span>
          </button>

          <button
            onClick={onReset}
            className="w-full py-3 px-5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-display font-semibold text-sm shadow-soft-xs transition-all"
          >
            Back to Home
          </button>
        </div>

        {/* Expandable Sticker Item Thumbnails */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => setShowItems(!showItems)}
            className="text-[11px] font-mono font-semibold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <span>{showItems ? 'Hide' : 'Review'} Pack Items ({selection.baseStickerIds.length + selection.bonusStickerIds.length})</span>
          </button>

          {showItems && (
            <div className="grid grid-cols-6 gap-2 mt-3 animate-in fade-in">
              {[...selection.baseStickerIds, ...selection.bonusStickerIds].map((id, idx) => {
                const s = stickersMap.get(id);
                const isBonus = idx >= 10;
                return (
                  <div
                    key={`${id}-${idx}`}
                    className={`aspect-square rounded-xl border p-1 flex items-center justify-center shadow-soft-xs ${
                      isBonus ? 'border-pink-300 bg-pink-50' : 'border-slate-200 bg-white'
                    }`}
                    title={s?.name}
                  >
                    {s?.image_path ? (
                      <img src={s.image_path} alt={s.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-[#FF6EB4]" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
