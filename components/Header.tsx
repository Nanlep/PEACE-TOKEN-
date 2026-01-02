
import React from 'react';
import { Icons } from '../constants';

interface HeaderProps {
  balancePT: number;
  balanceUSDC: number;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onOpenExchange: () => void;
  onOpenBridge: () => void;
  isEligible: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  balancePT, 
  balanceUSDC, 
  walletAddress, 
  onConnect, 
  onDisconnect,
  onOpenExchange, 
  onOpenBridge,
  isEligible 
}) => {
  return (
    <header className="border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <Icons.Shield />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Peace-Token <span className="text-blue-500 font-mono text-sm font-normal">v4.2</span></h1>
            <p className="text-[10px] text-slate-500 mono uppercase tracking-widest">Global Asset Ledger</p>
          </div>
        </div>

        {walletAddress && (
          <div className="hidden md:flex items-center gap-4">
            {/* USDC BALANCE (Where your $300 appears) */}
            <div className="flex flex-col items-end px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-0.5">Available USDC</span>
               <span className="text-sm font-bold text-white mono">${balanceUSDC.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            {/* PT BALANCE (Where your bought tokens appear) */}
            <div className="flex flex-col items-end px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-xl">
               <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mb-0.5">Staked PT</span>
               <span className="text-sm font-bold text-white mono">{balancePT.toLocaleString()} <span className="text-[10px] text-blue-400">PEACE</span></span>
            </div>

            <div className="h-8 w-px bg-white/10 mx-2"></div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenBridge}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
              >
                Fund Bridge
              </button>
              {isEligible ? (
                <button 
                  onClick={onOpenExchange}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
                >
                  Exchange Assets
                </button>
              ) : (
                <div className="group relative">
                  <button className="px-4 py-2 bg-slate-800 text-slate-500 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                    Exchange Locked
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-black border border-white/10 rounded-lg text-[9px] text-slate-400 leading-tight opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
                    Verification Required: Link Discord to unlock the Asset Exchange.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          {walletAddress ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                 <span className="text-[8px] text-slate-500 uppercase font-black mb-0.5 tracking-widest">Session ID</span>
                 <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-slate-800/50 text-blue-400 rounded-md text-[10px] font-mono border border-blue-500/20">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </div>
                    <button 
                      onClick={onDisconnect}
                      className="text-[9px] font-black uppercase text-rose-500 hover:text-rose-400 tracking-widest transition-colors px-2 py-1"
                    >
                      Exit
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={onConnect}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/40"
            >
              Initialize Node
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
