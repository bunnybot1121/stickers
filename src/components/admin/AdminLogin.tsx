import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: (email: string) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          onLoginSuccess(data.user.email || 'admin@stickerverse.craft');
          return;
        }
      } else {
        // Local Demo Mode authentication
        if (
          (email.trim() === 'admin@stickerverse.craft' || email.trim() === 'admin') &&
          (password === 'admin123' || password === 'admin')
        ) {
          onLoginSuccess('admin@stickerverse.craft');
          return;
        } else {
          throw new Error('Invalid demo credentials. Use the demo credentials provided below.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@stickerverse.craft');
    setPassword('admin123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card-neo w-full max-w-md bg-white p-6 sm:p-8 shadow-neo-xl relative">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500 hover:text-brand-dark mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-yellow border-3 border-brand-dark shadow-neo-sm flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-7 h-7 text-brand-dark" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Admin Studio Login
          </h1>
          <p className="font-body text-xs text-gray-600 mt-1 font-medium">
            Authorized personnel only for orders, catalogue &amp; Print Studio.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border-2 border-red-500 text-red-800 text-xs font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand-dark mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                id="admin-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@stickerverse.craft"
                className="input-neo pl-9 text-sm"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand-dark mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-neo pl-9 text-sm"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            id="admin-submit-login-btn"
            type="submit"
            disabled={isLoading}
            className="w-full btn-neo-yellow py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Admin Studio'}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div className="mt-6 pt-5 border-t-2 border-gray-100 text-center">
          <p className="text-xs font-mono text-gray-500 mb-2">
            {isSupabaseConfigured
              ? 'Using Supabase Auth'
              : 'Local Demo Mode Active (Awaiting Supabase Keys)'}
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-mono font-bold text-brand-pink underline hover:text-pink-600 cursor-pointer"
          >
            Click to Auto-fill Demo Credentials (admin@stickerverse.craft / admin123)
          </button>
        </div>
      </div>
    </div>
  );
};
