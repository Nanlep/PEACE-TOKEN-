
import React, { useState, useEffect } from 'react';

interface FundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFund: (amountUSDC: number) => void;
}

const FundingModal: React.FC<FundingModalProps> = ({ isOpen, onClose, onFund }) => {
  const [method, setMethod] = useState<'FIAT' | 'CRYPTO'>('FIAT');
  const [asset, setAsset] = useState('USD');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState('IDLE');

  if (!isOpen) return null;

  const handleFund = () => {
    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount <= 0) return;

    setIsProcessing(true);
    setBridgeStatus('LINKING_BANK_GATEWAY');
    
    setTimeout(() => setBridgeStatus('VERIFYING_LIQUIDITY'), 800);
    setTimeout(() => setBridgeStatus('SETTLING_ON_CHAIN'), 1600);
    
    setTimeout(() => {
      onFund(numericAmount);
      setIsProcessing(false);
      setAmount('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Capital Injection Bridge</h2>
            <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">Global Payout-Ready Liquidity</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 text-2xl">&times;</button>
        </div>

        <div className="flex bg-white/5 border-b border-white/5">
          <button 
            onClick={() => { setMethod('FIAT'); setAsset('USD'); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${method === 'FIAT' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            Fiat On-Ramp
          </button>
          <button 
            onClick={() => { setMethod('CRYPTO'); setAsset('USDT'); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${method === 'CRYPTO' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            Stablecoin Bridge
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex justify-between mb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Source Amount</span>
              <span className="text-[9px] font-mono text-blue-400">Rate: 1.00 {asset} = 1.00 USDC</span>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-2xl font-bold text-white focus:outline-none w-full mono"
              />
              <select 
                value={asset} 
                onChange={(e) => setAsset(e.target.value)}
                className="bg-white/10 text-white px-2 py-1 rounded text-xs font-bold border border-white/10 focus:outline-none"
              >
                {method === 'FIAT' ? (
                  <>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </>
                ) : (
                  <>
                    <option value="USDT">USDT</option>
                    <option value="DAI">DAI</option>
                    <option value="USDC-Eth">USDC (ERC20)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
               <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Zero-Trust Settlement</h4>
                  <p className="text-[9px] text-slate-500">Funds are bridged directly to your session wallet address.</p>
               </div>
            </div>
          </div>

          <button 
            disabled={isProcessing || !amount}
            onClick={handleFund}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-emerald-900/40 flex flex-col items-center justify-center gap-1"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span className="mt-1">{bridgeStatus.replace(/_/g, ' ')}</span>
              </>
            ) : (
              `INITIATE ${asset} BRIDGE`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundingModal;
