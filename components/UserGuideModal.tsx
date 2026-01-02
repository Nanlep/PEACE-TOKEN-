
import React, { useState } from 'react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'GUIDE' | 'FAQ'>('GUIDE');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
            Protocol Guide
          </button>
          <button 
            onClick={() => setActiveTab('FAQ')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'FAQ' ? 'bg-blue-600 text-white shadow-inner' : 'text-slate-500 hover:bg-white/5'}`}
          >
            Governance & FAQ
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-8 text-slate-300 leading-relaxed">
          {activeTab === 'GUIDE' ? (
            <>
              <section>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                  <span className="text-blue-500 font-mono">01.</span> Tokenomics Ecosystem
                </h3>
                <p className="text-sm mb-4">The protocol operates with a hard-capped supply of <strong className="text-white">1,000,000,000 (1B) PEACE</strong>. This supply is mathematically enforced to prevent inflation beyond verified impact.</p>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <li className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="block text-[10px] font-black text-blue-400 uppercase mb-1">50% Reward Pool</span>
                    <span className="text-xs">Incentives for verified peace-building acts.</span>
                  </li>
                  <li className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="block text-[10px] font-black text-emerald-400 uppercase mb-1">40% DAO Treasury</span>
                    <span className="text-xs">Strategic reserves and community grants.</span>
                  </li>
                  <li className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="block text-[10px] font-black text-amber-400 uppercase mb-1">10% Infrastructure</span>
                    <span className="text-xs">Protocol maintenance and Guardian nodes.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                  <span className="text-blue-500 font-mono">02.</span> Identity Tiers (SBT)
                </h3>
                <div className="space-y-4">
                  {[
                    { l: "Level 0: Observer", d: "Basic node access. View-only rights to the global impact ledger." },
                    { l: "Level 1: Verified Actor", d: "Discord + Wallet link required. Can publish evidence and receive 1.0x rewards." },
                    { l: "Level 2: Expert Mediator", d: "Biometric Liveness + 1,000 PT Stake. Unlocks DAO voting and 2.5x rewards." },
                    { l: "Level 3: Strategic Institution", d: "Guardian Quorum Audit. High-authority status with 5.0x rewards and grant creation." }
                  ].map((tier, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-blue-400">
                        L{i}
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
                  <span className="text-blue-500 font-mono">03.</span> Impact Lifecycle
                </h3>
                <div className="relative border-l-2 border-white/5 ml-4 pl-8 space-y-6">
                  {[
                    "Evidence Publishing: Level 1+ users upload impact summaries and cryptographic evidence hashes.",
                    "AI Reasoning Audit: The Gemini 3 Pro Oracle performs a skepticism-first logical analysis of the claim.",
                    "Community Validation: Level 2 & 3 actors audit the raw data and vote to reach the validation quorum.",
                    "Disbursement: Validated projects trigger a mint event from the Reward Pool to the claimant's wallet.",
                    "Liquidation: Users may exit to USDC via the protocol's native AMM exchange."
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
                <h3 className="text-white font-bold text-lg mb-6 border-b border-white/10 pb-2 uppercase tracking-tighter">DAO Governance Framework</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: How does DAO Governance work?</h4>
                    <p className="text-sm text-slate-400">Governance is conducted via **Peace Improvement Proposals (PIPs)**. These are on-chain manifests that dictate treasury spend, protocol rules, or technical upgrades. We use **Quadratic Voting**, which ensures that the intensity of belief is balanced against token weight, preventing whales from dominating the protocol.</p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: Who is eligible for voting?</h4>
                    <p className="text-sm text-slate-400">Eligibility is strictly gated by reputation and stake:
                      <br/>- **Level 2 (Expert):** Eligible after Biometric Liveness check and 1,000 PT stake.
                      <br/>- **Level 3 (Institution):** Eligible after a successful 4-of-7 Guardian Quorum audit.
                      <br/><span className="text-rose-400 font-bold uppercase text-[10px]">Note:</span> Unverified and Level 1 users cannot cast votes but can participate in off-chain signaling.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: How does the payout mechanism work?</h4>
                    <p className="text-sm text-slate-400">Payouts follow a mission-critical 5-phase lifecycle:
                      <br/>1. **Oracle Audit:** Gemini 3 Pro assigns an impact score and base reward.
                      <br/>2. **Expert Consensus:** Level 2/3 actors must reach a 5-vote quorum to validate the evidence.
                      <br/>3. **Disbursement:** The user claims their PT, applying their Tier Multipliers (up to 5x).
                      <br/>4. **Liquidation:** PT is swapped for USDC via the Protocol-Native AMM.
                      <br/>5. **Exit Bridge:** USDC is withdrawn to external accounts via the Capital Bridge.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: How is a DAO project (PIP) created and by whom?</h4>
                    <p className="text-sm text-slate-400">Proposals are initiated by Level 2 and Level 3 actors. Creating a proposal requires a **500 PT Stake** which is locked for the duration of the vote. If a proposal is deemed malicious or spam by a majority of the DAO, this stake may be **slashed** (burned) to protect protocol signal quality.</p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: What is the "Slashing" mechanism?</h4>
                    <p className="text-sm text-slate-400">Slashing is the protocol's defense against fraud. If a Level 2 actor validates impact evidence that is later proven to be fraudulent through a dispute process, their 1,000 PT stake is instantly seized and distributed to honest auditors.</p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: How do I acquire the tokens needed for Level 2?</h4>
                    <p className="text-sm text-slate-400">
                      1. **Mission Mining:** Perform Level 1 peace acts and earn PT through verified impact.
                      <br/>2. **Liquidity Pool:** Inject USDC via the Capital Bridge and buy PT on the Asset Exchange.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-blue-400 text-[11px] font-black uppercase tracking-widest mb-2">Q: What is the role of the System Guardians?</h4>
                    <p className="text-sm text-slate-400">Guardians are 7 high-authority nodes (NGOs, Legal Entities, Tech Architects) that manage the protocol's "Circuit Breaker". They do not vote on standard projects but are responsible for final Institutional (Level 3) approvals and emergency protocol pauses.</p>
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
            I Acknowledge Protocol Governance Rules
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
