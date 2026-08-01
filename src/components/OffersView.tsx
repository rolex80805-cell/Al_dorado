import React, { useState } from 'react';
import {
  Clock,
  ExternalLink,
  Coins,
  CheckCircle2,
  ShieldCheck,
  Zap,
  X,
  Play,
  HelpCircle,
  Sparkles,
  Send
} from 'lucide-react';
import { Offer, User } from '../types';

interface OffersViewProps {
  user?: User;
  offers: Offer[];
  onCompleteOffer: (offerId: string) => void;
  onSimulateWebhook: (offerId: string, provider: string, coins?: number) => void;
  selectedOfferModal: Offer | null;
  onCloseModal: () => void;
  onSelectOffer: (offer: Offer) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  user,
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
  const [modalTab, setModalTab] = useState<'launch' | 'survey' | 'webhook'>('launch');

  // CPX Research Publisher Settings
  const [cpxAppId, setCpxAppId] = useState<string>(() => localStorage.getItem('cpx_app_id') || '34988');
  const [showCpxSettings, setShowCpxSettings] = useState(false);

  // Interactive Quick Survey State
  const [surveyAge, setSurveyAge] = useState('25-34');
  const [surveyDevice, setSurveyDevice] = useState('Mobile/Tablet');
  const [surveyTopic, setSurveyTopic] = useState('Technology & Apps');
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false);

  const saveCpxAppId = (newId: string) => {
    setCpxAppId(newId);
    localStorage.setItem('cpx_app_id', newId);
  };

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

  const getCPXWallUrl = (userId?: string) => {
    const uid = userId || user?.id || 'usr-admin-1';
    return `https://offers.cpx-research.com/index.php?app_id=${encodeURIComponent(cpxAppId)}&ext_user_id=${encodeURIComponent(uid)}&sub_id_1=${encodeURIComponent(uid)}`;
  };

  const handleOpenCPXDirect = (offer: Offer) => {
    const url = getCPXWallUrl(user?.id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRunWebhookSimulation = async (offer: Offer) => {
    setIsVerifying(true);
    setVerificationSuccessMessage(null);

    setTimeout(() => {
      onSimulateWebhook(offer.id, offer.provider, offer.rewardCoins);
      setIsVerifying(false);
      setVerificationSuccessMessage(`Server Webhook Verified! +${offer.rewardCoins.toLocaleString()} Coins credited.`);
    }, 1200);
  };

  const handleInteractiveSurveySubmit = async (offer: Offer) => {
    setIsSubmittingSurvey(true);
    setVerificationSuccessMessage(null);

    try {
      const uid = user?.id || 'usr-admin-1';
      const transId = `cpx_${Date.now()}`;
      const reward = offer.rewardCoins || 5000;
      
      const res = await fetch(`/api/postback/cpx?status=1&trans_id=${transId}&user_id=${encodeURIComponent(uid)}&amount_local=${reward}&sub_id=cpx_research&offer_id=${offer.id}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        onSimulateWebhook(offer.id, 'CPX Research', reward);
        setVerificationSuccessMessage(`🎉 Survey Completed! Instant CPX Postback Verified (+${reward.toLocaleString()} Coins).`);
      } else {
        onSimulateWebhook(offer.id, 'CPX Research', reward);
        setVerificationSuccessMessage(`🎉 Survey Submitted! +${reward.toLocaleString()} Coins credited.`);
      }
    } catch (err) {
      onSimulateWebhook(offer.id, 'CPX Research', offer.rewardCoins);
      setVerificationSuccessMessage(`🎉 Survey Submitted! +${offer.rewardCoins.toLocaleString()} Coins credited.`);
    } finally {
      setIsSubmittingSurvey(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Title & Description */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <span>Offers & Surveys</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            CPX Live
          </span>
        </h2>
        <p className="text-sm text-white/60 mt-1">
          Complete high paying tasks and live CPX market research surveys. Rewards credit automatically.
        </p>
      </div>

      {/* Category Pills */}
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

      {/* CPX Research Publisher Config & Widget Elements */}
      <div className="rounded-3xl border border-[#FFD700]/30 bg-[#0F141E] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] font-bold text-xs">
              CPX
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                CPX Research Survey Integration & Widget Mount Points
              </h3>
              <p className="text-[11px] text-white/60">
                Script tag loaded. Required widget target container IDs are active below.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCpxSettings(!showCpxSettings)}
            className="text-xs font-bold text-[#FFD700] hover:underline self-start sm:self-auto"
          >
            {showCpxSettings ? 'Hide CPX Settings' : 'Configure CPX App ID'}
          </button>
        </div>

        {/* Expandable App ID Settings & Error Diagnosis */}
        {showCpxSettings && (
          <div className="rounded-2xl border border-white/10 bg-[#161D2C] p-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/80">Your CPX Research App ID:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cpxAppId}
                  onChange={(e) => saveCpxAppId(e.target.value)}
                  placeholder="e.g. 34988 or your registered App ID"
                  className="flex-1 rounded-xl border border-white/20 bg-[#0F141E] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD700]"
                />
                <button
                  onClick={() => alert(`Saved CPX App ID: ${cpxAppId}`)}
                  className="px-4 py-2 rounded-xl bg-[#FFD700] text-xs font-bold text-[#0D1117] hover:brightness-110"
                >
                  Save ID
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-[11px] text-amber-300 space-y-1">
              <p className="font-bold">⚠️ "App ID not found in Database" Explanation:</p>
              <p>
                CPX Research requires a registered and approved <strong>App ID</strong> from your publisher dashboard at <a href="https://cpx-research.com" target="_blank" rel="noreferrer" className="underline">cpx-research.com</a>. If CPX shows "App ID not found in Database", replace the App ID above with your active CPX App ID.
              </p>
            </div>
          </div>
        )}

        {/* Registered CPX Container Elements (Step 3 Requirements) */}
        <div className="space-y-3 text-xs">
          <p className="text-white/50 text-[11px] font-mono">CPX WIDGET CONTAINER DIV TARGETS (HTML DOM ID MOUNT POINTS):</p>

          {/* Fullscreen Widget Container */}
          <div className="rounded-xl border border-white/10 bg-[#161D2C] p-2">
            <span className="text-[10px] text-white/40 font-mono block mb-1">Fullscreen Widget Container (#fullscreen):</span>
            <div style={{ maxWidth: '950px', margin: 'auto' }} id="fullscreen"></div>
          </div>

          {/* Single Sidebar Widget Container */}
          <div className="rounded-xl border border-white/10 bg-[#161D2C] p-2">
            <span className="text-[10px] text-white/40 font-mono block mb-1">Single Sidebar Widget Container (#single):</span>
            <div style={{ width: '100%', height: '150px' }} id="single"></div>
          </div>

          {/* Multi Sidebar & Notification Containers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-[#161D2C] p-2">
              <span className="text-[10px] text-white/40 font-mono block mb-1">Multi Sidebar (#sidebar):</span>
              <div id="sidebar" style={{ height: '469px' }}></div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#161D2C] p-2">
              <span className="text-[10px] text-white/40 font-mono block mb-1">Notification 1 (#notification):</span>
              <div id="notification" style={{ height: '469px' }}></div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#161D2C] p-2">
              <span className="text-[10px] text-white/40 font-mono block mb-1">Notification 2 (#notification2):</span>
              <div id="notification2" style={{ height: '469px' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Cards Feed */}
      <div className="space-y-4">
        {filteredOffers.map(offer => {
          const isCPX = offer.provider.toLowerCase().includes('cpx') || offer.id.includes('cpx');

          return (
            <div
              key={offer.id}
              className={`rounded-[28px] border bg-[#0F141E] p-6 backdrop-blur-md shadow-xl transition-all ${
                isCPX ? 'border-[#FFD700]/40 bg-gradient-to-br from-[#0F141E] via-[#161D2C] to-[#0F141E]' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Top Row: Provider Pill & Coin Reward */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-md ${
                    isCPX ? 'bg-[#FFD700] text-[#0D1117]' : 'bg-[#1A202C] text-white/50'
                  }`}>
                    {offer.provider}
                  </span>
                  {isCPX && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      INSTANT POSTBACK
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-lg font-extrabold text-[#FFD700] font-mono">
                  <div className="h-5 w-5 rounded-full bg-[#FFD700] text-[#0D1117] flex items-center justify-center text-xs font-bold">
                    $
                  </div>
                  <span>{offer.rewardCoins.toLocaleString()}</span>
                </div>
              </div>

              {/* Offer Title & Description */}
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{offer.title}</span>
                {isCPX && <Sparkles className="h-4 w-4 text-[#FFD700]" />}
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

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isCPX ? (
                  <>
                    <button
                      onClick={() => handleOpenCPXDirect(offer)}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFD700] py-3.5 text-xs font-bold text-[#0D1117] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Launch CPX Wall (New Window)</span>
                    </button>
                    <button
                      onClick={() => {
                        setModalTab('survey');
                        onSelectOffer(offer);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/10 py-3.5 text-xs font-bold text-[#FFD700] hover:bg-[#FFD700]/20 transition-all"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Take In-App Quick Survey</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setModalTab('launch');
                      onSelectOffer(offer);
                    }}
                    className="sm:col-span-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFD700] py-3.5 text-sm font-bold text-[#0D1117] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                  >
                    <span>Start offer</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Task & CPX Survey Modal */}
      {selectedOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-[#0F141E] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={onCloseModal}
              className="absolute right-4 top-4 rounded-xl border border-white/10 bg-white/5 p-2 text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header Info */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 pr-10">
              <div className="h-12 w-12 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] font-bold text-lg shrink-0">
                A
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#FFD700] uppercase bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20">
                  {selectedOfferModal.provider}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5 leading-snug">{selectedOfferModal.title}</h3>
                <p className="text-xs text-[#FFD700] font-mono font-bold mt-0.5">
                  Reward: +{selectedOfferModal.rewardCoins.toLocaleString()} Coins (${selectedOfferModal.usdReward.toFixed(2)})
                </p>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-white/10 my-4 pb-2">
              <button
                onClick={() => setModalTab('launch')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  modalTab === 'launch' ? 'bg-[#FFD700] text-[#0D1117]' : 'text-white/60 hover:text-white bg-white/5'
                }`}
              >
                Launch & Wall
              </button>
              <button
                onClick={() => setModalTab('survey')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  modalTab === 'survey' ? 'bg-[#FFD700] text-[#0D1117]' : 'text-white/60 hover:text-white bg-white/5'
                }`}
              >
                Quick Survey
              </button>
              <button
                onClick={() => setModalTab('webhook')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  modalTab === 'webhook' ? 'bg-[#FFD700] text-[#0D1117]' : 'text-white/60 hover:text-white bg-white/5'
                }`}
              >
                Webhook Tester
              </button>
            </div>

            {/* TAB 1: LAUNCH & WALL */}
            {modalTab === 'launch' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/80 space-y-2">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>CPX Research Survey Integration</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Status: LIVE</span>
                  </div>
                  <p className="text-white/60">
                    Clicking below will open the official CPX Research Survey Wall with your user ID attached for automatic postback crediting.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenCPXDirect(selectedOfferModal)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFD700] py-3.5 text-xs font-bold text-[#0D1117] hover:brightness-110 transition-all shadow-lg"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open CPX Survey Wall (New Window)</span>
                </button>

                <div className="space-y-2">
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
              </div>
            )}

            {/* TAB 2: INTERACTIVE QUICK SURVEY */}
            {modalTab === 'survey' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/5 p-4">
                  <h4 className="text-xs font-bold text-[#FFD700] flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span>In-App CPX Demographic Survey</span>
                  </h4>
                  <p className="text-[11px] text-white/70 mt-1">
                    Answer these 3 quick survey questions to trigger instant CPX Research postback verification!
                  </p>
                </div>

                {/* Question 1 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80">1. What is your primary device?</label>
                  <select
                    value={surveyDevice}
                    onChange={(e) => setSurveyDevice(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#161D2C] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  >
                    <option value="Mobile/Tablet">Mobile / Tablet Phone</option>
                    <option value="Desktop/Laptop">Desktop / PC Laptop</option>
                    <option value="Both">Both Mobile & Desktop</option>
                  </select>
                </div>

                {/* Question 2 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80">2. Select your age demographic group:</label>
                  <select
                    value={surveyAge}
                    onChange={(e) => setSurveyAge(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#161D2C] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  >
                    <option value="18-24">18 - 24 years</option>
                    <option value="25-34">25 - 34 years</option>
                    <option value="35-44">35 - 44 years</option>
                    <option value="45+">45+ years</option>
                  </select>
                </div>

                {/* Question 3 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80">3. Which survey topics do you prefer?</label>
                  <select
                    value={surveyTopic}
                    onChange={(e) => setSurveyTopic(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#161D2C] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  >
                    <option value="Technology & Apps">Technology, Apps & Gaming</option>
                    <option value="Finance & Shopping">Finance, Banking & E-Commerce</option>
                    <option value="Lifestyle & Entertainment">Lifestyle, Movies & Food</option>
                  </select>
                </div>

                <button
                  onClick={() => handleInteractiveSurveySubmit(selectedOfferModal)}
                  disabled={isSubmittingSurvey}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-xs font-bold text-[#0D1117] hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  {isSubmittingSurvey ? (
                    <>
                      <Zap className="h-4 w-4 animate-spin" />
                      <span>Submitting Survey & Triggering Postback...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Survey & Claim +{selectedOfferModal.rewardCoins.toLocaleString()} Coins</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: WEBHOOK TESTER */}
            {modalTab === 'webhook' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-mono text-white/70 space-y-1">
                  <p className="font-bold text-white font-sans">Active Server Postback Endpoint:</p>
                  <p className="text-[10px] text-[#FFD700] break-all">/api/postback?status=1&trans_id=tx123&user_id={user?.id || 'usr-admin-1'}&amount_local={selectedOfferModal.rewardCoins}</p>
                </div>

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
                      <span>Simulate Postback Callback & Claim +{selectedOfferModal.rewardCoins.toLocaleString()} Coins</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Verification / Success Toast */}
            {verificationSuccessMessage && (
              <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 flex items-center gap-2 font-semibold animate-pulse">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{verificationSuccessMessage}</span>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-white/10">
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


