export const ADMIN_EMAILS = [
  'rolex80805@gmail.com',
  'mr.malik8805@gmail.com'
];

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coins: number;
  usdValue: number;
  totalEarned?: number;
  role: UserRole;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  lastClaimDate?: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  referralEarnings: number;
  walletAddress?: string;
  emailVerified: boolean;
  createdAt: string;
  fraudRiskScore?: 'low' | 'medium' | 'high';
  banned?: boolean;
}

export type OfferCategory = 'all' | 'gaming' | 'surveys' | 'mobile' | 'desktop' | 'finance' | 'quick';

export type OfferDifficulty = 'easy' | 'medium' | 'hard';

export interface Offer {
  id: string;
  title: string;
  provider: string;
  description: string;
  category: OfferCategory;
  rewardCoins: number;
  usdReward: number;
  estimatedMinutes: number;
  difficulty: OfferDifficulty;
  logoUrl: string;
  badge?: string;
  instructions: string[];
  requirements: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  completionsCount: number;
}

export interface OfferCompletion {
  id: string;
  userId: string;
  userName: string;
  offerId: string;
  offerTitle: string;
  provider: string;
  rewardCoins: number;
  status: 'pending' | 'completed' | 'rejected';
  completedAt: string;
  verifiedVia: 'webhook' | 'server_callback' | 'manual_review';
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'crypto' | 'paypal' | 'giftcard' | 'bank' | 'upi';
  icon: string;
  minWithdrawalCoins: number;
  feePercentage: number;
  description: string;
  requiredFields: string[]; // e.g. ['Wallet Address (TRC20/BEP20)'] or ['PayPal Email']
  enabled: boolean;
}

export type WithdrawalStatus = 'pending' | 'processing' | 'approved' | 'rejected';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  methodId: string;
  methodName: string;
  accountDetails: Record<string, string>;
  coins: number;
  usdAmount: number;
  feeCoins: number;
  netCoins: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  coinsEarned: number;
  offersCompleted: number;
  referrals: number;
  badge?: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalCoinsPaid: number;
  totalUsdPaid: number;
  offersCompletedCount: number;
  withdrawalsProcessedCount: number;
  monthlyRevenueUsd: number;
  monthlyAdRevenueUsd: number;
  monthlyPayoutsUsd: number;
  netProfitUsd: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  rewardCoins: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning';
  createdAt: string;
}
