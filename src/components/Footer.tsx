import React from 'react';
import { Sparkles, Heart, Shield, Database } from 'lucide-react';
import { storeService } from '../services/storeService';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateHome }) => {
  const isSupabase = storeService.isConnectedToSupabase;

  return (
    <footer className="mt-20 border-t-3 border-brand-dark bg-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-yellow border-3 border-brand-dark shadow-neo-sm flex items-center justify-center">
              <span>✨</span>
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-brand-dark">
              STICKER<span className="text-brand-pink">VERSE</span>
            </span>
          </div>

          <p className="font-body text-sm text-gray-600 max-w-sm font-medium leading-relaxed">
            The playful home for curated sticker packs. Select 10 eligible designs and unlock 2 free bonus rewards, crafted with high-definition vinyl and love.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-brand-dark bg-brand-cream text-xs font-mono font-bold">
            <Database className="w-3.5 h-3.5" />
            <span>Backend: {isSupabase ? 'Supabase PostgreSQL' : 'Local / Demo Mode (Ready for Supabase)'}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-brand-dark mb-3">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm font-medium text-gray-600 font-body">
            <li>
              <a href="#catalogue-section" className="hover:text-brand-pink transition-colors">
                Sticker Catalogue
              </a>
            </li>
            <li>
              <button onClick={onNavigateHome} className="hover:text-brand-pink transition-colors">
                10 + 2 Offer Details
              </button>
            </li>
            <li>
              <button onClick={onOpenAdmin} className="hover:text-brand-pink transition-colors flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Operations Studio</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Policies & Contact */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-brand-dark mb-3">
            Studio Policies
          </h4>
          <ul className="space-y-2 text-sm font-medium text-gray-600 font-body">
            <li><span>Order Fulfillment Policy</span></li>
            <li><span>Privacy &amp; Data Notice</span></li>
            <li><span>Contact: hello@stickerverse.craft</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t-2 border-brand-dark/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
        <div>
          © 2026 STICKER VERSE. Neo-Brutalist × Kawaii Collectibles.
        </div>
        <div className="flex items-center gap-1">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink inline" />
          <span>&amp; Supabase PostgreSQL</span>
        </div>
      </div>
    </footer>
  );
};
