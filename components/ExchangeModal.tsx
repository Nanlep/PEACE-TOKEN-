
import React, { useState } from 'react';
import { ProtocolService } from '../services/protocolService';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  balancePT: number;
  balanceUSDC: number;
  ptPrice: number;
  onExchange: (amountPT: number, side: 'BUY' | 'SELL') => void;
  onOpenBridge: () => void;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({ 
  isOpen, 
  onClose, 
  balancePT, 
  balanceUSDC,
  ptPrice, 
  onExchange,
  onOpenBridge
}) => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('SELL');
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;
  
  let resultValue = 0;
  let canExchange = false;
  let feeDisplay = "";
  let impactDisplay = "";

  if (side === 'SELL') {
    const calc = ProtocolService.calculateSwap(numericAmount, ptPrice);
    resultValue = calc.usdcValue;
    canExchange = numericAmount > 0 && numericAmount <= balancePT;
    feeDisplay = `${calc.fee.toFixed(4)} PT`;
    impactDisplay = `Slippage: ${calc.slippagePercentage}%`;
  } else {
    const calc = ProtocolService.calculateBuy(numericAmount, ptPrice);
    resultValue = calc.finalPT;
    canExchange = numericAmount > 0 && numericAmount <= balanceUSDC;
    feeDisplay = `$${calc.feeUSDC.toFixed(4)} USDC`;
    impactDisplay = `Impact: ${calc.priceImpact}%`;
  }

  const handleSwap = () => {
    if (!canExchange) return;
    setIsProcessing(true);
    setTimeout(() => {
      onExchange(side === 'SELL' ? numericAmount : resultValue, side);
      setIsProcessing(false);
      setAmount("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">Market Liquidity Pool</h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Protocol-Native AMM v2</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 text-2xl">&times;</button>
        </div>

        <div className="flex bg-white/5 border-b border-white/5">
          <button 
            onClick={() => setSide('SELL')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${side === 'SELL' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            Sell PT
          </button>
          <button 
            onClick={() => setSide('BUY')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${side === 'BUY' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            Buy PT
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>Market Rate</span>
            <span className="text-emerald-400 font-mono">1 PT = ${ptPrice.toFixed(4)} USDC</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex justify-between mb-2">
                <span className="text-[9px] font-black text-slate-500 uppercase">{side === 'SELL' ? 'From (PT)' : 'From (USDC)'}</span>
                <span 
                  className="text-[9px] font-black text-blue-400 uppercase cursor-pointer" 
                  onClick={() => setAmount(side === 'SELL' ? balancePT.toString() : balanceUSDC.toString())}
                >
                  Balance: {side === 'SELL' ? balancePT.toFixed(2) : balanceUSDC.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-2xl font-bold text-white focus:outline-none w-full mono"
                />
                <div className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-bold border border-white/10">
                  {side === 'SELL' ? 'PT' : 'USDC'}
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-6 relative z-10">
              <div className="bg-[#0a0a0c] p-2 rounded-full border border-white/10 text-slate-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10l5 5 5-5"/></svg>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex justify-between mb-2">
                <span className="text-[9px] font-black text-slate-500 uppercase">{side === 'SELL' ? 'To Estimated (USDC)' : 'To Estimated (PT)'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`${side === 'SELL' ? 'text-emerald-400' : 'text-blue-400'} text-2xl font-bold w-full mono`}>
                  {resultValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </div>
                <div className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-bold border border-white/10">
                   {side === 'SELL' ? 'USDC' : 'PT'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 space-y-2">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Protocol LP Fee</span>
              <span className="text-white font-mono">{feeDisplay}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Market Impact</span>
              <span className="text-white font-mono">{impactDisplay}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              disabled={!canExchange || isProcessing}
              onClick={handleSwap}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Slippage Protection Active...
                </>
              ) : (
                `Confirm ${side} Order`
              )}
            </button>
            
            <button 
              onClick={onOpenBridge}
              className="w-full py-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
            >
              Need more USDC? Open Global Bridge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeModal;
