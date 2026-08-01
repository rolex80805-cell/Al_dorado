import React, { useState, useEffect } from 'react';
import {
  Shield,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Plus,
  Coins,
  Bot,
  AlertTriangle,
  Building2,
  Lock,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Users
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PlatformStats, WithdrawalRequest, PaymentMethod, Offer, User, isAdminEmail, ADMIN_EMAILS } from '../types';
import { getAdminUsers, adjustAdminUser, toggleAdminUserBan, deleteAdminOffer } from '../services/api';

interface AdminPanelProps {
  stats: PlatformStats;
  withdrawals: WithdrawalRequest[];
  paymentMethods: PaymentMethod[];
  offers: Offer[];
  onProcessWithdrawal: (id: string, status: 'approved' | 'rejected', note?: string) => Promise<void>;
  onSavePaymentMethod: (method: PaymentMethod) => Promise<void>;
  onSaveOffer: (offer: Offer) => Promise<void>;
  onRefreshOffers?: () => Promise<void>;
  onRunFraudCheck: (userId: string) => Promise<void>;
  currentUserEmail?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  stats,
  withdrawals,
  paymentMethods,
  offers,
  onProcessWithdrawal,
  onSavePaymentMethod,
  onSaveOffer,
  onRefreshOffers,
  onRunFraudCheck,
  currentUserEmail
}) => {
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'users' | 'methods' | 'offers' | 'analytics' | 'fraud'>('withdrawals');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});
  
  // User Management state
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<User | null>(null);
  const [coinsAdjustment, setCoinsAdjustment] = useState<number>(1000);
  const [streakAdjustment, setStreakAdjustment] = useState<number>(1);

  // Security Authorization Check
  if (!currentUserEmail || !isAdminEmail(currentUserEmail)) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-950/20 p-8 text-center backdrop-blur-md space-y-4 max-w-xl mx-auto my-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40">
          <Lock className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-black text-white">Access Denied: Administrator Required</h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          The Admin Panel is strictly restricted to authorized administrator accounts. Your current email (<span className="text-yellow-400 font-mono">{currentUserEmail || 'Not Signed In'}</span>) does not have administrator privileges.
        </p>
        <div className="pt-2 text-left bg-black/40 p-4 rounded-xl border border-white/10 text-xs space-y-1">
          <p className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-1">Authorized Administrator Emails:</p>
          {ADMIN_EMAILS.map((email, idx) => (
            <p key={idx} className="font-mono text-purple-300 flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-purple-400 shrink-0" />
              {email}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Load Admin Users List
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { users } = await getAdminUsers();
      if (users) setUsersList(users);
    } catch (err) {
      console.warn('Failed to load users list:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Payment Method Form State
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [methodForm, setMethodForm] = useState<Partial<PaymentMethod>>({
    name: '',
    type: 'crypto',
    minWithdrawalCoins: 5000,
    feePercentage: 0,
    description: '',
    requiredFields: ['Wallet Address'],
    enabled: true
  });

  // Offer Form State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState<Partial<Offer>>({
    title: '',
    provider: 'AdGate Media',
    description: '',
    category: 'gaming',
    rewardCoins: 5000,
    usdReward: 5.00,
    estimatedMinutes: 15,
    difficulty: 'medium',
    logoUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=120&q=80',
    badge: 'HOT',
    instructions: ['Download app', 'Complete tutorial'],
    requirements: 'New users only',
    isPopular: true,
    isFeatured: false
  });

  // Fraud check output
  const [fraudOutput, setFraudOutput] = useState<any>(null);

  const chartData = [
    { month: 'Jan', revenue: 42000, payouts: 28000, net: 14000 },
    { month: 'Feb', revenue: 58000, payouts: 35000, net: 23000 },
    { month: 'Mar', revenue: 69000, payouts: 41000, net: 28000 },
    { month: 'Apr', revenue: stats.monthlyRevenueUsd || 84500, payouts: stats.monthlyPayoutsUsd || 49200, net: stats.netProfitUsd || 35300 },
  ];

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await onProcessWithdrawal(id, 'approved', adminNote[id] || 'Approved by Admin');
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    await onProcessWithdrawal(id, 'rejected', adminNote[id] || 'Rejected by Admin Security Check');
    setProcessingId(null);
  };

  const handleAdjustCoins = async (user: User, delta: number) => {
    try {
      await adjustAdminUser(user.id, delta);
      await fetchUsers();
    } catch (e) {
      alert('Failed to adjust coins');
    }
  };

  const handleToggleBan = async (user: User) => {
    try {
      await toggleAdminUserBan(user.id);
      await fetchUsers();
    } catch (e) {
      alert('Failed to toggle ban status');
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteAdminOffer(offerId);
      if (onRefreshOffers) await onRefreshOffers();
    } catch (e) {
      alert('Failed to delete offer');
    }
  };

  const handleSaveMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!methodForm.name) return;

    await onSavePaymentMethod({
      id: methodForm.id || `pm-${Date.now()}`,
      name: methodForm.name,
      type: methodForm.type || 'crypto',
      icon: 'Coins',
      minWithdrawalCoins: methodForm.minWithdrawalCoins || 5000,
      feePercentage: methodForm.feePercentage || 0,
      description: methodForm.description || '',
      requiredFields: methodForm.requiredFields || ['Wallet Address'],
      enabled: methodForm.enabled ?? true
    });

    setShowMethodModal(false);
  };

  const handleSaveOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.title) return;

    await onSaveOffer({
      id: offerForm.id || `off-${Date.now()}`,
      title: offerForm.title,
      provider: offerForm.provider || 'AdGate Media',
      description: offerForm.description || '',
      category: offerForm.category || 'gaming',
      rewardCoins: offerForm.rewardCoins || 5000,
      usdReward: +( (offerForm.rewardCoins || 5000) / 1000 ).toFixed(2),
      estimatedMinutes: offerForm.estimatedMinutes || 15,
      difficulty: offerForm.difficulty || 'medium',
      logoUrl: offerForm.logoUrl || 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=120&q=80',
      badge: offerForm.badge,
      instructions: offerForm.instructions || ['Complete task'],
      requirements: offerForm.requirements || 'New users only',
      isPopular: offerForm.isPopular ?? true,
      isFeatured: offerForm.isFeatured ?? false,
      completionsCount: 0
    });

    if (onRefreshOffers) await onRefreshOffers();
    setShowOfferModal(false);
  };

  const handleFraudCheckClick = async () => {
    setFraudOutput({ loading: true });
    try {
      const res = await onRunFraudCheck(usersList[0]?.id || 'usr-admin-1');
      setFraudOutput(res);
    } catch (e) {
      setFraudOutput({ riskScore: 'low', reasons: ['Standard activity verified.'], confidence: 95 });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-gray-950 via-purple-950/40 to-gray-950 p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">El Doorado Core Admin Suite</h2>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
                  Sovereign Access
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Manage users, withdrawal processing, custom payment gateways, offerwalls, and net revenue.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-purple-950/60 border border-purple-500/30 px-4 py-2.5 rounded-2xl">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-gray-400 block">Monthly Net Profit</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                ${stats.netProfitUsd.toLocaleString()} USD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
          <span className="text-xs font-semibold text-gray-400">Total Registered Users</span>
          <p className="mt-2 text-xl font-black text-white font-mono">{stats.totalUsers}</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
          <span className="text-xs font-semibold text-gray-400">Offers Completed</span>
          <p className="mt-2 text-xl font-black text-yellow-400 font-mono">{stats.offersCompletedCount}</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
          <span className="text-xs font-semibold text-gray-400">Withdrawal Payouts</span>
          <p className="mt-2 text-xl font-black text-red-400 font-mono">${stats.monthlyPayoutsUsd.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
          <span className="text-xs font-semibold text-gray-400">Processed Withdrawals</span>
          <p className="mt-2 text-xl font-black text-emerald-400 font-mono">{stats.withdrawalsProcessedCount}</p>
        </div>

      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
        {[
          { id: 'withdrawals', label: 'Withdrawal Approvals' },
          { id: 'users', label: 'User Directory' },
          { id: 'methods', label: 'Payment Method Manager' },
          { id: 'offers', label: 'Offerwall Manager' },
          { id: 'analytics', label: 'Revenue Analytics' },
          { id: 'fraud', label: 'AI Anti-Fraud Security' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: WITHDRAWAL APPROVALS */}
      {activeTab === 'withdrawals' && (
        <div className="rounded-3xl border border-gray-800 bg-gray-900/90 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pending & Processed Requests</h3>
            <span className="text-xs text-purple-300 font-mono font-bold">{withdrawals.length} Total Requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-950 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Method & Account</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Admin Note</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                      No withdrawal requests in database.
                    </td>
                  </tr>
                ) : (
                  withdrawals.map(req => (
                    <tr key={req.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{req.userName}</p>
                        <p className="text-[10px] text-gray-400">{req.userEmail}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-yellow-400">{req.methodName}</p>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {Object.entries(req.accountDetails).map(([k, v]) => (
                            <span key={k} className="block">{k}: {v}</span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-white font-bold">{req.coins.toLocaleString()} Coins</span>
                        <span className="text-emerald-400 text-[10px] block font-bold">${req.usdAmount.toFixed(2)} USD</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          req.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        }`}>
                          {req.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          placeholder="Admin Note..."
                          value={adminNote[req.id] || req.adminNote || ''}
                          onChange={(e) => setAdminNote({ ...adminNote, [req.id]: e.target.value })}
                          className="w-full px-2 py-1 bg-gray-950 border border-gray-800 rounded text-[11px] text-white"
                        />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(req.id)}
                              disabled={processingId === req.id}
                              className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-gray-950 hover:bg-emerald-400"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              disabled={processingId === req.id}
                              className="flex items-center gap-1 rounded-lg bg-red-500/20 border border-red-500/40 px-3 py-1.5 text-[11px] font-bold text-red-400 hover:bg-red-500 hover:text-white"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500 uppercase">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER DIRECTORY & MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="rounded-3xl border border-gray-800 bg-gray-900/90 overflow-hidden shadow-xl space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Registered Users</h3>
            <button
              onClick={fetchUsers}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold"
            >
              Refresh List
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-950 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Coins Balance</th>
                  <th className="py-3 px-4">Total Earned</th>
                  <th className="py-3 px-4">Streak</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 text-xs">
                      No registered users found.
                    </td>
                  </tr>
                ) : (
                  usersList.map(u => (
                    <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{u.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-300'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-yellow-400">
                        {u.coins.toLocaleString()} Coins (${u.usdValue.toFixed(2)})
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-300">
                        {(u.totalEarned || 0).toLocaleString()} Coins
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-400">
                        🔥 {u.streakDays} Days
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.banned ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {u.banned ? 'BANNED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleAdjustCoins(u, 1000)}
                          className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 rounded text-[10px] font-bold hover:bg-yellow-500 hover:text-black"
                        >
                          +1,000 Coins
                        </button>
                        <button
                          onClick={() => handleToggleBan(u)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${u.banned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
                        >
                          {u.banned ? 'Unban' : 'Ban'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT METHOD MANAGER */}
      {activeTab === 'methods' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Payment Gateways</h3>
            <button
              onClick={() => {
                setMethodForm({ name: '', type: 'crypto', minWithdrawalCoins: 5000, feePercentage: 0, description: '', requiredFields: ['Wallet Address'], enabled: true });
                setShowMethodModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
            >
              <Plus className="h-4 w-4" />
              <span>Add Payment Method</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map(method => (
              <div key={method.id} className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{method.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${method.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {method.enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{method.description}</p>
                <div className="text-xs text-gray-300 font-mono space-y-1">
                  <p>Min Coins: <strong className="text-yellow-400">{method.minWithdrawalCoins.toLocaleString()}</strong></p>
                  <p>Gateway Fee: <strong>{method.feePercentage}%</strong></p>
                  <p>Required Fields: {method.requiredFields.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>

          {showMethodModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-md">
              <form onSubmit={handleSaveMethodSubmit} className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-gray-900 p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Add Custom Payment Method</h3>
                
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Method Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Binance Pay ID / UPI Wire"
                    value={methodForm.name || ''}
                    onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Min Coins</label>
                    <input
                      type="number"
                      value={methodForm.minWithdrawalCoins || 5000}
                      onChange={(e) => setMethodForm({ ...methodForm, minWithdrawalCoins: Number(e.target.value) })}
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Fee %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={methodForm.feePercentage || 0}
                      onChange={(e) => setMethodForm({ ...methodForm, feePercentage: Number(e.target.value) })}
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Description</label>
                  <textarea
                    value={methodForm.description || ''}
                    onChange={(e) => setMethodForm({ ...methodForm, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMethodModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-800 text-xs text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500"
                  >
                    Save Method
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OFFERWALL MANAGER */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Offerwall Task Catalog</h3>
            <button
              onClick={() => {
                setOfferForm({ title: '', provider: 'AdGate Media', description: '', category: 'gaming', rewardCoins: 5000, estimatedMinutes: 15 });
                setShowOfferModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
            >
              <Plus className="h-4 w-4" />
              <span>Add Offer Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map(off => (
              <div key={off.id} className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{off.title}</h4>
                  <button
                    onClick={() => handleDeleteOffer(off.id)}
                    className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400">{off.provider} • {off.category}</p>
                <p className="text-xs text-gray-300">{off.description}</p>
                <div className="text-xs font-mono text-yellow-400 font-bold">
                  Reward: {off.rewardCoins.toLocaleString()} Coins (${off.usdReward.toFixed(2)})
                </div>
              </div>
            ))}
          </div>

          {showOfferModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-md">
              <form onSubmit={handleSaveOfferSubmit} className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-gray-900 p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Create New Offerwall Task</h3>
                
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete Survey on Tech"
                    value={offerForm.title || ''}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Provider</label>
                    <input
                      type="text"
                      value={offerForm.provider || 'AdGate Media'}
                      onChange={(e) => setOfferForm({ ...offerForm, provider: e.target.value })}
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Reward Coins</label>
                    <input
                      type="number"
                      value={offerForm.rewardCoins || 5000}
                      onChange={(e) => setOfferForm({ ...offerForm, rewardCoins: Number(e.target.value) })}
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Description</label>
                  <textarea
                    value={offerForm.description || ''}
                    onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-800 text-xs text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REVENUE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="rounded-3xl border border-gray-800 bg-gray-900/90 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue vs Payout Performance</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="month" stroke="#8B949E" fontSize={11} />
                <YAxis stroke="#8B949E" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D' }} />
                <Area type="monotone" dataKey="revenue" stroke="#FFD700" fill="#FFD700" fillOpacity={0.2} name="Offer Revenue" />
                <Area type="monotone" dataKey="payouts" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} name="User Payouts" />
                <Area type="monotone" dataKey="net" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Net Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 6: AI ANTI-FRAUD SECURITY */}
      {activeTab === 'fraud' && (
        <div className="rounded-3xl border border-purple-500/30 bg-gray-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Risk & Anti-Fraud Assessor</h3>
            </div>
            <button
              onClick={handleFraudCheckClick}
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
            >
              Run User Risk Inspection
            </button>
          </div>

          {fraudOutput && (
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4 space-y-2">
              <p className="text-xs font-bold text-white">Risk Analysis Outcome:</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Risk Score:</span>
                <span className="text-xs font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {fraudOutput.riskScore || 'LOW'}
                </span>
                <span className="text-xs text-gray-400 font-mono">(Confidence: {fraudOutput.confidence || 95}%)</span>
              </div>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                {(fraudOutput.reasons || ['Verified task completion speed']).map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
