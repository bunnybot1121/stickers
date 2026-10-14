import React from 'react';
import { ArrowRight, ShieldCheck, Droplets, Truck, Gift } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenPackBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenPackBuilder }) => {
  return (
    <section className="relative bg-[#0A0B0E] text-white overflow-hidden min-h-[520px] lg:min-h-[580px] grid grid-cols-1 lg:grid-cols-[minmax(360px,1fr)_minmax(0,1.15fr)] items-center">
      {/* Left Column: Headline, Copy, CTAs, Features */}
      <div className="relative z-10 flex flex-col justify-center items-start px-6 sm:px-12 lg:pl-16 xl:pl-20 py-10 sm:py-14 lg:py-16 max-w-2xl">
        {/* Eyebrow */}
        <p className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.22em] text-[#94A3B8] mb-3 sm:mb-4">
          Stickers for every mood
        </p>

        {/* H1 Headline matching screenshot */}
        <div className="relative">
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-[68px] xl:text-[76px] leading-[0.93] tracking-[-0.06em] uppercase text-white m-0">
            Stickers <br />
            For Your <br />
            <span className="text-[#FF2E93] inline-block relative">
              Side Quest.
              {/* Playful curved yellow squiggle doodle underline matching screenshot */}
              <svg
                className="absolute -bottom-3 left-0 w-full h-4 text-[#FACC15] pointer-events-none"
                viewBox="0 0 240 16"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 12C35 4 85 14 120 7C155 1 190 12 236 6"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed max-w-lg mt-7 mb-7 font-normal">
          Anime, coding, aesthetic and everything in between. <br />
          Tiny pieces of personality for laptops, bottles and more.
        </p>

        {/* Action CTAs matching screenshot */}
        <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
          {/* Primary Cyan Button: SHOP ALL STICKERS ➔ */}
          <button
            id="hero-explore-collection-btn"
            onClick={onExploreClick}
            className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 rounded-full bg-[#00F0FF] hover:bg-[#38f3ff] text-black font-display font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-[#00F0FF]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer uppercase"
          >
            <span>Shop all stickers</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Secondary Button: Build your 10 + 2 pack ➔ */}
          <button
            id="hero-build-pack-btn"
            onClick={onOpenPackBuilder}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-white hover:text-[#00F0FF] transition-colors py-2.5 px-2 cursor-pointer group"
          >
            <span className="border-b border-white/40 group-hover:border-[#00F0FF] pb-0.5">
              Build your 10 + 2 pack
            </span>
            <ArrowRight className="w-4 h-4 text-[#00F0FF] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Feature Badges matching screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-9 mt-3 border-t border-white/10 w-full text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-white flex-shrink-0" />
            <span className="leading-tight text-[11px] font-medium text-white/90">
              High quality <br /> vinyl stickers
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Droplets className="w-4 h-4 text-white flex-shrink-0" />
            <span className="leading-tight text-[11px] font-medium text-white/90">
              Waterproof <br /> & durable
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-white flex-shrink-0" />
            <span className="leading-tight text-[11px] font-medium text-white/90">
              Ships across <br /> India
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Gift className="w-4 h-4 text-white flex-shrink-0" />
            <span className="leading-tight text-[11px] font-medium text-white/90">
              10 + 2 <br /> Bonus Pack
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Image with seamless dark fade */}
      <div className="relative min-h-[360px] sm:min-h-[480px] lg:min-h-[580px] bg-[#0A0B0E] overflow-hidden flex items-center justify-center">
        {/* Soft Left Edge Gradient Fade for Seamless Integration with #0A0B0E */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0E] via-[#0A0B0E]/20 to-transparent z-10 pointer-events-none hidden lg:block w-1/4" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0E] to-transparent z-10 pointer-events-none lg:hidden h-16" />

        <img
          src="/hero-stickers.webp"
          alt="A collection of colourful vinyl stickers on a dark desk beside a laptop"
          className="w-full h-full object-cover object-[50%_center] select-none"
          loading="eager"
        />
      </div>
    </section>
  );
};
