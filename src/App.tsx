/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DashboardView } from './components/DashboardView';
import { OffersView } from './components/OffersView';
import { DailyBonusView } from './components/DailyBonusView';
import { ReferralView } from './components/ReferralView';
import { LeaderboardView } from './components/LeaderboardView';
import { WithdrawView } from './components/WithdrawView';
import { ProfileView } from './components/ProfileView';
import { SupportView } from './components/SupportView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';

import {
  User,
  Offer,
  OfferCompletion,
  PaymentMethod,
  WithdrawalRequest,
  LeaderboardEntry,
  Achievement,
  PlatformStats,
  ADMIN_EMAILS,
  isAdminEmail
} from './types';

import {
  getUserProfile,
  switchUserRole,
  claimDailyBonus,
  getOffers,
  completeOffer,
  simulateWebhook,
  getPaymentMethods,
  savePaymentMethod,
  requestWithdrawal,
  getUserWithdrawals,
  getAdminWithdrawals,
  processAdminWithdrawal,
  saveAdminOffer,
  getLeaderboard,
  getAiFraudCheck
} from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [completions, setCompletions] = useState<OfferCompletion[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 148920,
    totalCoinsPaid: 348920000,
    totalUsdPaid: 348920.00,
    offersCompletedCount: 924150,
    withdrawalsProcessedCount: 42180,
    monthlyRevenueUsd: 84500.00,
    monthlyAdRevenueUsd: 21800.00,
    monthlyPayoutsUsd: 49200.00,
    netProfitUsd: 35300.00
  });

  const [selectedOfferModal, setSelectedOfferModal] = useState<Offer | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load Initial Data
  const loadInitialData = async () => {
    try {
      const { user: userData, achievements: achs } = await getUserProfile('usr-101');
      setUser(userData);
      setAchievements(achs);

      const { offers: offersData } = await getOffers();
      setOffers(offersData);

      const { methods } = await getPaymentMethods();
      setPaymentMethods(methods);

      const { withdrawals: userWds } = await getUserWithdrawals('usr-101');
      setWithdrawals(userWds);

      const { leaderboard: lb } = await getLeaderboard();
      setLeaderboard(lb);

      const { stats: adminStats } = await getAdminWithdrawals();
      setStats(adminStats);
    } catch (err) {
      console.warn('Backend API initial load fallback:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Login Handler with Email Verification
  const handleLoginWithEmail = async (emailInput: string) => {
    const cleanEmail = emailInput.trim();
    const isAdmin = isAdminEmail(cleanEmail);
    const assignedRole = isAdmin ? 'admin' : 'user';

    let loggedInUser: User;
    if (cleanEmail === 'rolex80805@gmail.com') {
      loggedInUser = {
        id: 'usr-admin-1',
        name: 'Admin Rolex',
        email: 'rolex80805@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        coins: 999999,
        usdValue: 999.99,
        role: 'admin',
        level: 99,
        xp: 99999,
        nextLevelXp: 100000,
        streakDays: 30,
        referralCode: 'ADMIN-ROLEX',
        referralCount: 150,
        referralEarnings: 250000,
        emailVerified: true,
        createdAt: '2025-01-01',
        fraudRiskScore: 'low'
      };
    } else if (cleanEmail === 'mr.malik8805@gmail.com') {
      loggedInUser = {
        id: 'usr-admin-2',
        name: 'Admin Malik',
        email: 'mr.malik8805@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        coins: 999999,
        usdValue: 999.99,
        role: 'admin',
        level: 99,
        xp: 99999,
        nextLevelXp: 100000,
        streakDays: 30,
        referralCode: 'ADMIN-MALIK',
        referralCount: 120,
        referralEarnings: 200000,
        emailVerified: true,
        createdAt: '2025-01-01',
        fraudRiskScore: 'low'
      };
    } else {
      loggedInUser = {
        id: user?.id || 'usr-101',
        name: cleanEmail.split('@')[0] || 'Member',
        email: cleanEmail,
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        coins: user?.coins || 18450,
        usdValue: user?.usdValue || 18.45,
        role: 'user',
        level: user?.level || 4,
        xp: user?.xp || 3200,
        nextLevelXp: user?.nextLevelXp || 5000,
        streakDays: user?.streakDays || 5,
        referralCode: 'MEMBER-CODE',
        referralCount: 3,
        referralEarnings: 4500,
        emailVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
        fraudRiskScore: 'low'
      };
    }

    setUser(loggedInUser);
    setIsAuthenticated(true);
    setActiveTab(isAdmin ? 'admin' : 'dashboard');

    try {
      await switchUserRole(loggedInUser.id, assignedRole);
    } catch (e) {
      // Ignore fallback
    }

    showToast(
      isAdmin
        ? `Welcome Administrator! Signed in as ${loggedInUser.name} (${cleanEmail}). Admin Panel unlocked.`
        : `Signed in as ${loggedInUser.name} (${cleanEmail}).`
    );
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    showToast('Signed out securely.');
  };

  // Switch Role
  const handleSwitchRole = async (role: 'user' | 'admin') => {
    if (!user) return;
    if (role === 'admin' && !isAdminEmail(user.email)) {
      showToast('Admin access restricted to authorized emails (rolex80805@gmail.com & mr.malik8805@gmail.com).');
      return;
    }
    try {
      const { user: updatedUser } = await switchUserRole(user.id, role);
      setUser(updatedUser);
      showToast(`Switched to ${role.toUpperCase()} View Mode.`);
    } catch (err) {
      setUser({ ...user, role });
      showToast(`Switched to ${role.toUpperCase()} View Mode.`);
    }
  };

  // Claim Daily Bonus
  const handleClaimDailyBonus = async () => {
    if (!user) return;
    try {
      const res = await claimDailyBonus(user.id);
      setUser(res.user);
      showToast(res.message);
    } catch (err: any) {
      showToast(err.message || 'Already claimed today!');
    }
  };

  // Offer Completion & Webhook Simulation
  const handleSimulateWebhook = async (offerId: string, provider: string, coins?: number) => {
    if (!user) return;
    try {
      const res = await simulateWebhook(provider, offerId, user.id, coins);
      const { user: updatedUser } = await getUserProfile(user.id);
      setUser(updatedUser);

      const { withdrawals: updatedWds } = await getUserWithdrawals(user.id);
      setWithdrawals(updatedWds);

      setCompletions(prev => [res.completion, ...prev]);
      showToast(`Verified Webhook Received! +${(coins || 1000).toLocaleString()} Coins Credited.`);
    } catch (err: any) {
      showToast(err.message || 'Webhook verification failed.');
    }
  };

  // Submit Withdrawal Request
  const handleRequestWithdrawal = async (
    methodId: string,
    accountDetails: Record<string, string>,
    coins: number
  ) => {
    if (!user) return;
    const res = await requestWithdrawal(user.id, methodId, accountDetails, coins);
    setUser(res.user);
    const { withdrawals: updatedWds } = await getUserWithdrawals(user.id);
    setWithdrawals(updatedWds);
    showToast(res.message);
  };

  // Admin Actions
  const handleProcessAdminWithdrawal = async (
    withdrawalId: string,
    status: 'approved' | 'rejected',
    note?: string
  ) => {
    const res = await processAdminWithdrawal(withdrawalId, status, note);
    const { withdrawals: allWds, stats: newStats } = await getAdminWithdrawals();
    setWithdrawals(allWds);
    setStats(newStats);
    if (user) {
      const { user: updatedUser } = await getUserProfile(user.id);
      setUser(updatedUser);
    }
    showToast(res.message);
  };

  const handleSavePaymentMethod = async (method: PaymentMethod) => {
    const res = await savePaymentMethod(method);
    setPaymentMethods(res.methods);
    showToast(`Payment method "${method.name}" saved successfully.`);
  };

  const handleSaveOffer = async (offer: Offer) => {
    const res = await saveAdminOffer(offer);
    setOffers(res.offers);
    showToast(`Offerwall task "${offer.title}" saved.`);
  };

  const handleRunFraudCheck = async (userId: string) => {
    return await getAiFraudCheck(userId);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D1117] text-white">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent mx-auto"></div>
          <p className="text-xs text-white/50 font-mono">Initializing Aldorado Rewards Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans relative overflow-x-hidden">
      
      {/* Decorative Frosted Glass Radial Ambient Glows */}
      <div className="fixed top-[-100px] left-[-100px] h-[500px] w-[500px] rounded-full bg-[#FFD700] opacity-10 blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-[#FFD700] opacity-10 blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#FFD700] opacity-5 blur-[180px] pointer-events-none z-0"></div>

      {/* Top Navbar */}
      <Navbar
        user={user}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onNavigate={setActiveTab}
        activeTab={activeTab}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce rounded-2xl border border-white/20 bg-black/40 px-5 py-3 text-xs font-bold text-[#FFD700] shadow-2xl backdrop-blur-xl">
          {toastMessage}
        </div>
      )}

      {/* Main Layout */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {!isAuthenticated ? (
          /* Public Unauthenticated Landing View */
          <div className="space-y-6">
            <HeroSection
              stats={stats}
              onStartEarning={() => setIsAuthOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenAdmin={() => setIsAuthOpen(true)}
            />
          </div>
        ) : (
          /* Authenticated Private Workspace Layout */
          <div className="w-full">
            
            {/* Main Content Body */}
            <div className="w-full min-w-0">
              {activeTab === 'dashboard' && (
                <DashboardView
                  user={user}
                  offers={offers}
                  completions={completions}
                  withdrawals={withdrawals}
                  onNavigate={setActiveTab}
                  onClaimDaily={handleClaimDailyBonus}
                  onSelectOffer={(offer) => setSelectedOfferModal(offer)}
                />
              )}

              {activeTab === 'offers' && (
                <OffersView
                  offers={offers}
                  onCompleteOffer={() => {}}
                  onSimulateWebhook={handleSimulateWebhook}
                  selectedOfferModal={selectedOfferModal}
                  onCloseModal={() => setSelectedOfferModal(null)}
                  onSelectOffer={(offer) => setSelectedOfferModal(offer)}
                />
              )}

              {activeTab === 'daily-bonus' && (
                <DailyBonusView
                  user={user}
                  onClaimDailyBonus={handleClaimDailyBonus}
                />
              )}

              {activeTab === 'referral' && (
                <ReferralView user={user} />
              )}

              {activeTab === 'leaderboard' && (
                <LeaderboardView leaderboard={leaderboard} />
              )}

              {activeTab === 'withdraw' && (
                <WithdrawView
                  user={user}
                  paymentMethods={paymentMethods}
                  withdrawals={withdrawals}
                  onRequestWithdrawal={handleRequestWithdrawal}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView user={user} achievements={achievements} />
              )}

              {activeTab === 'support' && (
                <SupportView />
              )}

              {activeTab === 'admin' && (
                <AdminPanel
                  stats={stats}
                  withdrawals={withdrawals}
                  paymentMethods={paymentMethods}
                  offers={offers}
                  onProcessWithdrawal={handleProcessAdminWithdrawal}
                  onSavePaymentMethod={handleSavePaymentMethod}
                  onSaveOffer={handleSaveOffer}
                  onRunFraudCheck={handleRunFraudCheck}
                  currentUserEmail={user.email}
                />
              )}
            </div>

          </div>
        )}

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginWithEmail={(email) => handleLoginWithEmail(email)}
      />

    </div>
  );
}
