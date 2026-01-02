
import React from 'react';
import { PeaceProject } from '../types';
import { Icons } from '../constants';

interface PayoutLedgerProps {
  projects: PeaceProject[];
  onPayout: (id: string) => void;
}

const PayoutLedger: React.FC<PayoutLedgerProps> = ({ projects, onPayout }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Validation & Payout Ledger</h2>
        <div className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
          PARITY: 1 PT = 1.00 USDC
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-mono text-slate-500 uppercase">
              <th className="pb-3 font-normal">Project ID</th>
              <th className="pb-3 font-normal">Status</th>
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
              <tr key={p.id} className="text-xs">
                <td className="py-4">
                  <div className="font-bold text-white mb-0.5 truncate max-w-[120px]">{p.title}</div>
                  <div className="font-mono text-slate-500 scale-90 origin-left">{p.id.slice(0, 8)}...</div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[9px] border ${
                    p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {p.status}
                  </span>
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
