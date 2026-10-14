import React, { useState } from 'react';
import {
  Settings,
  Save,
  Database,
  RotateCcw,
  CheckCircle2,
  Users,
  UserPlus,
  Trash2,
  Copy,
  ExternalLink,
  Shield,
  HelpCircle,
  Check,
} from 'lucide-react';
import { PackRule } from '../../types';
import { storeService, AdminUser } from '../../services/storeService';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminSettingsProps {
  packRule: PackRule;
  onRuleUpdated: (rule: PackRule) => void;
}

interface QtyInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  help: string;
  onChange: (val: number) => void;
}

const QtyInput: React.FC<QtyInputProps> = ({ label, value, min, max, help, onChange }) => (
  <div>
    <label className="block font-mono uppercase tracking-wider text-gray-300 font-bold mb-1.5">
      {label}
    </label>
    <input
      type="number"
      min={min}
      max={max}
      required
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10) || min)}
      className="w-full bg-[#12131A] border border-[#2B2E42] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#00F0FF]"
    />
    <span className="text-[11px] text-gray-500 font-mono block mt-1">{help}</span>
  </div>
);

interface InstructionStepProps {
  index: number;
  badgeBg: string;
  badgeText: string;
  title: string;
  children: React.ReactNode;
}

const InstructionStep: React.FC<InstructionStepProps> = ({ index, badgeBg, badgeText, title, children }) => (
  <li className="flex items-start gap-2 bg-[#181A26] p-2.5 rounded-lg border border-[#2B2E42]">
    <span
      className={`w-5 h-5 rounded-full ${badgeBg} ${badgeText} flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5`}
    >
      {index}
    </span>
    <div>
      <strong className="text-white">{title}: </strong>
      {children}
    </div>
  </li>
);

const EnvItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500">{label}:</span>
    <span className="font-bold text-gray-200">{value}</span>
  </div>
);

