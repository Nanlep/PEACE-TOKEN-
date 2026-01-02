
import React, { useState } from 'react';
import { InstitutionalRequest } from '../types';
import { GUARDIAN_REGISTRY, Icons } from '../constants';

interface GuardianTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingRequests: InstitutionalRequest[];
  onSign: (requestId: string, guardianId: string) => void;
}

const GuardianTerminal: React.FC<GuardianTerminalProps> = ({ isOpen, onClose, pendingRequests, onSign }) => {
  const [activeGuardian, setActiveGuardian] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-4xl h-[80vh] rounded-3xl border border-amber-500/20 overflow-hidden relative animate-in fade-in zoom-in-95 duration-500 flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.1)]">
        
        {/* Terminal Header */}
        <div className="p-6 border-b border-amber-500/10 bg-amber-500/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-2 rounded text-black">
              <Icons.Guardian />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-500 uppercase tracking-widest">Guardian Control Interface</h2>
              <p className="text-[10px] text-amber-500/60 font-mono uppercase tracking-[0.3em]">Authorized Personnel Only | 4-of-7 Quorum Root</p>
            </div>
          </div>
          <button onClick={onClose} className="text-amber-500/40 hover:text-amber-500 transition-colors text-3xl font-light">&times;</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Guardian Selection Sidebar */}
          <div className="w-64 border-r border-amber-500/10 bg-black/40 overflow-y-auto p-4 space-y-2">
            <p className="text-[9px] font-black text-amber-500/40 uppercase tracking-widest mb-4">Registry Identifiers</p>
            {GUARDIAN_REGISTRY.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGuardian(g.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  activeGuardian === g.id 
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:border-amber-500/20'
                }`}
              >
                <div className="text-[10px] font-black uppercase tracking-tighter">{g.id}</div>
                <div className="text-[8px] font-mono opacity-50 truncate">{g.entity}</div>
              </button>
            ))}
          </div>

          {/* Audit Queue */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-black/20">
            {!activeGuardian ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 border-2 border-amber-500/10 rounded-full flex items-center justify-center">
                   <div className="status-pulse bg-amber-500 scale-150"></div>
                </div>
                <p className="text-xs text-amber-500/40 font-mono uppercase tracking-widest">Select Guardian Identity to Proceed with At-Rest Data Audit</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Pending Institutional Attestations</h3>
                  <span className="text-[10px] text-amber-500 font-mono bg-amber-500/5 px-2 py-1 rounded border border-amber-500/20">
                    ACTIVE SESS: {activeGuardian}
                  </span>
                </div>

                {pendingRequests.length === 0 ? (
                  <div className="p-12 border border-white/5 rounded-2xl bg-white/5 text-center">
                    <p className="text-xs text-slate-500 italic">No Level-3 transitions awaiting attestation in this block.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {pendingRequests.map((req) => (
                      <div key={req.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-[9px] text-amber-500 font-black uppercase mb-1">REQ_ID: {req.id}</p>
                            <h4 className="text-lg font-bold text-white">{req.entityName}</h4>
                            <p className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{req.credentialsHash}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] text-slate-500 uppercase font-black mb-1">QUORUM STATUS</p>
                             <div className="flex gap-1 justify-end">
                                {[1,2,3,4,5,6,7].map((i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full ${i <= req.signatures.length ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,1)]' : 'bg-slate-800'}`}></div>
                                ))}
                             </div>
                             <p className="text-[10px] text-amber-500 font-mono mt-1 font-bold">{req.signatures.length}/4</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button 
                            disabled={req.signatures.includes(activeGuardian!)}
                            onClick={() => onSign(req.id, activeGuardian!)}
                            className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-900/20"
                          >
                            {req.signatures.includes(activeGuardian!) ? 'SIGNATURE ATTACHED' : 'BROADCAST SIGNATURE'}
                          </button>
                          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl border border-white/10 transition-all">
                            View Audit History
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Audit Log */}
        <div className="p-4 bg-amber-500/5 border-t border-amber-500/10 flex items-center justify-between text-[8px] font-mono text-amber-500/60 uppercase">
          <div className="flex gap-6">
            <span>TLS-HANDSHAKE: OK</span>
            <span>ENCLAVE-ID: E-7129A</span>
            <span>LAST-BLOCK: #881,291</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            <span>Global Consensus Engine Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianTerminal;
