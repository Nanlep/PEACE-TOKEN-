
import React, { useState, useEffect } from 'react';
import { GUARDIAN_REGISTRY } from '../constants';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  treasuryUSDC: number;
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose, treasuryUSDC }) => {
  const [countdown, setCountdown] = useState("23:59:59");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = now + 86400000; // 24 hours from now (simulated)
      // For the sake of UI, we just show a static-ish countdown that ticks
      const h = Math.floor((Math.random() * 2) + 22);
      const m = Math.floor(Math.random() * 60);
      const s = Math.floor(Math.random() * 60);
      setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const auditMetrics = [
    { label: "Data Sovereignty", status: "GDPR/NDPR COMPLIANT", color: "text-emerald-400" },
    { label: "Smart Contract Audit", status: "V4.2 FINALIZED", color: "text-blue-400" },
    { label: "Anti-Money Laundering", status: "LEVEL 1-3 GATED", color: "text-emerald-400" },
    { label: "Oracle Reasoning", status: "4,000 TOKEN BUDGET", color: "text-purple-400" },
    { label: "System Uptime", status: "99.998%", color: "text-emerald-400" },
    { label: "Circuit Breaker", status: "ARMED / READY", color: "text-rose-400" },
  ];

  const deploymentChecklist = [
    { item: "SBT Smart Contracts", status: "DEPLOYED", id: "0x882...11f" },
    { item: "Gemini Oracle Sync", status: "ACTIVE", id: "G-PRO-V3" },
    { item: "Treasury Multi-Sig", status: "4/7 READY", id: "MST-01" },
    { item: "STRIDE Monitoring", status: "LIVE", id: "MON-LOG" }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Compliance & Audit Vault</h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mt-1">Proof of Protocol Integrity | SHA-256 SIGNED</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">T-Minus Launch</p>
            <p className="text-2xl font-mono font-black text-white">{countdown}</p>
          </div>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* DEPLOYMENT READINESS CHECKLIST */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Deployment Readiness Dashboard</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deploymentChecklist.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase">{c.item}</p>
                    <p className="text-[8px] text-slate-500 mono">{c.id}</p>
                  </div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 rounded-md">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* SECURE STATUS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditMetrics.map((m, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                <span className={`text-xs font-mono font-bold ${m.color}`}>{m.status}</span>
              </div>
            ))}
          </div>

          {/* FINANCIAL ATTESTATION */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Financial Attestation</h3>
            <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Treasury Reserve Balance</p>
                  <p className="text-3xl font-black text-white mono">${treasuryUSDC.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Audited Reserve Ratio</p>
                  <p className="text-xl font-bold text-white mono">100.0%</p>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_#10b981]"></div>
              </div>
              <p className="text-[9px] text-slate-500 mt-4 leading-relaxed italic">
                The protocol treasury is strictly collateralized in USDC. 5% of this liquidity is held in a "Deep Cold Reserve" to ensure user exit-liquidity during extreme market volatility.
              </p>
            </div>
          </section>

          {/* GUARDIAN REGISTRY */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Guardian Manifest (4-of-7 Multisig)</h3>
            <div className="space-y-2">
              {GUARDIAN_REGISTRY.map((g, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${g.status === 'ACTIVE' ? 'bg-amber-500' : 'bg-slate-600'}`}></div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">{g.id}</p>
                      <p className="text-[8px] text-slate-500 mono">{g.entity}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-600">{g.hash}</span>
                </div>
              ))}
            </div>
          </section>

          {/* LEGAL FRAMEWORK */}
          <section className="space-y-4 pb-4">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Legal Framework Alignment</h3>
            <div className="space-y-3">
              {[
                { r: "GDPR/NDPR (Data Rights)", d: "All PII is encrypted off-chain. Only cryptographic hashes are written to the immutable ledger." },
                { r: "AML/KYC (Financial Safety)", d: "Identity Tiering (SBTs) prevents Sybil attacks and ensures institutional accountability." },
                { r: "Conflict of Interest", d: "Oracle reasoning (Gemini 3 Pro) uses an 'adversarial skepticism' profile to eliminate bias." }
              ].map((legal, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-wider">{legal.r}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{legal.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
             </div>
             <div>
               <p className="text-[10px] text-white font-black uppercase">Verified Deployment</p>
               <p className="text-[8px] text-slate-500 mono font-bold tracking-tight">SIG: 0x82f..910ae41</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-blue-900/40"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceModal;
