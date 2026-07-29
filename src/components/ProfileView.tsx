import React, { useState } from 'react';
import { User as UserIcon, Shield, CheckCircle2, Award, Lock, Wallet, Save } from 'lucide-react';
import { User, Achievement } from '../types';

interface ProfileViewProps {
  user: User;
  achievements: Achievement[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, achievements }) => {
  const [wallet, setWallet] = useState(user.walletAddress || '');
  const [saved, setSaved] = useState(false);

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Header */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/90 p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-24 w-24 rounded-3xl object-cover border-4 border-yellow-500/50 shadow-2xl shadow-yellow-500/20"
          />

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-white">{user.name}</h2>
              {user.emailVerified && (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              )}
            </div>
            <p className="text-xs text-gray-400">{user.email}</p>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="rounded-full bg-yellow-500/20 border border-yellow-500/40 px-3 py-1 text-xs font-bold text-yellow-400">
                Level {user.level} Member
              </span>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-300">
                Member since {user.createdAt}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Settings Card */}
      <form onSubmit={handleSaveWallet} className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Wallet className="h-4 w-4 text-yellow-400" />
          <span>Default Payout Wallet Address</span>
        </h3>

        <div>
          <label className="block text-xs text-gray-400 mb-1">TRC20 / BEP20 Wallet Address</label>
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="e.g. 0x71C... or TR7NH..."
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-yellow-500 px-5 py-2.5 text-xs font-bold text-gray-950 hover:bg-yellow-400 transition-all"
        >
          <Save className="h-4 w-4" />
          <span>{saved ? 'Saved Successfully!' : 'Save Wallet Address'}</span>
        </button>
      </form>

      {/* Achievements Grid */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-yellow-400" />
          <span>Achievements & Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`rounded-2xl border p-4 transition-all ${
                ach.completed
                  ? 'border-yellow-500/40 bg-yellow-500/10'
                  : 'border-gray-800 bg-gray-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                <span className="text-xs font-bold text-yellow-400 font-mono">+{ach.rewardCoins} Coins</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{ach.description}</p>

              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{ach.progress} / {ach.maxProgress}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
