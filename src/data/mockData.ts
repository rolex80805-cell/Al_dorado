import { Offer, PaymentMethod, LeaderboardEntry, PlatformStats, Achievement, Announcement } from '../types';

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-cpx-1',
    title: 'CPX Research Paid Daily Surveys & Opinion Wall',
    provider: 'CPX Research',
    description: 'Complete top paying market research surveys tailored to your demographic. Instant postback verification.',
    category: 'surveys',
    rewardCoins: 5000,
    usdReward: 5.00,
    estimatedMinutes: 8,
    difficulty: 'easy',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80',
    badge: 'CPX LIVE',
    instructions: [
      'Click "Start Task" to launch CPX Research survey wall.',
      'Answer profile questions honestly.',
      'Complete any available survey.',
      'Postback callback automatically credits 5,000 coins ($5.00) instantly!'
    ],
    requirements: 'Available globally on mobile and desktop.',
    isPopular: true,
    isFeatured: true,
    completionsCount: 5120
  },
  {
    id: 'off-1',
    title: 'Reach City Hall Level 10 in Clash of Empires',
    provider: 'AdGate Media',
    description: 'Download Clash of Empires and reach City Hall level 10 within 14 days of installation.',
    category: 'gaming',
    rewardCoins: 15000,
    usdReward: 15.00,
    estimatedMinutes: 45,
    difficulty: 'medium',
    logoUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=120&q=80',
    badge: 'HOT',
    instructions: [
      'Click "Start Task" and download the app via the official store link.',
      'Open the app and complete the tutorial.',
      'Upgrade your City Hall to Level 10.',
      'Server webhook automatically verifies your progress and credits 15,000 coins!'
    ],
    requirements: 'New mobile users only. Must enable app tracking.',
    isPopular: true,
    isFeatured: true,
    completionsCount: 0
  },
  {
    id: 'off-2',
    title: 'Complete Consumer Habits Tech Survey',
    provider: 'BitLabs Surveys',
    description: 'Share your opinion on consumer gadgets, subscription services, and AI tools.',
    category: 'surveys',
    rewardCoins: 3200,
    usdReward: 3.20,
    estimatedMinutes: 12,
    difficulty: 'easy',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80',
    badge: 'QUICK',
    instructions: [
      'Answer honest screening questions.',
      'Complete the full 12-minute survey.',
      'Submit your feedback to get verified automatically.'
    ],
    requirements: 'Age 18+. Valid email address.',
    isPopular: true,
    isFeatured: false,
    completionsCount: 0
  },
  {
    id: 'off-3',
    title: 'Register & Deposit on CryptoX Exchange',
    provider: 'OfferToro',
    description: 'Create an account on CryptoX, verify KYC, and make a minimum first deposit of $10.',
    category: 'finance',
    rewardCoins: 45000,
    usdReward: 45.00,
    estimatedMinutes: 20,
    difficulty: 'hard',
    logoUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=120&q=80',
    badge: 'HIGH PAYOUT',
    instructions: [
      'Register a new CryptoX trading account via link.',
      'Complete identity check.',
      'Deposit $10 minimum.',
      'Webhook credits 45,000 coins within 15 minutes of deposit!'
    ],
    requirements: 'New users only. KYC verification required.',
    isPopular: true,
    isFeatured: true,
    completionsCount: 0
  },
  {
    id: 'off-4',
    title: 'Install & Try Nord Security Shield',
    provider: 'CPALead',
    description: 'Download the security app, start a 7-day free trial, and keep it active for 24 hours.',
    category: 'mobile',
    rewardCoins: 8500,
    usdReward: 8.50,
    estimatedMinutes: 5,
    difficulty: 'easy',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&q=80',
    badge: 'TOP RATED',
    instructions: [
      'Install Nord Security Shield from Google Play / App Store.',
      'Start free trial.',
      'Keep installed for at least 24 hours.'
    ],
    requirements: 'Valid payment method for trial verification.',
    isPopular: false,
    isFeatured: false,
    completionsCount: 0
  },
  {
    id: 'off-5',
    title: 'Watch Sponsored Montag Product Spotlights (5 Videos)',
    provider: 'Montag Verified Tasks',
    description: 'Watch 5 interactive video spotlights from verified Montag sponsor campaigns with end-of-video quiz.',
    category: 'quick',
    rewardCoins: 1200,
    usdReward: 1.20,
    estimatedMinutes: 8,
    difficulty: 'easy',
    logoUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=120&q=80',
    badge: 'VERIFIED AD',
    instructions: [
      'Watch 5 consecutive sponsored video spotlights.',
      'Answer 1 simple verification quiz question at the end.',
      'Get verified by Montag webhook to receive your 1,200 coins!'
    ],
    requirements: 'No ad-blockers allowed.',
    isPopular: true,
    isFeatured: true,
    completionsCount: 0
  },
  {
    id: 'off-6',
    title: 'Sign Up for FinTech Budget Planner',
    provider: 'RevenueWall',
    description: 'Create a free account on SmartBudget and link one trackable expense account.',
    category: 'desktop',
    rewardCoins: 5000,
    usdReward: 5.00,
    estimatedMinutes: 10,
    difficulty: 'medium',
    logoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=120&q=80',
    badge: 'NEW',
    instructions: [
      'Register free account.',
      'Verify your email.',
      'Complete onboarding tour.'
    ],
    requirements: 'Desktop browser or mobile Web.',
    isPopular: false,
    isFeatured: false,
    completionsCount: 0
  }
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-usdt',
    name: 'Tether USDT (TRC-20 / BEP-20)',
    type: 'crypto',
    icon: 'Coins',
    minWithdrawalCoins: 5000, // $5.00
    feePercentage: 0,
    description: 'Instant crypto payout directly to your Binance, Trust Wallet, or Web3 address.',
    requiredFields: ['USDT Wallet Address', 'Network (TRC20 or BEP20)'],
    enabled: true
  },
  {
    id: 'pm-paypal',
    name: 'PayPal Instant Transfer',
    type: 'paypal',
    icon: 'Wallet',
    minWithdrawalCoins: 10000, // $10.00
    feePercentage: 2.5,
    description: 'Direct PayPal balance transfer in USD, EUR, or GBP.',
    requiredFields: ['PayPal Account Email'],
    enabled: true
  },
  {
    id: 'pm-amazon',
    name: 'Amazon Digital Gift Card',
    type: 'giftcard',
    icon: 'Gift',
    minWithdrawalCoins: 5000, // $5.00
    feePercentage: 0,
    description: 'E-gift card code sent to your registered email address.',
    requiredFields: ['Recipient Email', 'Preferred Currency (USD/EUR/GBP)'],
    enabled: true
  },
  {
    id: 'pm-crypto-btc',
    name: 'Bitcoin (BTC)',
    type: 'crypto',
    icon: 'Bitcoin',
    minWithdrawalCoins: 25000, // $25.00
    feePercentage: 1.0,
    description: 'Direct Bitcoin blockchain payout.',
    requiredFields: ['Bitcoin BTC Address'],
    enabled: true
  },
  {
    id: 'pm-bank',
    name: 'Global Wire / Wise Transfer',
    type: 'bank',
    icon: 'Building2',
    minWithdrawalCoins: 50000, // $50.00
    feePercentage: 1.5,
    description: 'Direct bank transfer via Swift/Wise to 80+ countries.',
    requiredFields: ['Bank Account Name', 'IBAN / Account Number', 'BIC/SWIFT Code'],
    enabled: true
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Step to Fortune',
    description: 'Complete your first verified offer task.',
    icon: 'Award',
    progress: 0,
    maxProgress: 1,
    completed: false,
    rewardCoins: 500
  },
  {
    id: 'ach-2',
    title: 'Streak Titan',
    description: 'Maintain a 7-day login & bonus claim streak.',
    icon: 'Zap',
    progress: 0,
    maxProgress: 7,
    completed: false,
    rewardCoins: 2500
  },
  {
    id: 'ach-3',
    title: 'Referral Ambassador',
    description: 'Invite 5 active friends who complete at least 1 offer.',
    icon: 'Users',
    progress: 0,
    maxProgress: 5,
    completed: false,
    rewardCoins: 5000
  },
  {
    id: 'ach-4',
    title: 'Gold Collector',
    description: 'Accumulate a total of 100,000 coins earned.',
    icon: 'Crown',
    progress: 0,
    maxProgress: 100000,
    completed: false,
    rewardCoins: 10000
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🚀 Montag Verified Video Tasks 2x Bonus Active!',
    content: 'Earn double coin rewards on all Montag sponsor video tasks completed this week!',
    type: 'success',
    createdAt: '2 hours ago'
  },
  {
    id: 'ann-2',
    title: '⚡ Instant USDT & PayPal Payout System Upgraded',
    content: 'All verified crypto & PayPal withdrawal requests are processed automatically upon admin approval!',
    type: 'info',
    createdAt: '1 day ago'
  }
];

export const INITIAL_PLATFORM_STATS: PlatformStats = {
  totalUsers: 2,
  totalCoinsPaid: 0,
  totalUsdPaid: 0,
  offersCompletedCount: 0,
  withdrawalsProcessedCount: 0,
  monthlyRevenueUsd: 0,
  monthlyAdRevenueUsd: 0,
  monthlyPayoutsUsd: 0,
  netProfitUsd: 0
};
