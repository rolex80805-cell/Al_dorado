import React, { useState } from 'react';
import {
  Clock,
  ExternalLink,
  Coins,
  CheckCircle2,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';
import { Offer, OfferCategory } from '../types';

interface OffersViewProps {
  offers: Offer[];
  onCompleteOffer: (offerId: string) => void;
  onSimulateWebhook: (offerId: string, provider: string, coins?: number) => void;
  selectedOfferModal: Offer | null;
  onCloseModal: () => void;
  onSelectOffer: (offer: Offer) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  offers,
  onCompleteOffer,
  onSimulateWebhook,
  selectedOfferModal,
  onCloseModal,
  onSelectOffer
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccessMessage, setVerificationSuccessMessage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'quick', label: 'Quick tasks' },
    { id: 'surveys', label: 'Survey' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'finance', label: 'Finance' },
    { id: 'shopping', label: 'Shopping' }
  ];

  const filteredOffers = offers.filter(o => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'quick' && o.category === 'quick') return true;
    if (activeCategory === 'surveys' && o.category === 'surveys') return true;
    if (activeCategory === 'gaming' && o.category === 'gaming') return true;
    if (activeCategory === 'finance' && o.category === 'finance') return true;
    if (activeCategory === 'shopping' && o.category === 'desktop') return true;
    return o.category === activeCategory;
  });

  const handleRunWebhookSimulation = async (offer: Offer) => {
    setIsVerifying(true);
    setVerificationSuccessMessage(null);

    setTimeout(() => {
      onSimulateWebhook(offer.id, offer.provider, offer.rewardCoins);
      setIsVerifying(false);
      setVerificationSuccessMessage(`Server Webhook Verified! +${offer.rewardCoins.toLocaleString()} Coins credited.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Title & Description */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Offers</h2>
        <p className="text-sm text-white/60 mt-1">
          Complete tasks from our partners. Rewards are credited after verification.
        </p>
      </div>

      {/* Category Pills (Matching Image 1) */}
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

      {/* Offer Cards Feed (Matching Image 1) */}
      <div className="space-y-4">
        {filteredOffers.map(offer => (
          <div
            key={offer.id}
            className="rounded-[28px] border border-white/10 bg-[#0F141E] p-6 backdrop-blur-md shadow-xl transition-all hover:border-white/20"
          >
            {/* Top Row: Provider Pill & Coin Reward */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold tracking-wider text-white/50 uppercase bg-[#1A202C] px-3 py-1 rounded-md">
                {offer.provider}
              </span>

              <div className="flex items-center gap-1.5 text-lg font-extrabold text-[#FFD700] font-mono">
                <div className="h-5 w-5 rounded-full bg-[#FFD700] text-[#0D1117] flex items-center justify-center text-xs font-bold">
                  $
                </div>
                <span>{offer.rewardCoins.toLocaleString()}</span>
              </div>
            </div>

            {/* Offer Title & Description */}
            <h3 className="text-lg font-bold text-white">
              {offer.title}
            </h3>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              {offer.description}
            </p>

            {/* Metadata Badges */}
            <div className="mt-4 flex items-center gap-3 text-xs text-white/40">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>~{offer.estimatedMinutes} min</span>
              </div>
              <span className="capitalize">{offer.difficulty}</span>
              <span className="capitalize">{offer.category === 'surveys' ? 'Survey' : offer.category}</span>
            </div>

            {/* Action Button: Bright Yellow Pill Button */}
            <button
              onClick={() => onSelectOffer(offer)}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFD700] py-3.5 text-sm font-bold text-[#0D1117] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]"
            >
              <span>Start offer</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {selectedOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0F141E] p-6 shadow-2xl">
            
            <button
              onClick={onCloseModal}
              className="absolute right-4 top-4 rounded-xl border border-white/10 bg-white/5 p-2 text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] font-bold text-lg">
                A
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#FFD700] uppercase bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20">
                  {selectedOfferModal.provider}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedOfferModal.title}</h3>
                <p className="text-xs text-[#FFD700] font-mono font-bold">
                  Reward: +{selectedOfferModal.rewardCoins.toLocaleString()} Coins (${selectedOfferModal.usdReward.toFixed(2)})
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider">Instructions:</h4>
              <ul className="space-y-2">
                {selectedOfferModal.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFD700]/20 text-[10px] font-bold text-[#FFD700]">
                      {idx + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {verificationSuccessMessage && (
              <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{verificationSuccessMessage}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => handleRunWebhookSimulation(selectedOfferModal)}
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-xs font-bold text-[#0D1117] hover:bg-emerald-400 transition-all disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <Zap className="h-4 w-4 animate-spin" />
                    <span>Verifying Callback...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Simulate Webhook & Claim +{selectedOfferModal.rewardCoins.toLocaleString()} Coins</span>
                  </>
                )}
              </button>

              <button
                onClick={onCloseModal}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

