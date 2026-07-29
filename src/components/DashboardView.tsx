import React from 'react';
import {
  Coins,
  TrendingUp,
  Users,
  Flame,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { User, Offer, OfferCompletion, WithdrawalRequest } from '../types';

interface DashboardViewProps {
  user: User;
  offers: Offer[];
  completions: OfferCompletion[];
  withdrawals: WithdrawalRequest[];
  onNavigate: (tab: string) => void;
  onClaimDaily: () => void;
  onSelectOffer: (offer: Offer) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  offers,
  completions,
  withdrawals,
  onNavigate,
  onClaimDaily,
  onSelectOffer
}) => {
  return (
    <div className="space-y-6 relative z-10 max-w-4xl mx-auto">
      
      {/* Title & Greeting (Matching Image 6) */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Welcome back, {user.name} 👋
        </h2>
        <p className="text-xs text-white/50 mt-1">
          Here's how your account is performing today.
        </p>
      </div>

      {/* Stacked Metric Cards (Matching Image 6) */}
      <div className="space-y-4">
        
        {/* Card 1: CURRENT BALANCE */}
        <div className="rounded-3xl border border-white/10 bg-[#0F141E] p-6 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              CURRENT BALANCE
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700]">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold font-mono text-white">
            {(user.coins ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-white/40 font-mono mt-1">
            ${(user.usdValue ?? 0).toFixed(2)}
          </p>
        </div>

        {/* Card 2: TOTAL EARNED */}
        <div className="rounded-3xl border border-white/10 bg-[#0F141E] p-6 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              TOTAL EARNED
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold font-mono text-white">
            {(user.totalEarned ?? user.coins ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-white/40 font-sans mt-1">
            lifetime coins
          </p>
        </div>

        {/* Card 3: REFERRAL EARNINGS */}
        <div className="rounded-3xl border border-white/10 bg-[#0F141E] p-6 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              REFERRAL EARNINGS
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold font-mono text-white">
            {(user.referralEarnings ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-white/40 font-sans mt-1">
            10% commission
          </p>
        </div>

        {/* Card 4: DAILY STREAK */}
        <div className="rounded-3xl border border-white/10 bg-[#0F141E] p-6 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              DAILY STREAK
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Flame className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold font-sans text-white">
            {user.streakDays} days
          </p>
          <p className="text-xs text-white/40 font-sans mt-1">
            keep it alive
          </p>
        </div>

      </div>

      {/* Recent Activity Section (Matching Image 6) */}
      <div className="rounded-3xl border border-white/10 bg-[#0F141E] p-6 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Recent activity</h3>
          <button
            onClick={() => onNavigate('offers')}
            className="text-xs font-semibold text-[#FFD700] hover:underline"
          >
            View all
          </button>
        </div>

        <div className="divide-y divide-white/10">
          {completions.length === 0 ? (
            <p className="text-xs text-white/40 py-6 text-center">
              No recent activity. Complete an offer task to earn coins!
            </p>
          ) : (
            completions.map(comp => (
              <div key={comp.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{comp.offerTitle}</p>
                    <p className="text-[10px] text-white/40">{comp.provider}</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-[#FFD700]">+{comp.rewardCoins.toLocaleString()} coins</span>
                  <p className="text-[10px] text-white/40">{new Date(comp.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

