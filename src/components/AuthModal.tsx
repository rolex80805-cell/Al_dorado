import React, { useState } from 'react';
import { X, Lock, Mail, Shield, User as UserIcon } from 'lucide-react';
import { ADMIN_EMAILS } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginWithEmail: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginWithEmail
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onLoginWithEmail(email.trim());
    onClose();
  };

  const handleQuickLogin = (selectedEmail: string) => {
    setEmail(selectedEmail);
    onLoginWithEmail(selectedEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border border-yellow-500/30 bg-gray-900 p-6 shadow-2xl space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border border-gray-800 bg-gray-950 p-2 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="El Doorado Logo" 
            referrerPolicy="no-referrer"
            className="h-12 w-12 rounded-2xl object-contain bg-[#0D1117] p-1 border border-[#FFD700]/40 shadow-lg mb-2" 
          />
          <h3 className="text-xl font-black text-white">
            {mode === 'login' ? 'Sign In to El Doorado' : 'Create Free Account'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Start completing verified offer tasks and earn instant coins.</p>
        </div>

        {/* Quick Admin Access Selector */}
        <div className="rounded-2xl bg-gray-950 p-3 border border-yellow-500/20 text-center space-y-2">
          <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Quick Sign In Options</p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('rolex80805@gmail.com')}
              className="flex w-full items-center justify-between rounded-xl bg-purple-500/10 border border-purple-500/30 px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-purple-400" />
                <span>Admin 1 (rolex80805@gmail.com)</span>
              </div>
              <span className="text-[10px] bg-purple-500/30 px-2 py-0.5 rounded text-purple-200">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('mr.malik8805@gmail.com')}
              className="flex w-full items-center justify-between rounded-xl bg-purple-500/10 border border-purple-500/30 px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-purple-400" />
                <span>Admin 2 (mr.malik8805@gmail.com)</span>
              </div>
              <span className="text-[10px] bg-purple-500/30 px-2 py-0.5 rounded text-purple-200">Admin</span>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            {ADMIN_EMAILS.includes(email.toLowerCase().trim()) && (
              <p className="text-[10px] text-purple-400 font-semibold mt-1 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Authorized Administrator Email Detected
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-500 py-3 text-xs font-extrabold text-gray-950 hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 mt-2"
          >
            {mode === 'login' ? 'Sign In Now' : 'Create Account'}
          </button>
        </form>

        <div className="text-center pt-1">
          <p className="text-[11px] text-gray-500">
            * Admin Panel is restricted to authorized emails (<span className="text-purple-300">rolex80805@gmail.com</span> and <span className="text-purple-300">mr.malik8805@gmail.com</span>).
          </p>
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs text-gray-400 hover:text-yellow-400 underline"
          >
            {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
};
