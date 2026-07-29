import {
  User,
  Offer,
  OfferCompletion,
  PaymentMethod,
  WithdrawalRequest,
  LeaderboardEntry,
  Achievement,
  Announcement,
  PlatformStats
} from '../types';

export async function getUserProfile(userId: string = 'usr-101'): Promise<{ user: User; achievements: Achievement[] }> {
  const res = await fetch(`/api/user/profile/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function switchUserRole(userId: string, role: 'user' | 'admin'): Promise<{ user: User }> {
  const res = await fetch('/api/user/switch-role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, role }),
  });
  if (!res.ok) throw new Error('Failed to switch role');
  return res.json();
}

export async function claimDailyBonus(userId: string): Promise<{ success: boolean; bonusCoins: number; user: User; message: string }> {
  const res = await fetch('/api/user/daily-bonus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to claim daily bonus');
  }
  return res.json();
}

export async function getOffers(): Promise<{ offers: Offer[] }> {
  const res = await fetch('/api/offers');
  if (!res.ok) throw new Error('Failed to fetch offers');
  return res.json();
}

export async function completeOffer(userId: string, offerId: string): Promise<{ success: boolean; completion: OfferCompletion; user: User; message: string }> {
  const res = await fetch('/api/offers/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, offerId }),
  });
  if (!res.ok) throw new Error('Failed to verify offer completion');
  return res.json();
}

export async function simulateWebhook(provider: string, offerId: string, userId: string, payoutCoins?: number): Promise<{ status: string; verified: boolean; message: string; completion: OfferCompletion }> {
  const res = await fetch('/api/offers/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, offerId, userId, payoutCoins, signature: 'sha256_mock_sig' }),
  });
  if (!res.ok) throw new Error('Webhook verification failed');
  return res.json();
}

export async function getPaymentMethods(): Promise<{ methods: PaymentMethod[] }> {
  const res = await fetch('/api/payment-methods');
  if (!res.ok) throw new Error('Failed to fetch payment methods');
  return res.json();
}

export async function savePaymentMethod(method: PaymentMethod): Promise<{ success: boolean; methods: PaymentMethod[] }> {
  const res = await fetch('/api/admin/payment-methods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(method),
  });
  if (!res.ok) throw new Error('Failed to save payment method');
  return res.json();
}

export async function requestWithdrawal(userId: string, methodId: string, accountDetails: Record<string, string>, coins: number): Promise<{ success: boolean; withdrawal: WithdrawalRequest; user: User; message: string }> {
  const res = await fetch('/api/withdrawals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, methodId, accountDetails, coins }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to submit withdrawal request');
  }
  return res.json();
}

export async function getUserWithdrawals(userId: string): Promise<{ withdrawals: WithdrawalRequest[] }> {
  const res = await fetch(`/api/withdrawals/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch withdrawals history');
  return res.json();
}

export async function getAdminWithdrawals(): Promise<{ withdrawals: WithdrawalRequest[]; stats: PlatformStats }> {
  const res = await fetch('/api/admin/withdrawals');
  if (!res.ok) throw new Error('Failed to fetch admin withdrawals');
  return res.json();
}

export async function processAdminWithdrawal(withdrawalId: string, status: 'approved' | 'rejected', adminNote?: string): Promise<{ success: boolean; withdrawal: WithdrawalRequest; message: string }> {
  const res = await fetch('/api/admin/withdrawals/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ withdrawalId, status, adminNote }),
  });
  if (!res.ok) throw new Error('Failed to process withdrawal');
  return res.json();
}

export async function saveAdminOffer(offer: Offer): Promise<{ success: boolean; offers: Offer[] }> {
  const res = await fetch('/api/admin/offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offer),
  });
  if (!res.ok) throw new Error('Failed to save offer');
  return res.json();
}

export async function getLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[] }> {
  const res = await fetch('/api/leaderboard');
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export async function getAnnouncements(): Promise<{ announcements: Announcement[] }> {
  const res = await fetch('/api/announcements');
  if (!res.ok) throw new Error('Failed to fetch announcements');
  return res.json();
}

export async function getAiRecommendations(userId: string, preferredCategory?: string): Promise<{ recommended: Offer[]; aiInsight: string }> {
  const res = await fetch('/api/ai/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, preferredCategory }),
  });
  if (!res.ok) throw new Error('Failed to get AI recommendations');
  return res.json();
}

export async function getAiFraudCheck(userId: string): Promise<{ riskScore: 'low' | 'medium' | 'high'; reasons: string[]; confidence: number }> {
  const res = await fetch('/api/ai/fraud-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error('Failed to run AI fraud check');
  return res.json();
}
