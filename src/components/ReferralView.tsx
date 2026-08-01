import React, { useState } from 'react';
import { Users, Copy, Check, Share2, Sparkles, Trophy, Award } from 'lucide-react';
import { User } from '../types';

interface ReferralViewProps {
  user: User;
}

export const ReferralView: React.FC<ReferralViewProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}?ref=${user.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-gray-950 via-gray-900 to-emerald-950/40 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-black text-white">Referral Ambassador System</h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Invite friends to El Doorado Rewards and earn a <strong className="text-emerald-400">10% Lifetime Commission</strong> on every single offer task they complete!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl">
            <Trophy className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-xs text-gray-400 block">Commission Rate</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">10% Lifetime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shareable Link Card */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/90 p-6 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Your Unique Referral Link</h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3.5 text-xs text-emerald-400 font-mono focus:outline-none"
            />
          </div>

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-xs font-extrabold text-gray-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span>Referral Code:</span>
          <span className="font-mono font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
            {user.referralCode}
          </span>
        </div>
      </div>

      {/* Stats Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Total Referred Friends</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-white font-mono">
            {user.referralCount} <span className="text-xs text-gray-400 font-sans">Users</span>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Total Referral Earnings</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-yellow-400 font-mono">
            {user.referralEarnings.toLocaleString()} <span className="text-xs text-gray-400 font-sans">Coins</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">≈ ${(user.referralEarnings / 1000).toFixed(2)} USD</p>
        </div>

      </div>

    </div>
  );
};
