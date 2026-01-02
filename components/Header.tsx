
import React from 'react';
import { Icons } from '../constants';

interface HeaderProps {
  balancePT: number;
  balanceUSDC: number;
  walletAddress: string | null;
  onConnect: () => void;
  onOpenExchange: () => void;
  onOpenBridge: () => void;
  isEligible: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  balancePT, 
  balanceUSDC, 
  walletAddress, 
  onConnect, 
  onOpenExchange, 
  onOpenBridge,
  isEligible 
}) => {
  return (
    <header className="border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <Icons.Shield />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">PEACE-TOKEN <span className="text-blue-500 font-mono text-sm font-normal">v4.2.0</span></h1>
            <p className="text-[10px] text-slate-500 mono uppercase tracking-widest">Global Asset Ledger</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="status-pulse"></div>
            <span className="text-xs font-medium text-emerald-400 font-mono uppercase tracking-tighter">Live Node Sync</span>
          </div>
          {walletAddress && (
            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenBridge}
                className="px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-md text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Fund Bridge
              </button>
              {isEligible && (
                <button 
                  onClick={onOpenExchange}
                  className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-md text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  Exchange Assets
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {walletAddress ? (
            <div className="flex flex-col items-end">
               <span className="text-[8px] text-slate-500 uppercase font-black mb-0.5 tracking-widest">Active Session</span>
               <button className="px-3 py-1.5 bg-slate-800/50 text-blue-400 rounded-md text-[10px] font-mono border border-blue-500/20">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </button>
            </div>
          ) : (
            <button 
              onClick={onConnect}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/40 active:scale-95"
            >
              Connect Node
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
