import React from 'react';
import { Palette, Gift, CheckCircle2, Sparkles } from 'lucide-react';

interface StepData {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  lightBg: string;
  textColor: string;
  highlightText?: string;
}

const STEPS: StepData[] = [
  {
    title: 'Handpick 10 Base Stickers',
    desc: 'Browse our curated collection of coding, anime, motorsport, gaming, and meme die-cut designs. Pick any 10 favorites for your pack.',
    icon: Palette,
    accentColor: 'from-sky-500 to-cyan-500',
    lightBg: 'bg-sky-50',
    textColor: 'text-sky-600',
    highlightText: 'Base Selection',
  },
  {
    title: 'Unlock +2 Bonus Free Gifts',
    desc: 'Once your 10th sticker is selected, your 2 free bonus collectible slots unlock instantly. Choose any 2 stickers completely free.',
    icon: Gift,
    accentColor: 'from-[#FF6EB4] to-purple-600',
    lightBg: 'bg-pink-50',
    textColor: 'text-pink-600',
    highlightText: 'Unlocked at 10',
  },
  {
    title: 'Confirm & Reserve Your Pack',
    desc: 'Enter your name and phone number to reserve your 12-sticker custom bundle. Pay upon delivery after inspecting your stickers.',
    icon: CheckCircle2,
    accentColor: 'from-emerald-400 to-teal-500',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    highlightText: 'No Prepayment',
  },
];

export const OfferExplainer: React.FC = () => {
  return (
    <section id="offer-explainer-section" className="py-16 px-4 sm:px-8 bg-white/70 backdrop-blur-md border-y border-black/[0.05] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-mono font-bold mb-3 shadow-soft-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4]" />
            <span>HOW THE 10 + 2 PACK WORKS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Simple, Transparent, and Rewarding
          </h2>
          <p className="font-body text-sm sm:text-base text-slate-600 mt-2 font-normal">
            No subscriptions or hidden fees. Premium matte-laminated vinyl stickers crafted for durability.
          </p>
        </div>

        {/* 3 Step Connected Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            // Both decorative step number and label are strictly generated from source index
            const stepNumber = String(index + 1).padStart(2, '0');
            const stepLabel = `Step ${index + 1}`;

            return (
              <div
                key={stepNumber}
                className="group relative rounded-2xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-soft hover:shadow-soft-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between"
              >
                {/* Ambient top border accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.accentColor}`} />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl ${step.lightBg} ${step.textColor} flex items-center justify-center shadow-soft-xs group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Synchronized decorative step number: 01, 02, 03 */}
                    <span className="font-mono font-black text-3xl text-slate-300 group-hover:text-slate-400 transition-colors select-none">
                      {stepNumber}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-block text-[11px] font-mono font-bold uppercase tracking-wider ${step.textColor}`}>
                        {stepLabel}
                      </span>
                      {step.highlightText && (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {step.highlightText}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
