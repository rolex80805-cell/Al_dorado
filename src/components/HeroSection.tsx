import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Shield,
  ShieldCheck,
  Coins,
  ArrowRight,
  Play,
  Users,
  Award,
  Lock,
  TrendingUp,
  Info
} from 'lucide-react';
import { PlatformStats } from '../types';

interface HeroSectionProps {
  stats: PlatformStats;
  onStartEarning: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  onStartEarning,
  onOpenAuth,
  onOpenAdmin
}) => {
  // Animated counting numbers
  const [usersCount, setUsersCount] = useState(140000);
  const [coinsCount, setCoinsCount] = useState(340000000);
  const [offersCount, setOffersCount] = useState(910000);
  const [withdrawalsCount, setWithdrawalsCount] = useState(40000);

  useEffect(() => {
    const timer = setInterval(() => {
      setUsersCount(prev => (prev < stats.totalUsers ? prev + 89 : stats.totalUsers));
      setCoinsCount(prev => (prev < stats.totalCoinsPaid ? prev + 12500 : stats.totalCoinsPaid));
      setOffersCount(prev => (prev < stats.offersCompletedCount ? prev + 110 : stats.offersCompletedCount));
      setWithdrawalsCount(prev => (prev < stats.withdrawalsProcessedCount ? prev + 25 : stats.withdrawalsProcessedCount));
    }, 40);

    return () => clearInterval(timer);
  }, [stats]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-black/50 via-black/20 to-transparent p-6 sm:p-10 shadow-2xl backdrop-blur-md">
      
      {/* Background Glows */}
      <div className="absolute top-[-50px] right-[-50px] h-80 w-80 rounded-full bg-[#FFD700] opacity-15 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-50px] left-[-50px] h-80 w-80 rounded-full bg-[#FFD700] opacity-10 blur-[90px] pointer-events-none"></div>

      {/* Hero Badge */}
      <div className="relative z-10 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#FFD700] backdrop-blur-md shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-[#FFD700] animate-pulse" />
          <span>Aldorado Rewards • Premium Watch & Earn Suite</span>
        </div>
      </div>

      {/* Main Heading */}
      <div className="relative z-10 mt-6 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Earn Rewards by <br />
          <span className="text-[#FFD700]">
            Completing Verified Offers
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed font-normal">
          Complete verified tasks, watch sponsored video spotlights, earn coins instantly, and withdraw your earnings securely via Tether USDT, PayPal, Amazon Gift Cards, and Wire.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartEarning}
            className="group flex items-center gap-2 rounded-xl bg-[#FFD700] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#0D1117] shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all hover:brightness-110 hover:scale-105"
          >
            <span>Start Earning Now</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 backdrop-blur-sm"
          >
            <Play className="h-4 w-4 text-[#FFD700] fill-[#FFD700]" />
            <span>Login / Account</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/30 px-5 py-3.5 text-sm font-semibold text-purple-300 transition-all hover:bg-purple-900/40 backdrop-blur-sm"
          >
            <Shield className="h-4 w-4 text-purple-400" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Feature Section: 3 Frosted Glass Cards */}
      <div className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] mb-4 transition-transform group-hover:scale-110">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">Complete Offers</h3>
          <p className="mt-2 text-xs text-white/50 leading-relaxed">
            Finish verified gaming tasks, consumer feedback surveys, and partner app downloads from top providers like AdGate, BitLabs, CPABuild & OfferToro.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 transition-transform group-hover:scale-110">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">Instant Rewards</h3>
          <p className="mt-2 text-xs text-white/50 leading-relaxed">
            Coins are credited automatically to your account as soon as the provider's server webhook confirms successful task completion.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] mb-4 transition-transform group-hover:scale-110">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">Fast Withdrawals</h3>
          <p className="mt-2 text-xs text-white/50 leading-relaxed">
            Withdraw your earned coins securely via USDT crypto wallet, PayPal, Amazon digital codes, and bank wire with real-time status tracking.
          </p>
        </div>

      </div>

      {/* Live Statistics Section in Frosted Glass */}
      <div className="relative z-10 mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#FFD700]" />
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#FFD700]">Platform Statistics</h4>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Real-Time Live Tracking
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-white/40 text-[11px] uppercase font-bold tracking-wider mb-1">
              <Users className="h-3.5 w-3.5 text-[#FFD700]" />
              <span>Live Users</span>
            </div>
            <p className="text-2xl font-mono font-bold text-white">
              {usersCount.toLocaleString()}
            </p>
          </div>

          <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-white/40 text-[11px] uppercase font-bold tracking-wider mb-1">
              <Coins className="h-3.5 w-3.5 text-[#FFD700]" />
              <span>Coins Paid Out</span>
            </div>
            <p className="text-2xl font-mono font-bold text-[#FFD700]">
              {coinsCount.toLocaleString()}
            </p>
          </div>

          <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-white/40 text-[11px] uppercase font-bold tracking-wider mb-1">
              <Award className="h-3.5 w-3.5 text-[#FFD700]" />
              <span>Offers Completed</span>
            </div>
            <p className="text-2xl font-mono font-bold text-white">
              {offersCount.toLocaleString()}
            </p>
          </div>

          <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-white/40 text-[11px] uppercase font-bold tracking-wider mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FFD700]" />
              <span>Total Payouts</span>
            </div>
            <p className="text-2xl font-mono font-bold text-emerald-400">
              ${(coinsCount / 1000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Advertising Policy & Montag Integration Note */}
      <div className="relative z-10 mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-[#FFD700] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Ad Policy Safety Notice:</strong> Aldorado Rewards integrates Montag display ads for additional sponsor revenue. In strict accordance with global advertising guidelines, users do not earn coins merely for viewing or loading regular display banners. Coins are awarded strictly after verified offer completions or sponsor video task confirmations.
          </p>
        </div>
      </div>

    </div>
  );
};
