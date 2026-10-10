import React from 'react';
import { Palette, Gift, Truck, Check, Sparkles, ArrowRight } from 'lucide-react';

export const OfferExplainer: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Handpick 10 Base Stickers',
      desc: 'Browse our curated catalog of coding, anime, gaming, and aesthetic die-cut art. Add your 10 favorites to your pack.',
      icon: Palette,
      badge: 'Step 1',
      color: 'from-sky-500 to-cyan-500',
      lightBg: 'bg-sky-50',
      textColor: 'text-sky-600',
    },
    {
      num: '02',
      title: 'Unlock +2 Bonus Free Gifts',
      desc: 'The moment your 10th sticker drops into your tray, an instant reward burst unlocks 2 extra bonus collectibles on the house.',
      icon: Gift,
      badge: 'Unlocked at 10',
      color: 'from-[#FF6EB4] to-purple-600',
      lightBg: 'bg-pink-50',
      textColor: 'text-pink-600',
    },
    {
      num: '03',
      title: 'Sealed & Shipped to Doorstep',
      desc: 'Confirm your phone and delivery address. Your stickers are carefully packed and delivered in protective rigid mailers.',
      icon: Truck,
      badge: 'Fast Dispatch',
      color: 'from-amber-400 to-orange-500',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <section id="offer-explainer-section" className="py-16 px-4 sm:px-8 bg-white/60 backdrop-blur-md border-y border-black/[0.05] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-mono font-bold mb-3 shadow-soft-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4]" />
            <span>HOW THE 10 + 2 PACK WORKS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Simple, Transparent, and Rewarding
          </h2>
          <p className="font-body text-sm sm:text-base text-slate-600 mt-2 font-normal">
            No subscriptions or hidden fees. Just curated vinyl stickers crafted with love.
          </p>
        </div>

        {/* 3 Step Connected Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative rounded-3xl bg-white p-7 border border-black/[0.07] shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Ambient top border gradient */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`} />

                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-2xl ${step.lightBg} ${step.textColor} flex items-center justify-center shadow-soft-xs group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-display font-black text-3xl text-slate-200 group-hover:text-slate-300 transition-colors">
                    {step.num}
                  </span>
                </div>

                <div className="mb-2">
                  <span className={`inline-block text-[11px] font-mono font-bold uppercase tracking-wider ${step.textColor} mb-1`}>
                    {step.badge}
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {step.title}
                  </h3>
                </div>

                <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
