
import React, { useState } from 'react';
import { validatePeaceProject, ValidationResult } from '../services/geminiService';
import { PeaceProject, IdentityTier } from '../types';

interface ProjectSubmissionProps {
  onValidated: (project: PeaceProject) => void;
  userTier: IdentityTier;
  poolHealth?: 'NORMAL' | 'LOW' | 'CRITICAL';
}

const ProjectSubmission: React.FC<ProjectSubmissionProps> = ({ onValidated, userTier, poolHealth }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    evidenceHash: '',
    evidenceLinks: '' // New field for reports, frameworks, etc.
  });
  const [result, setResult] = useState<ValidationResult | null>(null);

  const isTierGated = userTier === IdentityTier.UNVERIFIED;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTierGated) return;
    
    setLoading(true);
    setResult(null);

    try {
      // Deep dive verification includes the evidence repository
      const fullContext = `${formData.description}\n\nEVIDENCE REPOSITORY:\n${formData.evidenceLinks}`;
      const validation = await validatePeaceProject(
        formData.title, 
        fullContext, 
        formData.evidenceHash
      );
      
      setResult(validation);

      if (validation.isAuthentic) {
        const newProject: PeaceProject = {
          id: 'PRJ-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          title: formData.title,
          description: formData.description,
          author: '0x71...4F2A',
          tier: userTier,
          impactScore: validation.impactScore,
          status: 'VOTING', // Moves to community voting after AI pre-approval
          evidenceHash: formData.evidenceHash,
          evidenceUrls: formData.evidenceLinks.split('\n').filter(l => l.trim() !== ''),
          votesFor: 0,
          votesAgainst: 0,
          timestamp: Date.now(),
          tokensRewarded: validation.suggestedTokens,
          usdcValue: validation.suggestedTokens
        };
        
        setTimeout(() => {
          onValidated(newProject);
          setLoading(false);
          setFormData({ title: '', description: '', evidenceHash: '', evidenceLinks: '' });
        }, 1200);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className={`glass-panel p-6 rounded-2xl border border-white/10 relative ${isTierGated ? 'opacity-80' : ''}`}>
      {isTierGated && (
        <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px] bg-black/40 rounded-2xl">
          <div className="bg-[#0a0a0c] border border-rose-500/30 p-4 rounded-xl text-center max-w-[280px] shadow-2xl">
            <h4 className="text-rose-500 font-bold text-xs uppercase tracking-widest mb-2">Protocol Access Denied</h4>
            <p className="text-[10px] text-slate-400 mb-4">Level 1 (Verified) SBT required to publish impact evidence to the global ledger.</p>
            <button className="text-[9px] font-black uppercase text-blue-400 hover:text-blue-300">Upgrade Identity Now →</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Publish Impact Evidence</h2>
        {poolHealth === 'CRITICAL' ? (
          <div className="flex gap-2 text-[10px] font-black text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20 animate-pulse">
             REWARD POOL DEPLETED: PENDING DAO REFILL
          </div>
        ) : poolHealth === 'LOW' ? (
          <div className="flex gap-2 text-[10px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
             REWARD POOL LOW: REFILL PROPOSAL RECOMMENDED
          </div>
        ) : (
          <div className="flex gap-2 text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
             ORACLE DEEP-DIVE: READY
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">Mission Title</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm placeholder:text-slate-700"
            placeholder="Regional Stability Initiative..."
            required
            disabled={isTierGated || poolHealth === 'CRITICAL'}
          />
        </div>
        <div>
          <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">Impact Analysis</label>
          <textarea 
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm placeholder:text-slate-700 resize-none"
            placeholder="Describe outcome and reduction in conflict risk..."
            required
            disabled={isTierGated || poolHealth === 'CRITICAL'}
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">Evidence Repository (Reports, Frameworks, Images)</label>
          <textarea 
            rows={2}
            value={formData.evidenceLinks}
            onChange={(e) => setFormData({...formData, evidenceLinks: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all text-[11px] font-mono placeholder:text-slate-700 resize-none"
            placeholder="Links to PDF reports, image hashes, or signed attendance lists (one per line)..."
            required
            disabled={isTierGated || poolHealth === 'CRITICAL'}
          />
        </div>

        <button 
          disabled={loading || isTierGated || poolHealth === 'CRITICAL'}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span className="text-[10px] tracking-[0.2em] uppercase">Deep Dive Audit in Progress...</span>
            </>
          ) : (
            <span className="text-[10px] tracking-[0.2em] uppercase">{poolHealth === 'CRITICAL' ? 'Submission Gated' : 'Submit for Multi-Layer Verification'}</span>
          )}
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-xl border animate-in zoom-in-95 duration-300 ${result.isAuthentic ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[9px] font-black uppercase tracking-widest ${result.isAuthentic ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.isAuthentic ? 'PRE-APPROVED BY ORACLE' : 'ORACLE REJECTION'}
            </span>
            <span className="text-white font-mono font-bold text-xs">SCORE: {result.impactScore}</span>
          </div>
          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed italic">"{result.justification}"</p>
          {result.isAuthentic && <p className="text-[9px] text-blue-400 font-bold uppercase">Moving to Community Validation Layer...</p>}
        </div>
      )}
    </div>
  );
};

export default ProjectSubmission;
