import React from 'react';
import { ArrowRight, Sparkles, Gift, ShieldCheck, CheckCircle2, Palette } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenPackBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenPackBuilder }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Desktop Background: High-res Studio Lifestyle Scene anchored right with smooth fade to cream */}
      <div
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-[58%] pointer-events-none select-none overflow-hidden -z-10"
        aria-hidden="true"
      >
        <img
          src="/hero-studio-mockup.jpg"
          alt="Indie sticker studio desk setup"
          className="w-full h-full object-cover object-right"
        />
        {/* Soft, natural gradient that fades from the solid cream page background on the left into the desk scene */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] from-0% via-[#FAF9F6] via-28% to-transparent to-65%" />
        {/* Subtle bottom edge blend */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[480px]">
        {/* Left Column: Core Value Proposition, Headline & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left max-w-2xl relative z-10">
          {/* Promo Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200/90 text-pink-700 text-xs font-mono font-bold shadow-soft-xs">
            <Gift className="w-3.5 h-3.5 text-[#FF6EB4]" />
            <span className="tracking-wide">CURATED 10 + 2 VINYL PACK</span>
          </div>

          {/* Main Headline */}
          <div className="relative">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[62px] leading-[1.08] tracking-tight text-slate-900">
              Stick Your Story <br />
              Everywhere{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6EB4] via-purple-600 to-[#00D4D8]">
                You Vibe.
                {/* Playful curved accent underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full opacity-90"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  height="8"
                  aria-hidden="true"
                >
                  <path
                    d="M0,7 Q30,14 60,4 T100,7"
                    fill="none"
                    stroke="#FACC15"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Playful vector sparkles around headline */}
            <div className="absolute -top-3 right-8 sm:right-24 text-yellow-400 hidden sm:block pointer-events-none">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <p className="font-body text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
            Curated, precision-cut vinyl stickers for laptops, water bottles, and everyday gear.
            Handpick <strong className="text-slate-900 font-bold">10 favorite designs</strong> and get{' '}
            <span className="inline-flex items-center gap-1 font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
              <Gift className="w-3.5 h-3.5 text-[#FF6EB4]" />
              +2 FREE bonus stickers
            </span>{' '}
            automatically added to your pack.
          </p>

          {/* Main Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              id="hero-build-pack-btn"
              onClick={onOpenPackBuilder}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm sm:text-base py-3 px-6 sm:px-7 rounded-full font-display font-bold shadow-soft hover:shadow-soft-md active:scale-95 transition-all flex items-center gap-2.5 group"
            >
              <span>Build Your Pack</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-explore-collection-btn"
              onClick={onExploreClick}
              className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-sm sm:text-base py-3 px-6 rounded-full font-display font-semibold shadow-soft-xs hover:border-slate-300 transition-all active:scale-95"
            >
              <span>Browse Collection</span>
            </button>
          </div>

          {/* 4 Feature Badges Strip (matching mockup) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-6 border-t border-black/[0.06]">
            {/* 1. Curated Artwork */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-soft-xs">
              <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                <Palette className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-xs text-slate-900 truncate">Curated Artwork</div>
                <div className="text-[10px] text-slate-500 font-medium truncate">Indie studio prints</div>
              </div>
            </div>

            {/* 2. Weather-Resistant */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-soft-xs">
              <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-xs text-slate-900 truncate">Weather-Resistant</div>
                <div className="text-[10px] text-slate-500 font-medium truncate">Matte vinyl finish</div>
              </div>
            </div>

            {/* 3. Zero Residue Peel */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-soft-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-xs text-slate-900 truncate">Zero Residue Peel</div>
                <div className="text-[10px] text-slate-500 font-medium truncate">Leaves clean gear</div>
              </div>
            </div>

            {/* 4. Perfect for Everyday */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-soft-xs">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-xs text-slate-900 truncate">10 + 2 Pack Bundle</div>
                <div className="text-[10px] text-slate-500 font-medium truncate">+2 bonus gifts free</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Image Showcase (stacked below on smaller screens) */}
        <div className="lg:hidden relative rounded-2xl overflow-hidden shadow-soft border border-slate-200/80 aspect-[16/10]">
          <img
            src="/hero-studio-mockup.jpg"
            alt="Curated vinyl stickers on laptop desk setup"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-display font-bold flex items-center gap-1.5 shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Pick 10 Get 2 Free!</span>
          </div>
        </div>
      </div>
    </section>
  );
};
