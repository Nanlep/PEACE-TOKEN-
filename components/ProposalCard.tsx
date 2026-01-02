
import React from 'react';
import { DAOProposal } from '../types';
import { Icons } from '../constants';

interface ProposalCardProps {
  proposal: DAOProposal;
  onVote: (id: string, side: 'FOR' | 'AGAINST') => void;
  onExecute: (id: string) => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onVote, onExecute }) => {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const percentageFor = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">{proposal.category}</span>
          <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{proposal.id}: {proposal.title}</h4>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold border ${
          proposal.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          proposal.status === 'PASSED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
          'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }`}>
          {proposal.status}
        </span>
      </div>
      
      <div className="w-full bg-slate-800 h-1.5 rounded-full mb-3 overflow-hidden mt-3">
        <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${percentageFor}%` }}></div>
      </div>
      
      <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase mb-4">
        <span>Support: {percentageFor.toFixed(1)}%</span>
        <span>{proposal.status === 'ACTIVE' ? `Ends in ${Math.ceil((proposal.deadline - Date.now()) / (1000 * 60 * 60))}h` : 'Finished'}</span>
      </div>

      <div className="flex gap-2">
        {proposal.status === 'ACTIVE' && (
          <>
            <button 
              onClick={() => onVote(proposal.id, 'FOR')}
              className="flex-1 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded text-[10px] font-bold uppercase transition-all"
            >
              Vote For
            </button>
            <button 
              onClick={() => onVote(proposal.id, 'AGAINST')}
              className="flex-1 py-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-600/30 rounded text-[10px] font-bold uppercase transition-all"
            >
              Against
            </button>
          </>
        )}
        {proposal.status === 'PASSED' && (
          <button 
            onClick={() => onExecute(proposal.id)}
            className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold uppercase transition-all shadow-lg shadow-blue-900/40"
          >
            Execute Proposal
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
