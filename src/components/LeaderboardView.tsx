import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardViewProps {
  leaderboard: LeaderboardEntry[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ leaderboard }) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-gray-950 via-gray-900 to-yellow-950/40 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-black text-white">Global Hall of Fame</h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Top earners and task masters competing for the $500 Weekly Gold Leaderboard Bonus!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 rounded-2xl">
            <Crown className="h-5 w-5 text-yellow-400" />
            <div>
              <span className="text-xs text-gray-400 block">Weekly Pool</span>
              <span className="text-sm font-extrabold text-yellow-400 font-mono">$500 USD Cash Pool</span>
            </div>
          </div>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0F141E] p-12 text-center text-white/50 space-y-3">
          <Trophy className="h-12 w-12 text-yellow-500/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">No leaderboard rankings yet</h3>
          <p className="text-xs text-white/40 max-w-md mx-auto">
            Be the first member to complete offerwall tasks or claim daily bonuses to claim the #1 spot on the global Hall of Fame!
          </p>
        </div>
      ) : (
        <>
          {/* Podium Top 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboard.slice(0, 3).map((entry, idx) => {
              const colors = [
                'border-yellow-500 bg-yellow-500/10 text-yellow-400',
                'border-gray-400 bg-gray-400/10 text-gray-300',
                'border-amber-600 bg-amber-600/10 text-amber-500'
              ];

              return (
                <div
                  key={entry.userId}
                  className={`rounded-3xl border p-6 text-center backdrop-blur-md shadow-xl ${colors[idx]}`}
                >
                  <div className="relative mx-auto h-20 w-20">
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="h-full w-full rounded-2xl object-cover border-2 border-current shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gray-950 border border-current font-black text-xs">
                      #{idx + 1}
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-extrabold text-white">{entry.name}</h3>
                  {entry.badge && (
                    <span className="mt-1 inline-block rounded-full bg-gray-900 border border-current px-2.5 py-0.5 text-[10px] font-bold">
                      {entry.badge}
                    </span>
                  )}

                  <p className="mt-3 text-xl font-black font-mono">
                    {entry.coinsEarned.toLocaleString()} <span className="text-xs font-sans font-normal">Coins</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{entry.offersCompleted} Offers Completed</p>
                </div>
              );
            })}
          </div>

          {/* Full Rankings Table */}
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Leaderboard Standings</h3>
              <span className="text-xs text-gray-400">Updated Real-Time</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-950 text-gray-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Offers Completed</th>
                    <th className="py-3 px-4">Referrals</th>
                    <th className="py-3 px-4 text-right">Total Coins Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {leaderboard.map(entry => (
                    <tr key={entry.userId} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-yellow-400">
                        #{entry.rank}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.avatar}
                            alt={entry.name}
                            className="h-8 w-8 rounded-xl object-cover border border-gray-800"
                          />
                          <div>
                            <p className="font-bold text-white">{entry.name}</p>
                            {entry.badge && <span className="text-[9px] text-gray-400">{entry.badge}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-200">
                        {entry.offersCompleted}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-200">
                        {entry.referrals}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-yellow-400">
                        +{entry.coinsEarned.toLocaleString()} Coins
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
