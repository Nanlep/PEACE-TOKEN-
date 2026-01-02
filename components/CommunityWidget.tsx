
import React, { useState } from 'react';

interface CommunityWidgetProps {
  isDiscordLinked: boolean;
  onLinkDiscord: () => void;
}

const CommunityWidget: React.FC<CommunityWidgetProps> = ({ isDiscordLinked, onLinkDiscord }) => {
  const [msg, setMsg] = useState("");
  const [localActivity, setLocalActivity] = useState([
    { user: 'PeaceNode_42', action: 'voted FOR PIP-042', time: '2m ago' },
    { user: 'MediationCenter', action: 'minted Impact Evidence', time: '12m ago' },
    { user: 'GlobalNGO', action: 'joined verified institutions', time: '1h ago' },
  ]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const newAction = { user: 'You (Node_77)', action: msg, time: 'Just now' };
    setLocalActivity([newAction, ...localActivity.slice(0, 4)]);
    setMsg("");
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#5865F2]/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .079.009c.12.098.245.195.372.288a.077.077 0 0 1-.006.128c-.598.35-1.182.646-1.872.892a.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>
          Discord Command
        </h3>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[9px] text-slate-400 font-bold uppercase">Consensus Active</span>
        </span>
      </div>

      {!isDiscordLinked ? (
        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">Identity cross-check failed. Link your Discord handle to access the community signaling layer.</p>
          <button 
            onClick={onLinkDiscord}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-[9px] font-black uppercase tracking-widest py-3 rounded-lg transition-all shadow-lg shadow-[#5865F2]/20 active:scale-95"
          >
            Authorize Social Link
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <form onSubmit={handlePost} className="relative group">
            <input 
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Broadcast to community..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:outline-none focus:border-[#5865F2] transition-all placeholder:text-slate-600"
            />
            <button type="submit" className="absolute right-2 top-1.5 text-[10px] text-[#5865F2] font-black uppercase">Post</button>
          </form>
          
          <div className="space-y-3 pt-2">
            <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Signaling Feed</h4>
            {localActivity.map((act, i) => (
              <div key={i} className="flex justify-between items-start text-[9px] border-b border-white/5 pb-2 last:border-0">
                <span className="text-slate-300 leading-tight pr-2">
                  <span className="font-bold text-blue-400">{act.user}:</span> {act.action}
                </span>
                <span className="text-slate-600 font-mono text-[8px] whitespace-nowrap">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityWidget;
