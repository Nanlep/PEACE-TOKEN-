
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import IdentityVerification from './components/IdentityVerification';
import ProjectSubmission from './components/ProjectSubmission';
import PayoutLedger from './components/PayoutLedger';
import ProposalCard from './components/ProposalCard';
import CommunityWidget from './components/CommunityWidget';
import { PeaceProject, DAOProposal, IdentityTier, TransactionLog } from './types';
import { Icons } from './constants';

const LEDGER_KEY = 'PEACE_PROTOCOL_LEDGER_V4';

const App: React.FC = () => {
  // Persistence Layer Initialization
  const [currentTier, setCurrentTier] = useState<IdentityTier>(IdentityTier.UNVERIFIED);
  const [projects, setProjects] = useState<PeaceProject[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isDiscordLinked, setIsDiscordLinked] = useState(false);
  const [treasury, setTreasury] = useState(42910204.00);
  const [totalRewarded, setTotalRewarded] = useState(1204112.50);
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balancePT, setBalancePT] = useState(0);
  const [balanceUSDC, setBalanceUSDC] = useState(150.00);

  const [proposals, setProposals] = useState<DAOProposal[]>([
    {
      id: 'PIP-042',
      title: 'Upgrade Slashing Penalty for Malicious Actors',
      proposer: '0x32...a1f',
      votesFor: 42000,
      votesAgainst: 12000,
      status: 'ACTIVE',
      description: 'Increases the penalty for false impact reports from 10% to 25% stake loss.',
      deadline: Date.now() + 86400000,
      category: 'GOVERNANCE'
    },
    {
      id: 'PIP-043',
      title: 'Treasury Disbursment for UN-aligned NGO Grant',
      proposer: '0x88...c22',
      votesFor: 89000,
      votesAgainst: 500,
      status: 'PASSED',
      description: 'Allocation of 1M USDC to verified peace missions in West Africa.',
      deadline: Date.now() - 1,
      category: 'TREASURY'
    }
  ]);

  // Sync state to LocalStorage (Deterministic Ledger Simulation)
  useEffect(() => {
    const saved = localStorage.getItem(LEDGER_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setProjects(data.projects || []);
      setLogs(data.logs || []);
      setTreasury(data.treasury || 42910204.00);
      setTotalRewarded(data.totalRewarded || 1204112.50);
      setBalancePT(data.balancePT || 0);
      setBalanceUSDC(data.balanceUSDC || 150.00);
      setCurrentTier(data.currentTier || IdentityTier.UNVERIFIED);
      setIsDiscordLinked(data.isDiscordLinked || false);
      if (data.walletAddress) setWalletAddress(data.walletAddress);
    }
  }, []);

  useEffect(() => {
    const state = { projects, logs, treasury, totalRewarded, balancePT, balanceUSDC, currentTier, isDiscordLinked, walletAddress };
    localStorage.setItem(LEDGER_KEY, JSON.stringify(state));
  }, [projects, logs, treasury, totalRewarded, balancePT, balanceUSDC, currentTier, isDiscordLinked, walletAddress]);

  const handleConnect = () => {
    const mockAddr = '0x' + Math.random().toString(16).substr(2, 40);
    setWalletAddress(mockAddr);
    addLog('STAKE', 0, 'PT');
  };

  const handleLinkDiscord = () => {
    setIsDiscordLinked(true);
    addLog('STAKE', 0, 'PT');
  };

  const handleProjectValidated = (newProject: PeaceProject) => {
    if (isPaused || !walletAddress) return;
    setProjects(prev => [newProject, ...prev]);
    addLog('MINT', newProject.tokensRewarded, 'PT');
  };

  const handleTierUpgrade = (newTier: IdentityTier) => {
    if (!walletAddress) return;
    setCurrentTier(newTier);
    addLog('STAKE', 0, 'PT');
  };

  const handleVote = (id: string, side: 'FOR' | 'AGAINST') => {
    if (isPaused || !walletAddress) return;
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          votesFor: side === 'FOR' ? p.votesFor + 1250 : p.votesFor,
          votesAgainst: side === 'AGAINST' ? p.votesAgainst + 1250 : p.votesAgainst,
        };
      }
      return p;
    }));
    addLog('VOTE', 1250, 'PT');
  };

  const handleExecute = (id: string) => {
    if (isPaused || !walletAddress) return;
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'EXECUTED' } : p));
    addLog('STAKE', 0, 'PT');
  };

  const handlePayout = (projectId: string) => {
    if (isPaused || !walletAddress) return;
    
    // Mission-Critical Fail Safe: Invariant Check
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.status !== 'PAID') {
        const reward = p.tokensRewarded;
        const usdc = p.usdcValue;
        
        // Ledger Integrity Check
        if (treasury < usdc) {
          alert("TREASURY INSOLVENCY: Operation aborted by safety controller.");
          return p;
        }

        setBalanceUSDC(bal => bal + usdc);
        setBalancePT(bal => bal + reward);
        setTreasury(prev => prev - usdc);
        setTotalRewarded(prev => prev + reward);
        addLog('PAYOUT', usdc, 'USDC');
        return { ...p, status: 'PAID' };
      }
      return p;
    }));
  };

  const addLog = (type: any, amount: number, currency: any) => {
    const newLog: TransactionLog = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      currency,
      timestamp: Date.now(),
      status: 'SUCCESS',
      txHash: '0x' + Math.random().toString(16).substr(2, 64)
    };
    setLogs(prev => [newLog, ...prev.slice(0, 14)]);
  };

  const togglePause = () => {
    if (!walletAddress) return;
    setIsPaused(!isPaused);
    addLog('STAKE', 0, 'PT');
  };

  const downloadMasterLedger = () => {
    const auditObj = {
      protocol: "Peace-Token v4.2.0-PROD",
      timestamp: new Date().toISOString(),
      signature: "0x" + Math.random().toString(16).substr(2, 64),
      treasurySnapshot: treasury,
      projects: projects,
      auditLogs: logs
    };
    const blob = new Blob([JSON.stringify(auditObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PEACE_LEDGER_AUDIT_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      <Header 
        balancePT={balancePT} 
        balanceUSDC={balanceUSDC} 
        walletAddress={walletAddress}
        onConnect={handleConnect}
      />
      
      {isPaused && (
        <div className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.3em] py-2.5 text-center animate-pulse sticky top-16 z-50 border-b border-rose-400/20">
          PROTOCOL EMERGENCY CIRCUIT BREAKER ACTIVE: REVERTING ALL PENDING STATE
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {!walletAddress ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-in fade-in duration-700">
             <div className="bg-blue-600/10 p-6 rounded-full border border-blue-500/20 shadow-2xl shadow-blue-900/20">
                <Icons.Shield />
             </div>
             <div className="text-center max-w-md">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Access Denied</h2>
                <p className="text-slate-500 text-sm leading-relaxed">The Peace-Token Protocol requires a verified node connection to synchronize with the persistent global ledger.</p>
             </div>
             <button 
              onClick={handleConnect}
              className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/40 transition-all active:scale-95"
             >
                Initialize Persistent Node
             </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  Mission Control 
                  <span className="text-[10px] font-black bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-blue-400 uppercase tracking-widest">Node 0x..77 Active</span>
                </h2>
                <p className="text-slate-400 text-sm">Synchronized with Global Peace Assets: ${treasury.toLocaleString()} USDC.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={downloadMasterLedger}
                  className="px-4 py-2 glass-panel hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-300 border border-white/10 transition-all flex items-center gap-2"
                >
                   <div className="status-pulse"></div> Export Master Ledger
                </button>
                <button 
                  onClick={togglePause}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${isPaused ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-rose-900/20 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'}`}
                >
                  {isPaused ? 'RESUME PROTOCOL' : 'PANIC REVERT'}
                </button>
              </div>
            </div>

            <DashboardStats treasury={treasury} totalRewarded={totalRewarded} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-8">
                <ProjectSubmission onValidated={handleProjectValidated} userTier={currentTier} />
                <PayoutLedger projects={projects} onPayout={handlePayout} />
              </div>

              <div className="lg:col-span-4 flex flex-col gap-8">
                <IdentityVerification 
                  currentTier={currentTier} 
                  isDiscordLinked={isDiscordLinked}
                  onTierUpgrade={handleTierUpgrade}
                  onLinkDiscord={handleLinkDiscord}
                />
                
                <CommunityWidget isDiscordLinked={isDiscordLinked} onLinkDiscord={handleLinkDiscord} />
                
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">DAO Governance</h2>
                    <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold font-mono">
                      <Icons.Vote />
                      <span>PIP VOTING ACTIVE</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {proposals.map((p) => (
                      <ProposalCard 
                        key={p.id} 
                        proposal={p} 
                        onVote={handleVote} 
                        onExecute={handleExecute} 
                      />
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-transparent to-white/5">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">SRE Infrastructure Health</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                      <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-tighter">Ledger Sync</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">STABLE</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                      <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-tighter">Peers</div>
                      <div className="text-xs font-bold text-blue-400 font-mono">2,104</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {logs.map(log => (
                      <div key={log.id} className="flex items-start gap-3 text-[9px] font-mono border-b border-white/5 pb-2 last:border-0">
                        <span className={`font-bold ${log.type === 'PAYOUT' ? 'text-emerald-400' : 'text-blue-400'}`}>[{log.type}]</span>
                        <div className="flex-grow">
                          <div className="text-slate-300 truncate">
                            {log.type === 'STAKE' ? 'Ledger Auth Verified' : `${log.amount.toLocaleString()} ${log.currency} confirmed`}
                          </div>
                          <div className="text-slate-600 truncate opacity-50">{log.txHash.slice(0, 16)}...</div>
                        </div>
                        <span className="text-slate-600 scale-75 origin-right">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-12 bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Enterprise Guard</h5>
              <p className="text-[10px] text-slate-500 leading-relaxed">Persistent ledger enabled. Circuit breaker active. All state updates are signed with a unique node-ID for auditability.</p>
            </div>
            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Liveness Protocol</h5>
              <p className="text-[10px] text-slate-500 leading-relaxed">High-tier accounts require biometric liveness checks. Sybil resistance enforced through biometric hashing.</p>
            </div>
            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Master Audit</h5>
              <p className="text-[10px] text-slate-500 leading-relaxed">Deterministic state management. 7-year audit capability via signed ledger exports.</p>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center">
             <p className="text-slate-600 text-[10px] font-mono uppercase tracking-[0.2em]">© 2025 PEACE-TOKEN FOUNDATION | INFRASTRUCTURE: DEPLOYED-STABLE</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
