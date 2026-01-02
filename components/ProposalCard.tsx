
import React from 'react';
import { DAOProposal } from '../types';
import { Icons } from '../constants';

interface ProposalCardProps {
  proposal: DAOProposal;
  onVote: (id: string, side: 'FOR' | 'AGAINST') => void;
  onExecute: (id: string) => void;
  canVote: boolean;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onVote, onExecute, canVote }) => {
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
            <div className="flex-1 relative group/btn">
              <button 
                disabled={!canVote}
                onClick={() => onVote(proposal.id, 'FOR')}
                className={`w-full py-1.5 rounded text-[10px] font-bold uppercase transition-all border ${
                  canVote 
                  ? 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border-emerald-600/30' 
                  : 'bg-slate-800/50 text-slate-600 border-white/5 cursor-not-allowed'
                }`}
              >
                Vote For
              </button>
              {!canVote && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-black border border-white/10 rounded text-[8px] text-slate-400 text-center opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-20">
                  Level 2 Identity Required to Vote
                </div>
              )}
            </div>
            
            <div className="flex-1 relative group/btn">
              <button 
                disabled={!canVote}
                onClick={() => onVote(proposal.id, 'AGAINST')}
                className={`w-full py-1.5 rounded text-[10px] font-bold uppercase transition-all border ${
                  canVote 
                  ? 'bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border-rose-600/30' 
                  : 'bg-slate-800/50 text-slate-600 border-white/5 cursor-not-allowed'
                }`}
              >
                Against
              </button>
              {!canVote && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-black border border-white/10 rounded text-[8px] text-slate-400 text-center opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-20">
                  Level 2 Identity Required to Vote
                </div>
              )}
            </div>
          </>
        )}
        {proposal.status === 'PASSED' && (
          <button 
            disabled={!canVote}
            onClick={() => onExecute(proposal.id)}
            className={`w-full py-1.5 rounded text-[10px] font-bold uppercase transition-all shadow-lg ${
              canVote 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Execute Proposal
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
