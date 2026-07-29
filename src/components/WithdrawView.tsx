import React, { useState } from 'react';
import {
  Wallet,
  Coins,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  X
} from 'lucide-react';
import { User, PaymentMethod, WithdrawalRequest } from '../types';

interface WithdrawViewProps {
  user: User;
  paymentMethods: PaymentMethod[];
  withdrawals: WithdrawalRequest[];
  onRequestWithdrawal: (
    methodId: string,
    accountDetails: Record<string, string>,
    coins: number
  ) => Promise<void>;
}

export const WithdrawView: React.FC<WithdrawViewProps> = ({
  user,
  paymentMethods,
  withdrawals,
  onRequestWithdrawal
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMethodModal, setSelectedMethodModal] = useState<PaymentMethod | null>(null);
  const [accountDetails, setAccountDetails] = useState<Record<string, string>>({});
  const [withdrawCoins, setWithdrawCoins] = useState<number>(1000);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'giftcards', label: 'Gift cards' },
    { id: 'ewallets', label: 'E-wallets' },
    { id: 'mobile', label: 'Mobile money' }
  ];

  const filteredMethods = paymentMethods.filter(m => {
    if (!m.enabled) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'crypto' && (m.id.includes('usdt') || m.id.includes('btc') || m.id.includes('ltc') || m.name.toLowerCase().includes('coin') || m.name.toLowerCase().includes('crypto'))) return true;
    if (activeCategory === 'giftcards' && (m.id.includes('amazon') || m.id.includes('card'))) return true;
    if (activeCategory === 'ewallets' && (m.id.includes('paypal') || m.id.includes('payeer'))) return true;
    if (activeCategory === 'mobile' && m.id.includes('m-pesa')) return true;
    return true;
  });

  const handleOpenModal = (method: PaymentMethod) => {
    setSelectedMethodModal(method);
    setWithdrawCoins(Math.max(method.minWithdrawalCoins, 1000));
    setAccountDetails({});
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCloseModal = () => {
    setSelectedMethodModal(null);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedMethodModal) return;

    if (withdrawCoins < selectedMethodModal.minWithdrawalCoins) {
      setErrorMsg(`Minimum withdrawal is ${selectedMethodModal.minWithdrawalCoins.toLocaleString()} coins ($${(selectedMethodModal.minWithdrawalCoins / 1000).toFixed(2)}).`);
      return;
    }

    if (user.coins < withdrawCoins) {
      setErrorMsg('Insufficient coin balance in your account.');
      return;
    }

    for (const field of selectedMethodModal.requiredFields) {
      if (!accountDetails[field] || accountDetails[field].trim() === '') {
        setErrorMsg(`Please fill in: ${field}`);
        return;
      }
    }

    try {
      setSubmitting(true);
      await onRequestWithdrawal(selectedMethodModal.id, accountDetails, withdrawCoins);
      setSuccessMsg(`Withdrawal request submitted successfully!`);
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit withdrawal request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title & Available Balance Row (Matching Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Withdraw</h2>
          <p className="text-sm text-white/60 mt-1">
            Convert your earned coins into real-world rewards and gift cards.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0F141E] px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
          <span>Balance:</span>
          <div className="flex items-center gap-1 font-mono text-[#FFD700]">
            <Coins className="h-3.5 w-3.5" />
            <span>{(user.coins ?? 0).toLocaleString()}</span>
          </div>
          <span className="text-white/40">(${(user.usdValue ?? 0).toFixed(2)})</span>
        </div>
      </div>

      {/* Category Filter Pills (Matching Image 3) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-5 py-2 text-xs font-semibold rounded-full transition-all ${
              activeCategory === cat.id
                ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 shadow-sm'
                : 'bg-[#0F141E] text-white/70 border border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Payment Method Cards (Matching Image 3) */}
      <div className="space-y-4">
        {filteredMethods.map(method => (
          <div
            key={method.id}
            className="rounded-[28px] border border-white/10 bg-[#0F141E] p-6 backdrop-blur-md shadow-xl transition-all hover:border-white/20"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">{method.name}</h3>
              <span className="text-[10px] font-bold tracking-wider text-white/50 uppercase bg-[#1A202C] px-3 py-1 rounded-md">
                {method.id.includes('usdt') || method.id.includes('btc') || method.id.includes('ltc') ? 'CRYPTO' :
                 method.id.includes('amazon') ? 'GIFT CARD' :
                 method.id.includes('m-pesa') ? 'MOBILE MONEY' : 'E-WALLET'}
              </span>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              {method.description}
            </p>

            <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
              <span>Min. ${(method.minWithdrawalCoins / 1000).toFixed(2)}</span>
              <span>Fee: {method.feePercentage}%</span>
            </div>

            <button
              onClick={() => handleOpenModal(method)}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFD700] py-3.5 text-sm font-bold text-[#0D1117] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]"
            >
              <span>Withdraw</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Withdrawal Form Modal (Matching Image 4) */}
      {selectedMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0F141E] p-6 shadow-2xl">
            
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 rounded-xl border border-white/10 bg-white/5 p-2 text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Withdraw {selectedMethodModal.name}</h3>
            <p className="text-xs text-white/60 mb-5">
              Enter details below. Minimum withdrawal is {(selectedMethodModal.minWithdrawalCoins / 1000).toFixed(2)} USD ({selectedMethodModal.minWithdrawalCoins.toLocaleString()} coins).
            </p>

            {errorMsg && (
              <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitModal} className="space-y-4">
              {selectedMethodModal.requiredFields.map(field => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">{field}</label>
                  <input
                    type="text"
                    required
                    placeholder={`Enter ${field}`}
                    value={accountDetails[field] || ''}
                    onChange={(e) => setAccountDetails({ ...accountDetails, [field]: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">Coins to withdraw</label>
                <input
                  type="number"
                  min={selectedMethodModal.minWithdrawalCoins}
                  max={user.coins}
                  step={100}
                  value={withdrawCoins}
                  onChange={(e) => setWithdrawCoins(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-mono font-bold text-[#FFD700] focus:outline-none focus:border-[#FFD700]"
                />
                <p className="text-[10px] text-white/40 mt-1 font-mono">
                  ≈ ${(withdrawCoins / 1000).toFixed(2)} USD payout
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFD700] py-3.5 text-xs font-bold text-[#0D1117] hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{submitting ? 'Processing...' : 'Submit Withdrawal'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-white/60 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Withdrawal History Feed */}
      <div className="rounded-[28px] border border-white/10 bg-[#0F141E] p-6 backdrop-blur-md shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Withdrawal History</h3>
        
        {withdrawals.length === 0 ? (
          <p className="text-xs text-white/40 py-6 text-center">No withdrawal requests found yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {withdrawals.map(req => (
              <div key={req.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{req.methodName}</p>
                  <p className="text-[10px] text-white/40">{new Date(req.requestedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#FFD700] font-mono">${req.usdAmount.toFixed(2)} USD</span>
                  <p className="text-[10px] capitalize text-emerald-400 font-bold">{req.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

