
import React, { useState } from 'react';

interface FundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFund: (amountUSDC: number) => void;
}

type Step = 'SELECTION' | 'PAYMENT_DETAILS' | 'PROCESSING';

const FundingModal: React.FC<FundingModalProps> = ({ isOpen, onClose, onFund }) => {
  const [step, setStep] = useState<Step>('SELECTION');
  const [method, setMethod] = useState<'FIAT' | 'CRYPTO'>('FIAT');
  const [asset, setAsset] = useState('USD');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState('IDLE');

  // Simulated Payment Form State
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [cryptoAddress, setCryptoAddress] = useState('0x' + 'f'.repeat(40));

  if (!isOpen) return null;

  const handleProceedToPayment = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStep('PAYMENT_DETAILS');
  };

  const handleFinalizeFunding = () => {
    const numericAmount = parseFloat(amount) || 0;
    
    setStep('PROCESSING');
    setIsProcessing(true);
    setBridgeStatus('ENCRYPTING_PAYMENT_DATA');
    
    // Mission-critical simulation sequence
    setTimeout(() => setBridgeStatus('VERIFYING_GATEWAY_AUTH'), 800);
    setTimeout(() => setBridgeStatus('SETTLING_LIQUIDITY_RESERVE'), 1600);
    setTimeout(() => setBridgeStatus('FINALIZING_ON_CHAIN_MINT'), 2400);
    
    setTimeout(() => {
      onFund(numericAmount);
      setIsProcessing(false);
      setAmount('');
      setStep('SELECTION');
      onClose();
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">
              {step === 'PROCESSING' ? 'Secure Settlement' : 'Capital Bridge'}
            </h2>
            <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">
              {step === 'PROCESSING' ? 'Node Protocol In Progress' : 'Global Payout-Ready Liquidity'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 text-2xl">&times;</button>
        </div>

        {/* Content based on Step */}
        <div className="p-8">
          {step === 'SELECTION' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-6">
                <button 
                  onClick={() => { setMethod('FIAT'); setAsset('USD'); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${method === 'FIAT' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Fiat On-Ramp
                </button>
                <button 
                  onClick={() => { setMethod('CRYPTO'); setAsset('USDT'); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${method === 'CRYPTO' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Stable Bridge
                </button>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex justify-between mb-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Injection Amount</span>
                  <span className="text-[9px] font-mono text-blue-400">1.00 {asset} = 1.00 USDC</span>
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
                        <option value="ETH">ETH (Native)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Network Fee</span>
                  <span className="text-white">0.00 {asset}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Settlement Time</span>
                  <span className="text-white">~3.2 Seconds</span>
                </div>
              </div>

              <button 
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={handleProceedToPayment}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-blue-900/40"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'PAYMENT_DETAILS' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setStep('SELECTION')} className="text-[10px] text-blue-400 font-bold uppercase tracking-widest hover:text-blue-300 flex items-center gap-1">
                  ← Back
                </button>
                <div className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span className="text-[9px] font-black text-emerald-400 uppercase">256-bit Encrypted</span>
                </div>
              </div>

              {method === 'FIAT' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="**** **** **** ****"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none mono text-sm"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none mono text-sm"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">CVV</label>
                      <input 
                        type="text" 
                        placeholder="***"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none mono text-sm"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                      <p className="text-[10px] text-emerald-400 font-bold mb-3 uppercase text-center">Bridge Source Address Detected</p>
                      <div className="bg-black/40 p-3 rounded-lg border border-white/5 break-all text-[10px] font-mono text-slate-400 text-center">
                        {cryptoAddress}
                      </div>
                   </div>
                   <p className="text-[9px] text-slate-500 text-center uppercase tracking-wider">Please authorize the deposit via your hardware or session wallet.</p>
                </div>
              )}

              <button 
                onClick={handleFinalizeFunding}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-emerald-900/40"
              >
                Execute {amount} {asset} Bridge
              </button>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  </div>
               </div>
               <div className="text-center">
                  <p className="text-xs font-black text-white uppercase tracking-[0.2em] mb-2">{bridgeStatus.replace(/_/g, ' ')}</p>
                  <p className="text-[9px] text-slate-500 mono tracking-widest">TLS 1.3 / AES-256 SECURED CONNECTION</p>
               </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-center gap-4">
           <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
             <span className="text-[8px] font-black text-slate-500 uppercase">PCI-DSS Level 1</span>
           </div>
           <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
             <span className="text-[8px] font-black text-slate-500 uppercase">ISO 27001</span>
           </div>
           <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
             <span className="text-[8px] font-black text-slate-500 uppercase">SOC 2 Type II</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FundingModal;
