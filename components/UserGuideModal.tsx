
import React, { useState } from 'react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'GUIDE' | 'FAQ'>('GUIDE');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-3xl border border-white/10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 flex flex-col">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Protocol Documentation</h2>
            <p className="text-[10px] text-blue-400 font-mono uppercase tracking-[0.2em]">Deployment Logic v4.2.0-STABLE</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 text-2xl">&times;</button>
        </div>

        <div className="flex bg-white/5 border-b border-white/5 shrink-0">
          <button 
            onClick={() => setActiveTab('GUIDE')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GUIDE' ? 'bg-blue-600 text-white shadow-inner' : 'text-slate-500 hover:bg-white/5'}`}
          >
            User Guide
          </button>
          <button 
            onClick={() => setActiveTab('FAQ')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'FAQ' ? 'bg-blue-600 text-white shadow-inner' : 'text-slate-500 hover:bg-white/5'}`}
          >
            Detailed FAQs
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-8 text-slate-300 leading-relaxed">
          {activeTab === 'GUIDE' ? (
            <>
              <section>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                  <span className="text-blue-500 font-mono">01.</span> The Tokenomics
                </h3>
                <p className="text-sm mb-4">The system launched with a fixed supply of <strong className="text-white">1,000,000,000 (1B) tokens</strong> valued at <strong className="text-white">$0.19 each</strong> at the start.</p>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <li className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="block text-[10px] font-black text-blue-400 uppercase mb-1">50% Reward Pool</span>
                    <span className="text-xs">Reserved (500M) for verified acts of peace.</span>
                  </li>
                  <li className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="block text-[10px] font-black text-emerald-400 uppercase mb-1">40% DAO Treasury</span>
                    <span className="text-xs">Community controlled stability fund.</span>
                  </li>
                  <li className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="block text-[10px] font-black text-amber-400 uppercase mb-1">10% Systems</span>
                    <span className="text-xs">Technical maintenance & guardians.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                  <span className="text-blue-500 font-mono">02.</span> The User’s Journey
                </h3>
                <div className="space-y-4">
                  {[
                    { l: "Level 0: Guest", d: "Wallet connection established. Read-only access to global ledger." },
                    { l: "Level 1: Verified Actor", d: "Discord linked. Permission to submit impact evidence at 1.0x rate." },
                    { l: "Level 2: Expert Mediator", d: "Biometric Liveness verified. DAO voting enabled at 2.5x rate." },
                    { l: "Level 3: Strategic Institution", d: "Deep AI Audit passed. High-volume grant management at 5.0x rate." }
                  ].map((tier, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-blue-400">
                        {i}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{tier.l}</h4>
                        <p className="text-xs text-slate-500">{tier.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                  <span className="text-blue-500 font-mono">03.</span> The Process Flow
                </h3>
                <div className="relative border-l-2 border-white/5 ml-4 pl-8 space-y-6">
                  {[
                    "Submission: User uploads summary, evidence hash, and full evidence repository links.",
                    "AI Oracle: Gemini 3 Pro performs a deep-dive logic audit and assigns a risk-adjusted Impact Score.",
                    "Community Consensus: Expert actors audit evidence and vote to meet the validation quota (5 Votes).",
                    "Minting: Once quota is met, PT rewards are minted from the 500M pool to the ledger.",
                    "Payout: Validated tokens are disbursed to the wallet; users may swap PT for USDC in the live pool."
                  ].map((step, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-[#0a0a0c]"></div>
                      <p className="text-xs">{step}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section>
                <h3 className="text-white font-bold text-lg mb-6 border-b border-white/10 pb-2">Institutional FAQs</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: How is the Treasury collateralized?</h4>
                    <p className="text-sm text-slate-400">The DAO Treasury (40% of supply) is paired with USDC in an Automated Market Maker (AMM). Initial liquidity is provided by Institutional commitments during the 'Level 3' onboarding process.</p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: What happens if an AI validation is disputed?</h4>
                    <p className="text-sm text-slate-400">If the Oracle rejects a claim, it can be appealed to the Level 2 Expert Pool. Experts must stake PT to initiate a manual audit. If the Oracle is proven wrong, the Oracle is re-trained and the Experts earn the slashed validation fees.</p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: What is "Slashing" and how does it work?</h4>
                    <p className="text-sm text-slate-400">Slashing is the removal of reputation or tokens from bad actors. If a Level 2 actor verifies a fraudulent claim, they lose their 1k PT stake. This creates a "Skin in the Game" mechanism for the validation layer.</p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: Can tokens be printed infinitely?</h4>
                    <p className="text-sm text-slate-400">No. The smart contract has a strict hard cap of 1,000,000,000 PEACE. Once the 50% Reward Pool is empty, the protocol transitions to a "Deflationary Phase" where rewards are sourced from protocol fees and burns.</p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: Is the protocol legally defensible?</h4>
                    <p className="text-sm text-slate-400">Yes. Every state change generates a 256-bit hash mapped to a persistent global ledger. This provides a clear, immutable audit trail for NGOs and government agencies to verify where every dollar was spent.</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em]">Protocol Consensus Verified | Security Posture: High</p>
          </div>
        </div>

        <div className="p-6 bg-white/5 shrink-0 border-t border-white/5">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all"
          >
            I Acknowledge Protocol Logic
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
