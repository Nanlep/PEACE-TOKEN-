
import React from 'react';
import { PeaceProject, IdentityTier } from '../types';
import { Icons } from '../constants';

interface PayoutLedgerProps {
  projects: PeaceProject[];
  onPayout: (id: string) => void;
  onVote: (id: string, side: 'FOR' | 'AGAINST') => void;
  userTier: IdentityTier;
}

const PayoutLedger: React.FC<PayoutLedgerProps> = ({ projects, onPayout, onVote, userTier }) => {
  const canVote = userTier === IdentityTier.EXPERT || userTier === IdentityTier.INSTITUTION;
  const VOTE_QUOTA = 5;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Validation & Payout Ledger</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Multi-Layer Consensus Enforcement</p>
        </div>
        <div className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
          PARITY: 1 PT = 1.00 USDC
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-mono text-slate-500 uppercase">
              <th className="pb-3 font-normal">Project & Evidence</th>
              <th className="pb-3 font-normal">Status / Quota</th>
              <th className="pb-3 font-normal">Impact</th>
              <th className="pb-3 font-normal text-right">Allocation</th>
              <th className="pb-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-slate-500 italic">No validated projects pending in ledger.</td>
              </tr>
            ) : projects.map((p) => (
              <tr key={p.id} className="text-xs group">
                <td className="py-4 pr-4">
                  <div className="font-bold text-white mb-0.5 truncate max-w-[150px]">{p.title}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.evidenceUrls.map((url, i) => (
                      <span key={i} className="text-[8px] bg-white/5 text-slate-500 border border-white/10 px-1 py-0.5 rounded flex items-center gap-1 hover:text-blue-400 transition-colors cursor-help">
                        DOC_{i+1}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex flex-col gap-1.5">
                    <span className={`w-fit px-2 py-0.5 rounded-full font-mono font-bold text-[9px] border ${
                      p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      p.status === 'VOTING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      p.status === 'VALIDATED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {p.status}
                    </span>
                    {p.status === 'VOTING' && (
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(p.votesFor / VOTE_QUOTA) * 100}%` }}></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4">
                   <div className="flex items-center gap-1">
                      <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${p.impactScore}%` }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{p.impactScore}</span>
                   </div>
                </td>
                <td className="py-4 text-right">
                  <div className="text-white font-bold">{p.tokensRewarded} PT</div>
                  <div className="text-slate-500 font-mono scale-90 origin-right">${p.usdcValue.toLocaleString()} USDC</div>
                </td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {p.status === 'VOTING' && (
                      <>
                        <button 
                          disabled={!canVote}
                          onClick={() => onVote(p.id, 'FOR')}
                          className="px-2 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded font-bold text-[9px] uppercase transition-all disabled:opacity-30"
                        >
                          Verify
                        </button>
                        <button 
                          disabled={!canVote}
                          onClick={() => onVote(p.id, 'AGAINST')}
                          className="px-2 py-1 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 rounded font-bold text-[9px] uppercase transition-all disabled:opacity-30"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {p.status === 'VALIDATED' && (
                      <button 
                        onClick={() => onPayout(p.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded font-bold text-[10px] uppercase transition-all shadow-md shadow-blue-900/20"
                      >
                        Disburse
                      </button>
                    )}
                    {p.status === 'PAID' && (
                      <span className="text-emerald-400 flex items-center justify-end gap-1">
                        <Icons.Pulse />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutLedger;
