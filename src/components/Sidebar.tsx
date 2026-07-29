import React from 'react';
import {
  LayoutDashboard,
  Gift,
  Zap,
  Users,
  Trophy,
  Wallet,
  User,
  HelpCircle,
  Shield,
  Sparkles,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  isAdmin: boolean;
  streakDays: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  isAdmin,
  streakDays
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'offers', label: 'Offers', icon: Gift, badge: 'HOT' },
    { id: 'daily-bonus', label: 'Daily Bonus', icon: Zap, streak: `${streakDays} Days` },
    { id: 'referral', label: 'Referral', icon: Users, commission: '10%' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'withdraw', label: 'Withdraw', icon: Wallet, highlight: true },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Support & FAQ', icon: HelpCircle },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 rounded-3xl border border-white/10 bg-black/20 p-4 shadow-2xl backdrop-blur-md relative z-10">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold tracking-widest text-white/40 uppercase mb-3">Main Navigation</p>
        
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs transition-all ${
                isActive
                  ? 'bg-white/10 text-[#FFD700] font-semibold border border-white/10 shadow-lg backdrop-blur-sm'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#FFD700]' : 'text-white/50 group-hover:text-[#FFD700]'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  isActive ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30' : 'bg-white/10 text-[#FFD700]'
                }`}>
                  {item.badge}
                </span>
              )}

              {item.streak && (
                <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-white/10 text-amber-300'
                }`}>
                  <Sparkles className="h-2.5 w-2.5 text-[#FFD700]" />
                  {item.streak}
                </span>
              )}

              {item.commission && (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.commission}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Navigation Item */}
        {isAdmin && (
          <div className="pt-3 mt-3 border-t border-white/10">
            <p className="px-3 text-[10px] font-bold tracking-wider text-purple-300 uppercase mb-2">Management</p>
            <button
              onClick={() => onNavigate('admin')}
              className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-purple-600/40 text-purple-200 border border-purple-500/40 shadow-lg backdrop-blur-sm'
                  : 'text-purple-300 bg-purple-950/20 border border-purple-500/20 hover:bg-purple-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-purple-400" />
                <span>Admin Panel</span>
              </div>
              <span className="rounded bg-purple-400/20 px-1.5 py-0.5 text-[10px] text-purple-200">CORE</span>
            </button>
          </div>
        )}
      </div>

      {/* Level / Streak Banner Widget matching Frosted Glass template */}
      <div className="mt-6 p-4 bg-gradient-to-br from-[#FFD700]/20 to-transparent border border-[#FFD700]/30 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Award className="h-4 w-4 text-[#FFD700]" />
          <p className="text-xs text-[#FFD700] uppercase font-bold tracking-widest">Level Progress</p>
        </div>
        <p className="text-xs text-white/80 mb-2">Claim up to +3,500 bonus coins on Day 7!</p>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
          <div className="bg-[#FFD700] w-2/3 h-full rounded-full"></div>
        </div>
        <button
          onClick={() => onNavigate('daily-bonus')}
          className="w-full rounded-xl bg-[#FFD700] py-2 text-xs font-bold text-[#0D1117] uppercase tracking-wide hover:brightness-110 transition-all shadow-[0_0_12px_rgba(255,215,0,0.25)]"
        >
          Claim Daily Coins
        </button>
      </div>
    </aside>
  );
};
