
import React, { useState } from 'react';
import { DAOProposal, IdentityTier } from '../types';
import { Icons } from '../constants';

interface NewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposal: Partial<DAOProposal>) => void;
  userTier: IdentityTier;
}

const NewProposalModal: React.FC<NewProposalModalProps> = ({ isOpen, onClose, onSubmit, userTier }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TREASURY' as DAOProposal['category'],
    durationDays: 7
  });

  if (!isOpen) return null;

  const isEligible = userTier === IdentityTier.EXPERT || userTier === IdentityTier.INSTITUTION;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible) return;

    onSubmit({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      deadline: Date.now() + (formData.durationDays * 86400000),
      status: 'ACTIVE',
      votesFor: 0,
      votesAgainst: 0,
      proposer: '0x..Self'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Initiate Governance Proposal</h2>
            <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">PIP Generation Engine</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!isEligible && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
              <p className="text-[10px] text-rose-400 font-black uppercase">Access Restricted</p>
              <p className="text-[11px] text-slate-500 mt-1">Only Level 2 (Expert) or Level 3 (Institution) actors can initiate protocol changes.</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">Proposal Title</label>
              <input 
                required
                disabled={!isEligible}
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none text-sm"
                placeholder="PIP-XXX: Protocol Upgrade..."
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">Category</label>
              <select 
                disabled={!isEligible}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none text-sm"
              >
                <option value="TREASURY">TREASURY (Grant/Disbursement)</option>
                <option value="GOVERNANCE">GOVERNANCE (Rule Change)</option>
                <option value="TECHNICAL">TECHNICAL (Upgrade/Bugfix)</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">Detailed Rationale</label>
              <textarea 
                required
                disabled={!isEligible}
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none text-sm resize-none"
                placeholder="Describe the problem and the proposed solution in detail..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">Voting Duration</label>
                <select 
                  disabled={!isEligible}
                  value={formData.durationDays}
                  onChange={(e) => setFormData({...formData, durationDays: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none text-[10px] font-mono"
                >
                  <option value={3}>3 DAYS (Emergency)</option>
                  <option value={7}>7 DAYS (Standard)</option>
                  <option value={14}>14 DAYS (Strategic)</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <p className="text-[8px] text-blue-400 uppercase font-black">Stake Requirement</p>
                  <p className="text-xs font-bold text-white">500 PT (Locked)</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            disabled={!isEligible}
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-blue-900/40"
          >
            Broadcast to DAO Ledger
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProposalModal;
