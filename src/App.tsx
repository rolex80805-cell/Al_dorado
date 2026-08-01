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
  isAdminEmail
} from './types';

import {
  loginWithEmail,
  getUserProfile,
  switchUserRole,
  claimDailyBonus,
  getOffers,
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

const EMPTY_USER: User = {
  id: '',
  name: 'Member',
  email: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  coins: 0,
  usdValue: 0.00,
  totalEarned: 0,
  role: 'user',
  level: 1,
  xp: 0,
  nextLevelXp: 1000,
  streakDays: 0,
  referralCode: '',
  referralCount: 0,
  referralEarnings: 0,
  emailVerified: true,
  createdAt: new Date().toISOString().split('T')[0],
  fraudRiskScore: 'low'
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<User>(EMPTY_USER);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [completions, setCompletions] = useState<OfferCompletion[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalCoinsPaid: 0,
    totalUsdPaid: 0,
    offersCompletedCount: 0,
    withdrawalsProcessedCount: 0,
    monthlyRevenueUsd: 0,
    monthlyAdRevenueUsd: 0,
    monthlyPayoutsUsd: 0,
    netProfitUsd: 0
  });

  const [selectedOfferModal, setSelectedOfferModal] = useState<Offer | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load General Platform Catalog Data
  const loadCatalogData = async () => {
    try {
      const { offers: offersData } = await getOffers();
      if (offersData) setOffers(offersData);
    } catch (err) {
      console.warn('Offers load fallback:', err);
    }

    try {
      const { methods } = await getPaymentMethods();
      if (methods) setPaymentMethods(methods);
    } catch (err) {
      console.warn('Payment methods fallback:', err);
    }

    try {
      const { leaderboard: lb } = await getLeaderboard();
      if (lb) setLeaderboard(lb);
    } catch (err) {
      console.warn('Leaderboard fallback:', err);
    }

    try {
      const { stats: adminStats } = await getAdminWithdrawals();
      if (adminStats) setStats(adminStats);
    } catch (err) {
      console.warn('Stats fallback:', err);
    }
  };

  // Load User Specific Account Data
  const loadUserData = async (userId: string) => {
    try {
      const { user: userData, achievements: achs } = await getUserProfile(userId);
      if (userData) setUser(userData);
      if (achs) setAchievements(achs);

      const { withdrawals: userWds } = await getUserWithdrawals(userData?.id || userId);
      if (userWds) setWithdrawals(userWds);
    } catch (err) {
      console.warn('User data load error:', err);
    }
  };

  // Login Handler with Database Integration
  const handleLoginWithEmail = async (emailInput: string) => {
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) return;

    try {
      const res = await loginWithEmail(cleanEmail);
      if (res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        localStorage.setItem('aldorado_user_email', cleanEmail);
        setActiveTab(res.user.role === 'admin' ? 'admin' : 'dashboard');

        await loadUserData(res.user.id);
        await loadCatalogData();

        showToast(
          res.user.role === 'admin'
            ? `Welcome Administrator! Signed in as ${res.user.name} (${cleanEmail}). Admin Panel unlocked.`
            : `Welcome back, ${res.user.name} (${cleanEmail})!`
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please try again.');
    }
  };

  // Auto Login on Mount if session exists
  useEffect(() => {
    loadCatalogData();
    const savedEmail = localStorage.getItem('aldorado_user_email');
    if (savedEmail) {
      handleLoginWithEmail(savedEmail);
    }
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('aldorado_user_email');
    setIsAuthenticated(false);
    setUser(EMPTY_USER);
    setActiveTab('dashboard');
    showToast('Signed out securely.');
  };

  // Switch Role
  const handleSwitchRole = async (role: 'user' | 'admin') => {
    if (!user || !user.id) return;
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
    if (!user || !user.id) return;
    try {
      const res = await claimDailyBonus(user.id);
      setUser(res.user);
      showToast(res.message);
      await loadUserData(user.id);
      await loadCatalogData();
    } catch (err: any) {
      showToast(err.message || 'Already claimed today!');
    }
  };

  // Offer Completion & Webhook Simulation
  const handleSimulateWebhook = async (offerId: string, provider: string, coins?: number) => {
    if (!user || !user.id) return;
    try {
      const res = await simulateWebhook(provider, offerId, user.id, coins);
      setUser(prev => ({
        ...prev,
        coins: prev.coins + (coins || res.completion.rewardCoins),
        totalEarned: (prev.totalEarned || 0) + (coins || res.completion.rewardCoins),
        usdValue: +((prev.coins + (coins || res.completion.rewardCoins)) / 1000).toFixed(2)
      }));

      setCompletions(prev => [res.completion, ...prev]);
      await loadUserData(user.id);
      await loadCatalogData();

      showToast(`Verified Webhook Received! +${(coins || res.completion.rewardCoins).toLocaleString()} Coins Credited.`);
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
    if (!user || !user.id) return;
    const res = await requestWithdrawal(user.id, methodId, accountDetails, coins);
    setUser(res.user);
    const { withdrawals: updatedWds } = await getUserWithdrawals(user.id);
    setWithdrawals(updatedWds);
    await loadCatalogData();
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
    if (user && user.id) {
      await loadUserData(user.id);
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

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans relative overflow-x-hidden">
      
      {/* Decorative Ambient Glows */}
      <div className="fixed top-[-100px] left-[-100px] h-[500px] w-[500px] rounded-full bg-[#FFD700] opacity-10 blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-[#FFD700] opacity-10 blur-[150px] pointer-events-none z-0"></div>

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
                  user={user}
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
                  onRefreshOffers={loadCatalogData}
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
