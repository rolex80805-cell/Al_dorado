import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface MontagAdBannerProps {
  slot?: 'sidebar' | 'top' | 'modal' | 'inline';
}

export const MontagAdBanner: React.FC<MontagAdBannerProps> = ({ slot = 'inline' }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-gray-950 via-gray-900 to-yellow-950/30 p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-yellow-400 uppercase">Montag Ad Network</span>
              <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400 border border-gray-700">Display Partner</span>
            </div>
            <p className="text-sm font-medium text-gray-200">
              Sponsored Spotlight: Trade Crypto & Earn Bonuses on Verified Exchanges
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
            <Info className="h-3.5 w-3.5 text-yellow-500" />
            <span>Ad Policy Compliant</span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-gray-500 border-t border-gray-800/60 pt-2 flex items-center justify-between">
        <span>Display banner generates platform ad revenue. Coin rewards require verified offerwall task completions.</span>
        <span className="text-gray-600 hidden md:inline">Ad ID: MTG-8829-US</span>
      </div>
    </div>
  );
};
