import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Bot, Send, MessageSquare } from 'lucide-react';

export const SupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hello! I am the Aldorado AI Support Assistant. Ask me anything about offerwall tracking, withdrawal times, or daily bonuses!' }
  ]);
  const [userQuery, setUserQuery] = useState('');

  const faqs = [
    {
      q: 'How long does it take for coins to credit after completing an offer?',
      a: 'Most offers credit instantly via automated server webhooks. Surveys or high-payout tasks may undergo a brief 10 to 15 minute verification hold by the offerwall provider.'
    },
    {
      q: 'What is the minimum withdrawal amount?',
      a: 'The minimum withdrawal starts at 5,000 Coins ($5.00 USD) for USDT crypto and Amazon Gift Cards, and 10,000 Coins ($10.00 USD) for PayPal.'
    },
    {
      q: 'How does Montag Ad integration work?',
      a: 'Montag provides non-reward display banners that generate ad revenue for platform sustainability. In strict compliance with advertising policies, users earn coins exclusively from verified offerwall task completions.'
    },
    {
      q: 'Can I use a VPN or proxy while completing offers?',
      a: 'No. Using VPNs, proxies, or automated scripts is strictly prohibited and will result in automatic risk flags and rejection of withdrawals.'
    }
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuery('');

    // Instant AI response
    setTimeout(() => {
      let aiText = 'Our automated server verification system processes callback webhooks 24/7. Your account balance updates instantly upon provider confirmation.';
      if (query.toLowerCase().includes('withdraw') || query.toLowerCase().includes('payout')) {
        aiText = 'Withdrawals are processed automatically or reviewed by admin within 1 to 12 hours depending on method selection (USDT, PayPal, Amazon, Wire).';
      } else if (query.toLowerCase().includes('montag') || query.toLowerCase().includes('ad')) {
        aiText = 'Montag display ads support platform operations. Rewards are earned from verified offerwall tasks to remain 100% compliant with ad policies.';
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/90 p-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-yellow-400" />
          <div>
            <h2 className="text-2xl font-black text-white">Support & AI Assistant</h2>
            <p className="text-xs text-gray-400 mt-0.5">Find quick answers or chat directly with our AI Help Assistant.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FAQ Accordion */}
        <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
          
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-white hover:bg-gray-900 transition-colors text-left"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="h-4 w-4 text-yellow-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>

              {openFaq === idx && (
                <div className="p-4 border-t border-gray-800/80 text-xs text-gray-400 leading-relaxed bg-gray-900/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Support Chat */}
        <div className="rounded-3xl border border-yellow-500/30 bg-gray-900/90 p-6 flex flex-col justify-between h-[450px]">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <Bot className="h-5 w-5 text-yellow-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Support Bot</h3>
            </div>

            <div className="mt-4 space-y-3 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-yellow-500 text-gray-950 font-medium'
                      : 'bg-gray-950 text-gray-200 border border-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendChat} className="mt-4 flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask AI Support a question..."
              className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
            />
            <button
              type="submit"
              className="rounded-xl bg-yellow-500 px-4 py-2.5 text-xs font-bold text-gray-950 hover:bg-yellow-400"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
