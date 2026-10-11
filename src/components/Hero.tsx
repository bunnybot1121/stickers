import React from 'react';
import { ArrowRight, Sparkles, Award, Layers, Gift, ShieldCheck, CheckCircle2, Star, Palette } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenPackBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenPackBuilder }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-22 px-4 sm:px-8">
      {/* Scattered background floating stickers that fill up the page aesthetically */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        {/* Ambient background glow orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-amber-300/10 rounded-full blur-3xl" />

        {/* Scattered Real Die-Cut Stickers from user collection with soft shadows and natural tilt angles */}
        <div className="pointer-events-auto">
          {/* Top-left sticker: 80s retro sticker */}
          <div className="absolute top-8 left-4 2xl:left-12 hidden lg:block transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 animate-subtle-float">
            <img
              src="/stickers/decorations/80-s-sticker-pegatinas-retro.jpg"
              alt="80s Retro Sticker"
              className="w-20 h-20 xl:w-24 xl:h-24 rounded-2xl object-cover filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)] ring-2 ring-white/90"
            />
          </div>

          {/* Bottom-left sticker: Adorable Penguin */}
          <div className="absolute bottom-12 left-6 2xl:left-16 hidden lg:block transform rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300">
            <img
              src="/stickers/decorations/sticker-laptop-adorable-penguin-loading-sticker.jpg"
              alt="Penguin Loading Sticker"
              className="w-20 h-20 xl:w-24 xl:h-24 rounded-2xl object-cover filter drop-shadow-[0_14px_20px_rgba(0,0,0,0.18)] ring-2 ring-white/90"
            />
          </div>

          {/* Top-right sticker: Retro Gaming */}
          <div
            className="absolute top-6 right-8 2xl:right-16 hidden lg:block transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300 animate-subtle-float"
            style={{ animationDelay: '1.8s' }}
          >
            <img
              src="/stickers/decorations/retro-gaming-stickers-for-pc-phone-shop-now-and-personalize-your-setup.jpg"
              alt="Retro Gaming Sticker"
              className="w-20 h-20 xl:w-24 xl:h-24 rounded-2xl object-cover filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)] ring-2 ring-white/90"
            />
          </div>

          {/* Bottom-right sticker: Spider-Verse */}
          <div className="absolute bottom-14 right-6 2xl:right-14 hidden lg:block transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300">
            <img
              src="/stickers/decorations/spider-man-sticker-for-laptop-across-the-spiderverse-spider-sticker.jpg"
              alt="Spider Sticker"
              className="w-20 h-20 xl:w-22 xl:h-22 rounded-2xl object-cover filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)] ring-2 ring-white/90"
            />
          </div>

          {/* Extra mid decorative sticker: Pacman Ghosts */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 hidden 2xl:block transform rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300">
            <img
              src="/stickers/decorations/diy-laptop-sticker-pacman-ghosts-by-seingalad.jpg"
              alt="Pacman Ghosts Sticker"
              className="w-18 h-18 rounded-2xl object-cover filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.16)] ring-2 ring-white/90 opacity-90"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Typography, Social Proof & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Promo Pill with vector sparkle */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-500/20 text-pink-700 text-xs font-mono font-bold shadow-soft-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4] animate-spin" style={{ animationDuration: '6s' }} />
              <span className="tracking-wide">CURATED 10 + 2 VINYL PACK BUNDLE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-[68px] leading-[1.06] tracking-tight text-slate-900">
              Stick Your Story <br />
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
              Curated vinyl stickers made for laptops, hydroflasks, and everyday gear.
              Handpick <strong className="text-slate-900 font-bold">10 favorite designs</strong> and get{' '}
              <span className="inline-flex items-center gap-1 font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                <Gift className="w-3 h-3 text-[#FF6EB4]" />
                +2 FREE bonus stickers
              </span>{' '}
              automatically added to your pack.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-build-pack-btn"
                onClick={onOpenPackBuilder}
                className="btn-neo-dark text-sm sm:text-base py-3.5 px-7 flex items-center gap-2.5 font-bold shadow-soft-md group rounded-full"
              >
                <span>Build Your Pack</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-collection-btn"
                onClick={onExploreClick}
                className="btn-neo-white text-sm sm:text-base py-3.5 px-6 font-semibold rounded-full"
              >
                <span>Browse Collection</span>
              </button>
            </div>

            {/* Curated Collection Badge (Authentic, no fake metrics) */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5 text-xs text-slate-600">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-pink-50 p-0.5 flex-shrink-0 shadow-soft-xs overflow-hidden">
                  <img src="/stickers/what-the-duck.jpg" alt="Duck Debugger" className="w-full h-full object-cover" />
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-50 p-0 flex-shrink-0 shadow-soft-xs overflow-hidden">
                  <img src="/stickers/headphone-girl.jpg" alt="Cyberpunk Girl" className="w-full h-full object-cover" />
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-50 p-0.5 flex-shrink-0 shadow-soft-xs overflow-hidden">
                  <img src="/stickers/porsche-911-gt3rs.jpg" alt="Porsche GT3" className="w-full h-full object-cover" />
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-cyan-50 p-0.5 flex-shrink-0 shadow-soft-xs overflow-hidden">
                  <img src="/stickers/spiderman-spiderverse.jpg" alt="Spider-Man" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4]" />
                <span className="font-bold text-slate-900">Custom Die-Cut Vinyl</span>
                <span className="text-slate-400">•</span>
                <span>Original Curated Artwork</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Flatlay with Vector Badges */}
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

                {/* Floating Tag 1: Vector Sparkle badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-black/10 rounded-full px-3.5 py-1.5 text-xs font-mono font-bold text-slate-900 shadow-soft flex items-center gap-1.5 animate-subtle-float">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4]" />
                  <span>10 + 2 Pack Deal</span>
                </div>

                {/* Floating Tag 2: Weatherproof */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-display font-medium shadow-soft flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Matte Weatherproof Vinyl</span>
                </div>

                {/* Floating Tag 3: Clean Peel */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-black/10 rounded-full px-3.5 py-1.5 text-[11px] font-mono font-bold text-slate-800 shadow-soft hidden sm:flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-purple-600" />
                  <span>Clean-Peel Adhesive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Strip with Vector Icons (No emojis) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-14 pt-8 border-t border-black/[0.06]">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.06] shadow-soft-xs hover:shadow-soft transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">Original Artwork</div>
              <div className="text-[11px] text-slate-500 font-medium">Unique Curated Designs</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.06] shadow-soft-xs hover:shadow-soft transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">10 + 2 Pack Bundle</div>
              <div className="text-[11px] text-slate-500 font-medium">2 Free Bonus Included</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.06] shadow-soft-xs hover:shadow-soft transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">Weather-Resistant</div>
              <div className="text-[11px] text-slate-500 font-medium">Matte Laminated Vinyl</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.06] shadow-soft-xs hover:shadow-soft transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">Zero Residue Peel</div>
              <div className="text-[11px] text-slate-500 font-medium">Leaves Gear Pristine</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
