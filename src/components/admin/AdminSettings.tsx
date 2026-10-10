import React, { useState } from 'react';
import { Settings, Save, Database, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { PackRule } from '../../types';
import { storeService } from '../../services/storeService';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminSettingsProps {
  packRule: PackRule;
  onRuleUpdated: (rule: PackRule) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  packRule,
  onRuleUpdated,
}) => {
  const [baseQty, setBaseQty] = useState(packRule.base_quantity);
  const [bonusQty, setBonusQty] = useState(packRule.bonus_quantity);
  const [allowDuplicates, setAllowDuplicates] = useState(packRule.allow_duplicate_stickers);
  const [bonusMode, setBonusMode] = useState(packRule.bonus_mode);
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePackRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await storeService.savePackRule({
      base_quantity: baseQty,
      bonus_quantity: bonusQty,
      allow_duplicate_stickers: allowDuplicates,
      bonus_mode: bonusMode,
    });
    onRuleUpdated(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDemoData = () => {
    if (confirm('Reset demo data to initial seeds? This will refresh all 24 stickers, categories, and sample orders.')) {
      storeService.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
          Studio &amp; Pack Settings
        </h1>
        <p className="font-body text-xs text-gray-600 font-medium mt-0.5">
          Configure offer rules, backend connectivity, and reset development state.
        </p>
      </div>

      {/* 1. Pack Offer Rules Form */}
      <div className="card-neo bg-white border-3 border-brand-dark p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-brand-pink" />
          <h2 className="font-display font-black text-lg text-brand-dark">
            Pack Builder Offer Rules
          </h2>
        </div>

        <form onSubmit={handleSavePackRule} className="space-y-4 text-xs font-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                Base Pack Quantity (Default: 10)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={baseQty}
                onChange={(e) => setBaseQty(parseInt(e.target.value) || 1)}
                className="input-neo py-2 text-sm font-mono"
              />
              <span className="text-[11px] text-gray-500 font-mono block mt-1">
                Number of base stickers customer must select.
              </span>
            </div>

            <div>
              <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                Bonus Quantity Reward (Default: 2)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                required
                value={bonusQty}
                onChange={(e) => setBonusQty(parseInt(e.target.value) || 0)}
                className="input-neo py-2 text-sm font-mono"
              />
              <span className="text-[11px] text-gray-500 font-mono block mt-1">
                Free bonus stickers unlocked after completing base requirement.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                Bonus Selection Mode
              </label>
              <select
                value={bonusMode}
                onChange={(e: any) => setBonusMode(e.target.value)}
                className="input-neo py-2"
              >
                <option value="customer_choice">Customer Choice (Customer selects 2)</option>
                <option value="automatic">Automatic (Random or studio assigned)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-brand-dark select-none">
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-brand-dark text-brand-pink"
                />
                <span>Allow Duplicate Stickers in Same Pack</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-gray-100">
            {isSaved ? (
              <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pack rules saved successfully!</span>
              </span>
            ) : (
              <span className="text-xs font-mono text-gray-400">
                Changes apply immediately to storefront validation.
              </span>
            )}

            <button type="submit" className="btn-neo-yellow text-xs py-2 px-5 flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>Save Rules</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Supabase Integration Status */}
      <div className="card-neo bg-white border-3 border-brand-dark p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-cyan" />
            <h2 className="font-display font-black text-lg text-brand-dark">
              Supabase Backend Connectivity
            </h2>
          </div>
          <span
            className={`badge-neo ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                : 'bg-amber-100 text-amber-800 border-amber-400'
            }`}
          >
            {isSupabaseConfigured ? 'Connected (Live)' : 'Local Demo Mode (Awaiting Keys)'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200 text-xs font-mono space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">VITE_SUPABASE_URL:</span>
            <span className="font-bold text-brand-dark">
              {import.meta.env.VITE_SUPABASE_URL || '(not set - using local resilient storage)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">VITE_SUPABASE_ANON_KEY:</span>
            <span className="font-bold text-brand-dark">
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••••••' : '(not set)'}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed font-body font-medium">
          To connect your live Supabase project, add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file and apply the checked-in migrations in <code>supabase/migrations/</code>. All tables, RLS policies, and RPC functions will execute natively!
        </p>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="btn-neo-white text-xs py-2 px-3 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
