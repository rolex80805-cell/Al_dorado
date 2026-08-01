import React, { useState } from 'react';
import { Menu, Gift, X, LayoutDashboard, Zap, Users, Trophy, Wallet, User as UserIcon, HelpCircle, Shield, LogOut, Play } from 'lucide-react';
import { User, isAdminEmail } from '../types';

interface NavbarProps {
  user: User;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchRole: (role: 'user' | 'admin') => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isAuthenticated,
  onOpenAuth,
  onLogout,
  onSwitchRole,
  onNavigate,
  activeTab
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'offers', label: 'Offers', icon: Gift },
    { id: 'daily-bonus', label: 'Daily Bonus', icon: Zap },
    { id: 'referral', label: 'Referral', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'withdraw', label: 'Withdraw', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0E14]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Hamburger Menu Button + Logo */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 transition-colors"
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}

            <div 
              onClick={() => onNavigate('dashboard')}
              className="flex cursor-pointer items-center gap-2.5 group"
            >
              <img 
                src="/logo.png" 
                alt="El Doorado Logo" 
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-xl object-contain bg-[#0D1117] p-0.5 border border-[#FFD700]/40 shadow-[0_0_12px_rgba(255,215,0,0.3)] group-hover:scale-105 transition-transform" 
              />
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-1 text-base font-bold tracking-tight">
                  <span className="text-white">EL</span>
                  <span className="text-[#FFD700]">DOORADO</span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">EARN MORE. LIVE MORE.</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="rounded-full bg-[#FFD700] px-4 py-1.5 text-xs font-bold text-[#0D1117] hover:brightness-110 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                >
                  Sign Up Free
                </button>
              </div>
            ) : (
              <>
                {/* Daily Bonus Button */}
                <button
                  onClick={() => onNavigate('daily-bonus')}
                  className="flex items-center gap-1.5 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/10 px-3.5 py-1.5 text-xs font-medium text-[#FFD700] hover:bg-[#FFD700]/20 transition-all shadow-[0_0_10px_rgba(255,215,0,0.15)]"
                >
                  <Gift className="h-3.5 w-3.5 text-[#FFD700]" />
                  <span>Daily bonus</span>
                </button>

                {/* Avatar Circle button */}
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD700] text-[#0D1117] font-bold text-sm shadow-[0_0_12px_rgba(255,215,0,0.3)] hover:scale-105 transition-transform"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Slide-Over Mobile/Desktop Drawer Navigation Overlay (Matches Image 5) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-[#0A0D14] border-r border-white/10 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            
            <div>
              {/* Drawer Top Header: Brand Logo + Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/logo.png" 
                    alt="El Doorado Logo" 
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-xl object-contain bg-[#0D1117] p-0.5 border border-[#FFD700]/40 shadow-[0_0_10px_rgba(255,215,0,0.3)]" 
                  />
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-1 text-base font-bold">
                      <span className="text-white">EL</span>
                      <span className="text-[#FFD700]">DOORADO</span>
                    </div>
                    <span className="text-[8px] font-mono tracking-widest text-white/50 uppercase">EARN MORE. LIVE MORE.</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Balance Box Card (Image 5 style) */}
              <div className="mt-5 rounded-2xl border border-[#FFD700]/20 bg-gradient-to-br from-[#131822] to-[#0A0D14] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">BALANCE</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-[#FFD700]">
                    {(user.coins ?? 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-white/60">coins</span>
                </div>
                <p className="text-xs text-white/40 mt-0.5 font-mono">≈ ${(user.usdValue ?? 0).toFixed(2)}</p>
              </div>

              {/* Navigation Items */}
              <div className="mt-6 space-y-1">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsDrawerOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 font-semibold shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#FFD700]' : 'text-white/50'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {/* Admin Panel Button */}
                {user?.role === 'admin' && isAdminEmail(user?.email) && (
                  <button
                    onClick={() => {
                      onSwitchRole('admin');
                      onNavigate('admin');
                      setIsDrawerOpen(false);
                    }}
                    className={`mt-2 flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-xs font-medium transition-all ${
                      activeTab === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                        : 'text-white/70 hover:bg-white/5 hover:text-white border border-white/5'
                    }`}
                  >
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span>Admin Panel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Sign Out Button */}
            <div className="pt-6 border-t border-white/10 mt-6">
              <button
                onClick={() => {
                  onLogout();
                  setIsDrawerOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-xs font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4 text-white/50" />
                <span>Sign out</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

