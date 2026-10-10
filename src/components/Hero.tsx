import React from 'react';
import { ArrowRight, Sparkles, Award, Layers, Gift, Droplets, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenPackBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenPackBuilder }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-8">
      {/* Ambient background glow orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-amber-300/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Typography, Social Proof & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Promo Pill with iridescent micro-glow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-500/20 text-pink-700 text-xs font-mono font-bold shadow-soft-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4] animate-spin" style={{ animationDuration: '6s' }} />
              <span className="tracking-wide">THE 10 + 2 CURATED PACK DROP IS LIVE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-[68px] leading-[1.06] tracking-tight text-slate-900">
              Stick Your Story{' '}
              <span className="inline-block transform hover:rotate-12 transition-transform duration-300 cursor-default">
                ✨
              </span>
              <br />
              Everywhere{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6EB4] via-purple-600 to-[#00D4D8]">
                You Vibe.
                {/* Organic wavy accent curve */}
                <svg
                  className="absolute -bottom-2 left-0 w-full opacity-80"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  height="8"
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

            <p className="font-body text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Premium waterproof vinyl stickers curated for laptops, hydroflasks, and everyday gear.
              Handpick <strong className="text-slate-900 font-bold">10 favorite designs</strong> and unlock{' '}
              <span className="inline-flex items-center gap-1 font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                +2 FREE bonus stickers
              </span>{' '}
              automatically on us!
            </p>

            {/* Main CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-build-pack-btn"
                onClick={onOpenPackBuilder}
                className="btn-neo-dark text-sm sm:text-base py-3.5 px-7 flex items-center gap-2.5 font-bold shadow-soft-md group"
              >
                <span>Build Your Pack</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-collection-btn"
                onClick={onExploreClick}
                className="btn-neo-white text-sm sm:text-base py-3.5 px-6 font-semibold"
              >
                <span>Browse 24+ Stickers</span>
              </button>
            </div>

            {/* Social Proof & Trust Strip */}
            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-slate-600">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-pink-100 flex items-center justify-center text-xs">🐱</span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-purple-100 flex items-center justify-center text-xs">💻</span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-cyan-100 flex items-center justify-center text-xs">🎮</span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-amber-100 flex items-center justify-center text-xs">🌸</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="font-bold text-slate-900">4.9/5</span>
                <span className="text-slate-400">•</span>
                <span>Loved by 12,000+ creators</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Flatlay with Floating Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient colorful card glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/10 to-cyan-500/20 rounded-[32px] blur-xl transform scale-95 -z-10" />

            <div className="relative w-full max-w-lg aspect-[16/11] rounded-[28px] overflow-hidden bg-white/60 p-2.5 backdrop-blur-xl border border-black/[0.08] shadow-soft-xl group transition-all duration-500 hover:shadow-2xl">
              <div className="relative w-full h-full rounded-[22px] overflow-hidden">
                <img
                  src="/hero-laptop.jpg"
                  alt="Aesthetic laptop covered in vibrant stickers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Tag 1: "- 10 + 2 Free Stickers! -" */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-black/10 rounded-full px-3.5 py-1.5 text-xs font-mono font-bold text-slate-900 shadow-soft flex items-center gap-1.5 animate-subtle-float">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                  <span>10 + 2 Special Pack</span>
                </div>

                {/* Floating Tag 2: "Waterproof Vinyl" */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-display font-medium shadow-soft flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>100% Dishwasher Proof Vinyl</span>
                </div>

                {/* Floating Tag 3: "Precision Die-Cut" */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-black/10 rounded-full px-3 py-1.5 text-[11px] font-mono font-bold text-slate-800 shadow-soft hidden sm:flex items-center gap-1">
                  <span>✂️ Laser Die-Cut</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Strip with Modern Glass Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-14 pt-8 border-t border-black/[0.06]">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.06] shadow-soft-xs hover:shadow-soft transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-lg flex-shrink-0">
              🎨
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">Original Artwork</div>
              <div className="text-[11px] text-slate-500 font-medium">100% Unique Die-Cut Art</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.06] shadow-soft-xs hover:shadow-soft transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg flex-shrink-0">
              🎁
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">10 + 2 Pack Deal</div>
              <div className="text-[11px] text-slate-500 font-medium">+2 Free Bonus Included</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.06] shadow-soft-xs hover:shadow-soft transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg flex-shrink-0">
              💧
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">Weather & UV Safe</div>
              <div className="text-[11px] text-slate-500 font-medium">Zero-Fade Matte Coating</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.06] shadow-soft-xs hover:shadow-soft transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
              ✨
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">Clean Peel Adhesive</div>
              <div className="text-[11px] text-slate-500 font-medium">Leaves Zero Sticky Residue</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
