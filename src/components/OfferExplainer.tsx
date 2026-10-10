import React from 'react';
import { Palette, Gift, Printer } from 'lucide-react';

export const OfferExplainer: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Pick 10 Base Stickers',
      desc: 'Browse our curated universe of tech, anime, gaming, and kawaii die-cut art. Add your 10 favorites to your pack.',
      icon: Palette,
      color: 'bg-brand-cyan',
      textColor: 'text-brand-dark',
    },
    {
      num: '02',
      title: 'Unlock +2 Bonus Free',
      desc: 'Hit 10 base designs and a celebratory reward burst unlocks 2 extra bonus slots on us. Choose your two bonus stickers!',
      icon: Gift,
      color: 'bg-brand-pink',
      textColor: 'text-white',
    },
    {
      num: '03',
      title: 'Submit & Print Production',
      desc: 'Submit your contact info to receive an instant order reference. Our Print Studio aggregates demand and prepares your batch.',
      icon: Printer,
      color: 'bg-brand-yellow',
      textColor: 'text-brand-dark',
    },
  ];

  return (
    <section className="py-10 px-4 sm:px-6 bg-white/70 border-y-3 border-brand-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="badge-neo bg-brand-yellow text-brand-dark mb-3">HOW THE 10 + 2 PACK WORKS</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight">
            Simple, Transparent, and Rewarding
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="card-neo p-6 relative overflow-hidden bg-white hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${step.color} ${step.textColor} border-3 border-brand-dark shadow-neo-sm flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-display font-black text-3xl text-gray-300">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-brand-dark mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-gray-600 leading-relaxed font-medium">
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
