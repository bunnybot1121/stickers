import React from 'react';
import { ArrowRight, Sparkles, Award, Layers, Gift, ShieldCheck, CheckCircle2, Star, Palette } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenPackBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenPackBuilder }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 px-4 sm:px-8">
      {/* Ambient background glow accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        <div className="absolute top-6 left-1/4 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl" />
        <div className="absolute top-16 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-amber-300/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Promo Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200/80 text-pink-700 text-xs font-mono font-bold shadow-soft-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4]" />
              <span className="tracking-wide">CURATED 10 + 2 VINYL PACK BUNDLE</span>
            </div>

            {/* Main Headline (Preserved exactly) */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-[66px] leading-[1.06] tracking-tight text-slate-900">
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

            <p className="font-body text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Curated vinyl stickers made for laptops, hydroflasks, and everyday gear.
              Handpick <strong className="text-slate-900 font-bold">10 favorite designs</strong> and get{' '}
              <span className="inline-flex items-center gap-1 font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                <Gift className="w-3 h-3 text-[#FF6EB4]" />
                +2 FREE bonus stickers
              </span>{' '}
              automatically added to your pack.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                id="hero-build-pack-btn"
                onClick={onOpenPackBuilder}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm sm:text-base py-3.5 px-7 flex items-center gap-2.5 font-display font-bold shadow-soft-md hover:shadow-soft-lg active:scale-95 transition-all rounded-xl group"
              >
                <span>Build Your Pack</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-collection-btn"
                onClick={onExploreClick}
                className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-sm sm:text-base py-3.5 px-6 font-display font-semibold rounded-xl shadow-soft-xs transition-all"
              >
                <span>Browse Collection</span>
              </button>
            </div>

            {/* Curated Collection Badge with Authentic Representation */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 p-0.5 flex-shrink-0 shadow-soft-xs overflow-hidden">
                  <img src="/stickers/what-the-duck.jpg" alt="Sticker preview" className="w-full h-full object-contain" />
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 p-0.5 flex-shrink-0 shadow-soft-xs overflow-hidden">
                  <img src="/stickers/headphone-girl.jpg" alt="Sticker preview" className="w-full h-full object-contain" />
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 p-0.5 flex-shrink-0 shadow-soft-xs overflow-hidden">
                  <img src="/stickers/porsche-911-gt3rs.jpg" alt="Sticker preview" className="w-full h-full object-contain" />
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 p-0.5 flex-shrink-0 shadow-soft-xs overflow-hidden">
                  <img src="/stickers/spiderman-spiderverse.jpg" alt="Sticker preview" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4]" />
                <span className="font-bold text-slate-900">Custom Die-Cut Vinyl</span>
                <span className="text-slate-300">•</span>
                <span>Curated Collector Prints</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Laptop Showcase with Single Concise Overlay Badge */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/15 via-purple-500/10 to-cyan-500/15 rounded-3xl blur-xl transform scale-95 -z-10" />

            <div className="relative w-full max-w-lg aspect-[16/11] rounded-2xl overflow-hidden bg-white p-2 border border-slate-200/80 shadow-soft-xl group transition-all duration-300">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img
                  src="/hero-laptop.jpg"
                  alt="Aesthetic laptop decorated with die-cut vinyl stickers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                {/* Single Concise Product-Image Overlay Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 text-white backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2 text-xs shadow-soft flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span className="font-display font-bold text-xs">Curated 10 + 2 Pack Deal</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-300">Weatherproof Matte Vinyl</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Strip with Honest Product Specifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-8 border-t border-black/[0.06]">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">Curated Designs</div>
              <div className="text-[11px] text-slate-500 font-medium">Precision Die-Cut Vinyl</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">10 + 2 Pack Bundle</div>
              <div className="text-[11px] text-slate-500 font-medium">2 Bonus Stickers Included</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">Weather-Resistant</div>
              <div className="text-[11px] text-slate-500 font-medium">Matte Laminated Surface</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-xs sm:text-sm text-slate-900">Clean-Peel Backing</div>
              <div className="text-[11px] text-slate-500 font-medium">Leaves Zero Sticky Residue</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