function getRoleBadge(role: string) {
  const configs: Record<string, { label: string; style: string }> = {
    admin: { label: 'Administrator', style: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/30' },
    order_manager: { label: 'Order Manager', style: 'bg-[#FF6EB4]/15 text-[#FF6EB4] border-[#FF6EB4]/30' },
    print_operator: { label: 'Print Operator', style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  };
  const current = configs[role] || configs.admin;
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${current.style}`}>
      {current.label}
    </span>
  );
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  packRule,
  onRuleUpdated,
}) => {
  // Pack rules state
  const [baseQty, setBaseQty] = useState(packRule.base_quantity);
  const [bonusQty, setBonusQty] = useState(packRule.bonus_quantity);
  const [allowDuplicates, setAllowDuplicates] = useState(packRule.allow_duplicate_stickers);
  const [bonusMode, setBonusMode] = useState(packRule.bonus_mode);
  const [isSaved, setIsSaved] = useState(false);

  // Admin Team Allowlist state
  const [adminTeam, setAdminTeam] = useState<AdminUser[]>(() => storeService.getAdminTeam());
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'print_operator' | 'order_manager'>('admin');
  const [newNotes, setNewNotes] = useState('');
  const [teamMessage, setTeamMessage] = useState<string | null>(null);

  // SQL Generator state
  const [sqlTargetEmail, setSqlTargetEmail] = useState('');
  const [sqlSnippetType, setSqlSnippetType] = useState<'current_team' | 'auto_trigger' | 'custom'>('current_team');
  const [hasCopiedSql, setHasCopiedSql] = useState(false);

  const teamEmailsSqlList = adminTeam
    .filter((u) => u.email.includes('@'))
    .map((u) => `  '${u.email}'`)
    .join(',\n');

  let generatedSql = '';
  if (sqlSnippetType === 'current_team') {
    generatedSql = `-- Run in Supabase SQL Editor to grant admin access to your team:
INSERT INTO public.profiles (id, display_name, role)
SELECT id, split_part(email, '@', 1), 'admin'
FROM auth.users
WHERE email IN (
${teamEmailsSqlList}
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

SELECT p.id, u.email, p.role
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';`;
  } else if (sqlSnippetType === 'auto_trigger') {
    generatedSql = `-- Run this ONCE in Supabase SQL Editor.
-- Any user you add in Supabase Auth (now & future) will automatically be an admin!
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, role)
    VALUES (
        new.id,
        coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        'admin'
    )
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
    RETURN new;
END;
$$;`;
  } else {
    generatedSql = `-- Grant admin to single user:
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = '${sqlTargetEmail || 'teammate@gmail.com'}'
);

SELECT p.id, u.email, p.role
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE email = '${sqlTargetEmail || 'teammate@gmail.com'}';`;
  }

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

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setTeamMessage('Please enter a valid email address.');
      setTimeout(() => setTeamMessage(null), 3000);
      return;
    }

    const updated = storeService.addAdminUser(newEmail.trim(), newRole, newNotes.trim());
    setAdminTeam(updated);
    setSqlTargetEmail(newEmail.trim().toLowerCase());
    setNewEmail('');
    setNewNotes('');
    setTeamMessage(`✓ Added ${newEmail.trim()} to authorized admin team!`);
    setTimeout(() => setTeamMessage(null), 3500);
  };

  const handleRemoveMember = (emailToRemove: string) => {
    if (typeof window !== 'undefined' && window.confirm(`Remove ${emailToRemove} from authorized admin team?`)) {
      const updated = storeService.removeAdminUser(emailToRemove);
      setAdminTeam(updated);
    }
  };

  const handleResetDemoData = () => {
    if (typeof window !== 'undefined' && window.confirm('Reset demo data to initial seeds? This will refresh all 24 stickers, categories, and sample orders.')) {
      storeService.resetDemoData();
      window.location.reload();
    }
  };

  const handleCopySql = () => {
    navigator.clipboard
      .writeText(generatedSql)
      .then(() => {
        setHasCopiedSql(true);
        setTimeout(() => setHasCopiedSql(false), 2500);
      })
      .catch((copyErr) => {
        console.error('Clipboard copy failed:', copyErr);
      });
  };

  return (
    <div className="space-y-8 max-w-5xl text-white">
      {/* Page Header */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
          <span>Studio &amp; System Settings</span>
        </h1>
        <p className="font-mono text-xs text-gray-400 mt-1">
          Manage authorized admin team members, storefront pack builder rules, and backend database connections.
        </p>
      </div>

      {/* 1. Admin Team & Access Management */}
      <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5 sm:p-7 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2B2E42]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-white">
                Admin Team &amp; Access Control
              </h2>
              <p className="font-mono text-xs text-gray-400">
                Authorize specific Gmail or team accounts to access this Admin Studio with their password.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 w-fit">
            <Users className="w-3.5 h-3.5" />
            <span>{adminTeam.length} Authorized Admins</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Team Member Form */}
          <div className="lg:col-span-5 bg-[#12131A] rounded-xl border border-[#2B2E42] p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-display font-bold text-sm">
              <UserPlus className="w-4 h-4 text-[#FF6EB4]" />
              <span>Authorize Team Member</span>
            </div>

            <form onSubmit={handleAddTeamMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono uppercase tracking-wider text-gray-300 font-bold mb-1">
                  Gmail / Team Email
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. colleague@gmail.com"
                  className="w-full bg-[#181A26] border border-[#2B2E42] rounded-xl px-3.5 py-2.5 text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#00F0FF] text-xs"
                />
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-gray-300 font-bold mb-1">
                  Admin Role
                </label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full bg-[#181A26] border border-[#2B2E42] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00F0FF] text-xs cursor-pointer"
                >
                  <option value="admin">Full Administrator (All studio tabs)</option>
                  <option value="order_manager">Order Manager (Orders &amp; Batches)</option>
                  <option value="print_operator">Print Operator (Print Queue &amp; Inventory)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-gray-300 font-bold mb-1">
                  Label / Note (Optional)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Co-founder, Fulfillment Lead"
                  className="w-full bg-[#181A26] border border-[#2B2E42] rounded-xl px-3.5 py-2 text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#00F0FF] text-xs"
                />
              </div>

              {teamMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                  {teamMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#FF6EB4] hover:bg-[#ff80bf] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add to Admin Team</span>
              </button>
            </form>
          </div>

          {/* Instructions and SQL Generator */}
          <div className="lg:col-span-7 bg-[#12131A] rounded-xl border border-[#2B2E42] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-white font-display font-bold text-sm mb-2">
                <HelpCircle className="w-4 h-4 text-[#00F0FF]" />
                <span>How to Add Admins With Gmail &amp; Password</span>
              </div>
              <p className="text-xs text-gray-400 font-body leading-relaxed mb-3">
                For security, passwords must be securely hashed by Supabase Auth. Follow these two quick steps to grant anyone access:
              </p>

              <ol className="space-y-2.5 text-xs font-mono text-gray-300">
                <InstructionStep
                  index={1}
                  badgeBg="bg-[#00F0FF]/20"
                  badgeText="text-[#00F0FF]"
                  title="Create Account in Supabase"
                >
                  Open your{' '}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00F0FF] hover:underline inline-flex items-center gap-0.5 font-bold"
                  >
                    Supabase Dashboard <ExternalLink className="w-2.5 h-2.5" />
                  </a>{' '}
                  &rarr; <em>Authentication</em> &rarr; <em>Users</em> &rarr; click <strong>"Add User"</strong> (create their Gmail &amp; set a password, or send an invite).
                </InstructionStep>

                <InstructionStep
                  index={2}
                  badgeBg="bg-[#FF6EB4]/20"
                  badgeText="text-[#FF6EB4]"
                  title="Authorize Admin Role"
                >
                  Add their email to the team list on the left. The app automatically recognizes them and permits login. You can also run the SQL query below in the Supabase SQL editor to directly update their database role.
                </InstructionStep>
              </ol>
            </div>

            {/* Quick SQL Snippet Generator */}
            <div className="pt-2 border-t border-[#2B2E42] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-[#0A0B0E] p-1 rounded-lg border border-[#2B2E42]">
                  <button
                    type="button"
                    onClick={() => setSqlSnippetType('current_team')}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      sqlSnippetType === 'current_team'
                        ? 'bg-[#FF6EB4] text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Current Team ({adminTeam.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSqlSnippetType('auto_trigger')}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      sqlSnippetType === 'auto_trigger'
                        ? 'bg-[#00F0FF] text-black shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Auto-Admin All Future Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => setSqlSnippetType('custom')}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      sqlSnippetType === 'custom'
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Single User
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#00F0FF] hover:text-white transition-colors cursor-pointer bg-[#181A26] px-2.5 py-1 rounded-lg border border-[#2B2E42]"
                >
                  {hasCopiedSql ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-[#0A0B0E] border border-[#2B2E42] rounded-lg p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto selection:bg-[#FF6EB4]">
                {generatedSql}
              </pre>
            </div>
          </div>
        </div>

        {/* Current Authorized Admin Team Table */}
        <div className="space-y-3 pt-2">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <span>Currently Authorized Team Members</span>
            <span className="text-xs font-mono text-gray-500">({adminTeam.length})</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[#2B2E42] bg-[#12131A]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#181A26] border-b border-[#2B2E42] text-gray-400 font-mono">
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3">Added</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B2E42]">
                {adminTeam.map((member) => {
                  const isRoot = member.email === 'admin@stickerverse.craft';
                  return (
                    <tr key={member.email} className="hover:bg-[#181A26] transition-colors">
                      <td className="p-3 font-mono font-bold text-white flex items-center gap-2">
                        <span>{member.email}</span>
                        {isRoot && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Root
                          </span>
                        )}
                      </td>
                      <td className="p-3">{getRoleBadge(member.role)}</td>
                      <td className="p-3 text-gray-400 font-mono text-[11px]">
                        {member.notes || '—'}
                      </td>
                      <td className="p-3 text-gray-400 font-mono text-[11px]">
                        {new Date(member.added_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        {isRoot ? (
                          <span className="text-gray-600 font-mono text-[11px]">Protected</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.email)}
                            className="text-red-400 hover:text-red-300 font-mono text-xs inline-flex items-center gap-1 cursor-pointer"
                            title="Remove from admin team"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Pack Builder Offer Rules Form */}
      <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5 sm:p-7 shadow-lg space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#2B2E42]">
          <div className="w-10 h-10 rounded-xl bg-[#FF6EB4]/10 border border-[#FF6EB4]/30 flex items-center justify-center text-[#FF6EB4]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg text-white">
              Pack Builder Offer Rules
            </h2>
            <p className="font-mono text-xs text-gray-400">
              Configure the storefront promotional offer (e.g. Pick 10 + Get 2 Free).
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePackRule} className="space-y-4 text-xs font-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QtyInput
              label="Base Pack Quantity (Default: 10)"
              value={baseQty}
              min={1}
              max={50}
              help="Number of base stickers customer must select to qualify for the pack."
              onChange={setBaseQty}
            />
            <QtyInput
              label="Bonus Quantity Reward (Default: 2)"
              value={bonusQty}
              min={0}
              max={10}
              help="Number of free bonus stickers unlocked once base quota is fulfilled."
              onChange={setBonusQty}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-mono uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                Bonus Selection Mode
              </label>
              <select
                value={bonusMode}
                onChange={(e: any) => setBonusMode(e.target.value)}
                className="w-full bg-[#12131A] border border-[#2B2E42] rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#00F0FF] cursor-pointer"
              >
                <option value="customer_choice">Customer Choice (Customer selects bonus stickers)</option>
                <option value="automatic">Automatic (Random or studio surprise)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-3 cursor-pointer text-gray-200 font-bold select-none">
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="w-4 h-4 rounded border-[#2B2E42] bg-[#12131A] text-[#FF6EB4] accent-[#FF6EB4]"
                />
                <span className="text-xs">Allow Duplicate Stickers in Same Pack</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#2B2E42]">
            {isSaved ? (
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pack rules saved successfully!</span>
              </span>
            ) : (
              <span className="text-xs font-mono text-gray-500">
                Rule adjustments apply immediately to storefront validation and pricing.
              </span>
            )}

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#00F0FF] hover:bg-[#3bf4ff] text-black font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00F0FF]/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Rules</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Supabase Integration & Database Connectivity */}
      <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5 sm:p-7 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2B2E42]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-white">
                Supabase Backend Connectivity
              </h2>
              <p className="font-mono text-xs text-gray-400">
                Live PostgreSQL database, row-level security policies, and authentication.
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              isSupabaseConfigured
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}
          >
            {isSupabaseConfigured ? '● Connected (Live DB)' : '○ Local Studio Mode'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#12131A] border border-[#2B2E42] text-xs font-mono space-y-2">
          <EnvItem
            label="VITE_SUPABASE_URL"
            value={import.meta.env.VITE_SUPABASE_URL || '(not set - using local storage)'}
          />
          <EnvItem
            label="VITE_SUPABASE_ANON_KEY"
            value={import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••••••••••••••••••' : '(not set)'}
          />
        </div>

        <p className="text-xs text-gray-400 leading-relaxed font-body">
          Your project connects to your Supabase instance using <code>.env</code> credentials. All migrations (initial schema, RLS policies, RPC functions, and seeds) are checked into the repository under <code>supabase/migrations/</code>.
        </p>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="py-2 px-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-mono font-bold text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
