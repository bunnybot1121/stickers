import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateHome }) => {
  return (
    <footer className="bg-[#0A0B0E] text-slate-300 pt-14 pb-10 px-6 sm:px-12 lg:px-16 mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Top Footer Columns */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 pb-12">
          {/* Brand Mission Column */}
          <div className="max-w-xs space-y-3">
            <div
              onClick={onNavigateHome}
              className="font-display font-black text-2xl tracking-tight text-white cursor-pointer select-none flex items-center gap-1"
            >
              <span className="tracking-tighter">STICKER<span className="text-[#00F0FF]">VERSE</span></span>
              <span className="text-[#FF2E93] text-lg font-bold">✦</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Small art. Big personality. A little reminder that ordinary laptops and notebooks can be a lot more fun.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex flex-wrap gap-12 sm:gap-16 lg:gap-20 text-xs">
            {/* Explore Column */}
            <div className="flex flex-col gap-2.5 text-slate-300">
              <b className="text-white text-[10px] font-mono font-black uppercase tracking-[0.18em] mb-1">
                Explore
              </b>
              <a href="#catalogue-section" className="hover:text-[#00F0FF] transition-colors">
                Shop all
              </a>
              <a href="#catalogue-section" className="hover:text-[#00F0FF] transition-colors">
                Anime & Chibi
              </a>
              <a href="#catalogue-section" className="hover:text-[#00F0FF] transition-colors">
                Coding & Tech
              </a>
              <a href="#offer-explainer-section" className="hover:text-[#00F0FF] transition-colors">
                Build a pack (10 + 2)
              </a>
            </div>

            {/* Help Column */}
            <div className="flex flex-col gap-2.5 text-slate-300">
              <b className="text-white text-[10px] font-mono font-black uppercase tracking-[0.18em] mb-1">
                Help & Info
              </b>
              <a href="#offer-explainer-section" className="hover:text-[#00F0FF] transition-colors">
                Our story
              </a>
              <span className="text-slate-500">
                Shipping across India
              </span>
              <span className="text-slate-500">
                Waterproof vinyl guarantee
              </span>
              <button
                onClick={onOpenAdmin}
                className="hover:text-[#00F0FF] text-left transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 pt-1"
              >
                <Shield className="w-3 h-3 text-[#00F0FF]" />
                <span>Store admin ↗</span>
              </button>
            </div>

            {/* Follow the fun Column */}
            <div className="flex flex-col gap-2.5 text-slate-300">
              <b className="text-white text-[10px] font-mono font-black uppercase tracking-[0.18em] mb-1">
                Follow the fun
              </b>
              <span className="text-slate-400">
                Instagram ↗
              </span>
              <span className="text-slate-400">
                Discord ↗
              </span>
              <span className="text-[#FF2E93] font-medium pt-1">
                Made for your side quest ✦
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Tagline */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <span>© 2026 Stickerverse. All rights reserved.</span>
          <span className="text-[#FACC15]">Tiny pieces of personality for your everyday carry.</span>
        </div>
      </div>
    </footer>
  );
};
