import React, { useState } from 'react';
import { Sparkles, Calendar, Zap, CheckCircle2, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../types';

interface DailyBonusViewProps {
  user: User;
  onClaimDailyBonus: () => void;
}

export const DailyBonusView: React.FC<DailyBonusViewProps> = ({
  user,
  onClaimDailyBonus
}) => {
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const isClaimedToday = user.lastClaimDate === todayStr;

  const handleClaimClick = () => {
    if (isClaimedToday) return;

    // Trigger Gold Confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FFFFFF', '#F59E0B']
    });

    onClaimDailyBonus();
    setClaimMessage(`Daily Bonus Claimed! +${500 + user.streakDays * 100} Coins added.`);
  };

  const days7 = [
    { day: 1, coins: 500, label: 'Day 1' },
    { day: 2, coins: 700, label: 'Day 2' },
    { day: 3, coins: 900, label: 'Day 3' },
    { day: 4, coins: 1200, label: 'Day 4' },
    { day: 5, coins: 1600, label: 'Day 5' },
    { day: 6, coins: 2200, label: 'Day 6' },
    { day: 7, coins: 3500, label: 'Day 7 Jackpot', mega: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-gray-950 via-gray-900 to-amber-950/40 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-black text-white">Daily Login Streak Bonus</h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Log in daily to build your streak and unlock up to +3,500 coins every week plus 30-day milestone multipliers!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl">
            <Flame className="h-5 w-5 text-amber-400 animate-bounce" />
            <div>
              <span className="text-xs text-gray-400 block">Current Streak</span>
              <span className="text-sm font-extrabold text-amber-400 font-mono">{user.streakDays} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Button Card */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/90 p-8 text-center backdrop-blur-md shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-xl shadow-amber-500/20">
          <Zap className="h-10 w-10 text-gray-950 animate-pulse" />
        </div>

        <h3 className="mt-4 text-xl font-black text-white">Today's Streak Reward</h3>
        <p className="text-2xl font-black text-amber-400 font-mono mt-1">
          +{500 + user.streakDays * 100} Coins
        </p>
        <p className="text-xs text-gray-400 mt-0.5">≈ ${((500 + user.streakDays * 100) / 1000).toFixed(2)} USD</p>

        {claimMessage && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-400 font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{claimMessage}</span>
          </div>
        )}

        <div className="mt-6 max-w-sm mx-auto">
          <button
            onClick={handleClaimClick}
            disabled={isClaimedToday}
            className={`w-full rounded-2xl py-4 text-sm font-extrabold transition-all shadow-xl ${
              isClaimedToday
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-gray-950 hover:scale-105 shadow-amber-500/30'
            }`}
          >
            {isClaimedToday ? 'Already Claimed Today • Come Back Tomorrow!' : "Claim Today's Bonus Now 🎉"}
          </button>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">7-Day Streak Calendar</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {days7.map((item) => {
            const isCompleted = user.streakDays >= item.day;
            const isCurrent = user.streakDays + 1 === item.day;

            return (
              <div
                key={item.day}
                className={`relative flex flex-col items-center justify-between rounded-2xl p-4 text-center border transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                    : isCurrent
                    ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg shadow-amber-500/10'
                    : 'border-gray-800 bg-gray-950/60 text-gray-500'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                <div className="my-2">
                  <Award className={`h-6 w-6 mx-auto ${
                    isCompleted ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-gray-600'
                  }`} />
                </div>
                <span className="text-xs font-mono font-extrabold">+{item.coins} Coins</span>
                {isCompleted && (
                  <span className="mt-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                    CLAIMED
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 30-Day Milestone Progress */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">30-Day Streak Milestone</h3>
          <span className="text-xs text-amber-400 font-mono font-bold">{user.streakDays} / 30 Days</span>
        </div>
        
        <div className="h-3 w-full rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((user.streakDays / 30) * 100))}%` }}
          ></div>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          Reach Day 30 to trigger the <strong className="text-yellow-400">10,000 Coin Crown Bonus</strong>!
        </p>
      </div>

    </div>
  );
};
