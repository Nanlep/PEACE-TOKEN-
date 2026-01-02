
import React from 'react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-2xl max-h-[80vh] rounded-3xl border border-white/10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 flex flex-col">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Protocol User Guide</h2>
            <p className="text-[10px] text-blue-400 font-mono uppercase tracking-[0.2em]">Deployment Logic v4.2.0</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 text-2xl">&times;</button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
              <span className="text-blue-500 font-mono">01.</span> The Tokenomics
            </h3>
            <p className="text-sm mb-4">The system launched with a fixed supply of <strong className="text-white">100,000,000 (100M) tokens</strong> valued at <strong className="text-white">$0.19 each</strong> at the start.</p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <li className="p-3 bg-white/5 rounded-lg border border-white/5">
                <span className="block text-[10px] font-black text-blue-400 uppercase mb-1">50% Reward Pool</span>
                <span className="text-xs">Reserved for verified acts of peace.</span>
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
                "Submission: User uploads summary and evidence hash of peace work.",
                "AI Oracle: Gemini 3 Pro performs a logic audit and assigns an Impact Score.",
                "Minting: Approved rewards are minted from the 50M pool to the ledger.",
                "Payout: Tokens are disbursed directly to the user's connected wallet.",
                "Swap: User exchanges PEACE for USDC digital dollars in the live pool."
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-[#0a0a0c]"></div>
                  <p className="text-xs">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
              <span className="text-blue-500 font-mono">04.</span> Roles & Privileges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">The DAO</h4>
                <p className="text-[11px] text-slate-400">Verified parliament voting on treasury disbursements and protocol logic upgrades (PIPs).</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">The Architect</h4>
                <p className="text-[11px] text-slate-400">Highest technical privilege. Manages the 'Panic Revert' circuit breaker to protect community funds.</p>
              </div>
            </div>
          </section>

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
