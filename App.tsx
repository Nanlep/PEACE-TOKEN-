
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import IdentityVerification from './components/IdentityVerification';
import ProjectSubmission from './components/ProjectSubmission';
import PayoutLedger from './components/PayoutLedger';
import ProposalCard from './components/ProposalCard';
import CommunityWidget from './components/CommunityWidget';
import ExchangeModal from './components/ExchangeModal';
import UserGuideModal from './components/UserGuideModal';
import { PeaceProject, DAOProposal, IdentityTier, TransactionLog } from './types';
import { Icons, TOKENOMICS } from './constants';
import { ProtocolService } from './services/protocolService';
import { downloadWhitePaper } from './services/documentService';

const LEDGER_KEY = 'PEACE_PROTOCOL_LEDGER_V4';

const App: React.FC = () => {
  // State Initialization
  const [currentTier, setCurrentTier] = useState<IdentityTier>(IdentityTier.UNVERIFIED);
  const [projects, setProjects] = useState<PeaceProject[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isDiscordLinked, setIsDiscordLinked] = useState(false);
  
  // Adjusted for 100M @ $0.19 Target
  const [treasury, setTreasury] = useState(TOKENOMICS.TARGET_MARKET_CAP * TOKENOMICS.ALLOCATION.DAO); // $7.6M initial liquid pool
  const [totalRewarded, setTotalRewarded] = useState(0);
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balancePT, setBalancePT] = useState(0);
  const [balanceUSDC, setBalanceUSDC] = useState(190.00); // Starter gas
  
  // Market State
  const [ptPrice, setPtPrice] = useState(TOKENOMICS.INITIAL_PRICE_USDC); // Start at $0.19
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);

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

  // Price Simulation Hook
  useEffect(() => {
    const interval = setInterval(() => {
      setPtPrice(prev => {
        const drift = (Math.random() - 0.45) * 0.001; 
        return Math.max(0.15, prev + drift);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Persistence Layer
  useEffect(() => {
    const saved = localStorage.getItem(LEDGER_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setProjects(data.projects || []);
      setLogs(data.logs || []);
      setTreasury(data.treasury || TOKENOMICS.TARGET_MARKET_CAP * TOKENOMICS.ALLOCATION.DAO);
      setTotalRewarded(data.totalRewarded || 0);
      setBalancePT(data.balancePT || 0);
      setBalanceUSDC(data.balanceUSDC || 190.00);
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
    
    if (totalRewarded + newProject.tokensRewarded > TOKENOMICS.TOTAL_SUPPLY * TOKENOMICS.ALLOCATION.REWARDS) {
      alert("PROTOCOL ALERT: Rewards pool depletion reached. Transitioning to DAO secondary funding.");
      return;
    }

    const tieredReward = ProtocolService.calculateReward(newProject.tokensRewarded, currentTier);
    const finalProject = { ...newProject, tokensRewarded: tieredReward, usdcValue: tieredReward * ptPrice };
    
    setProjects(prev => [finalProject, ...prev]);
    addLog('MINT', 0, 'PT'); // Pre-mint validation event
  };

  const handleProjectVote = (id: string, side: 'FOR' | 'AGAINST') => {
    if (isPaused || !walletAddress) return;
    const VOTE_QUOTA = 5;

    setProjects(prev => prev.map(p => {
      if (p.id === id && p.status === 'VOTING') {
        const newVotesFor = side === 'FOR' ? p.votesFor + 1 : p.votesFor;
        const newVotesAgainst = side === 'AGAINST' ? p.votesAgainst + 1 : p.votesAgainst;
        
        // Use PeaceProject['status'] type explicitly to avoid literal type inference errors
        let newStatus: PeaceProject['status'] = p.status;
        if (newVotesFor >= VOTE_QUOTA) {
          newStatus = 'VALIDATED';
          addLog('VOTE', 0, 'PT'); // Validation complete
        } else if (newVotesAgainst >= VOTE_QUOTA) {
          newStatus = 'REJECTED';
        }

        return { ...p, votesFor: newVotesFor, votesAgainst: newVotesAgainst, status: newStatus };
      }
      return p;
    }));
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.status === 'VALIDATED') {
        const reward = p.tokensRewarded;
        setBalancePT(bal => bal + reward);
        setTotalRewarded(prev => prev + reward);
        addLog('MINT', reward, 'PT');
        return { ...p, status: 'PAID' };
      }
      return p;
    }));
  };

  const handleExchange = (amountPT: number) => {
    const swap = ProtocolService.calculateSwap(amountPT, ptPrice);
    
    if (!ProtocolService.verifySolvency(swap.usdcValue, treasury)) {
      alert("PROTOCOL RISK: Solvency check failed. DAO Treasury reserve must remain stable. Operation aborted.");
      return;
    }

    setBalancePT(prev => prev - amountPT);
    setBalanceUSDC(prev => prev + swap.usdcValue);
    setTreasury(prev => prev - swap.usdcValue);
    addLog('PAYOUT', swap.usdcValue, 'USDC');
  };

  const addLog = (type: any, amount: number, currency: any) => {
    const newLog: TransactionLog = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      currency,
      timestamp: Date.now(),
      status: 'SUCCESS',
      txHash: ProtocolService.generateTxHash()
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
      signature: ProtocolService.generateTxHash(),
      ptMarketPrice: ptPrice,
      treasurySnapshot: treasury,
      totalRewarded: totalRewarded,
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
        onOpenExchange={() => setIsExchangeOpen(true)}
        isEligible={currentTier !== IdentityTier.UNVERIFIED}
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
             <div className="flex flex-col items-center gap-6">
               <button 
                onClick={handleConnect}
                className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/40 transition-all active:scale-95"
               >
                  Initialize Persistent Node
               </button>
               <div className="flex items-center gap-8 border-t border-white/5 pt-6 w-full justify-center">
                 <button 
                  onClick={() => setIsUserGuideOpen(true)}
                  className="text-blue-400 hover:text-blue-300 text-[9px] font-black uppercase tracking-widest text-center"
                 >
                    Read User Guide
                 </button>
                 <button 
                  onClick={downloadWhitePaper}
                  className="text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest text-center"
                 >
                    Read White-paper
                 </button>
               </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  Mission Control 
                  <span className="text-[10px] font-black bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-blue-400 uppercase tracking-widest">Node 0x..77 Active</span>
                </h2>
                <p className="text-slate-400 text-sm">Synchronized Assets: ${treasury.toLocaleString()} USDC (Price: ${ptPrice.toFixed(4)})</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setIsUserGuideOpen(true)}
                  className="px-4 py-2 glass-panel hover:bg-white/10 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-300 border border-white/10 transition-all flex items-center gap-2"
                >
                   Protocol User Guide
                </button>
                <button 
                  onClick={downloadWhitePaper}
                  className="px-4 py-2 glass-panel hover:bg-blue-500/10 hover:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-300 border border-white/10 transition-all flex items-center gap-2"
                >
                   White-paper
                </button>
                <button 
                  onClick={downloadMasterLedger}
                  className="px-4 py-2 glass-panel hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-300 border border-white/10 transition-all flex items-center gap-2"
                >
                   <div className="status-pulse"></div> Export Audit
                </button>
                <button 
                  onClick={togglePause}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${isPaused ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-rose-900/20 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'}`}
                >
                  {isPaused ? 'RESUME PROTOCOL' : 'PANIC REVERT'}
                </button>
              </div>
            </div>

            <DashboardStats treasury={treasury} totalRewarded={totalRewarded} ptPrice={ptPrice} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-8">
                <ProjectSubmission onValidated={handleProjectValidated} userTier={currentTier} />
                <PayoutLedger 
                  projects={projects} 
                  onPayout={handlePayout} 
                  onVote={handleProjectVote}
                  userTier={currentTier}
                />
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
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-12 bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Market Liquidity</h5>
              <p className="text-[10px] text-slate-500 leading-relaxed">PEACE is paired with USDC. Market Cap: ${(TOKENOMICS.TOTAL_SUPPLY * ptPrice).toLocaleString()} USDC.</p>
            </div>
            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Allocation Policy</h5>
              <p className="text-[10px] text-slate-500 leading-relaxed">50% Rewards | 40% DAO Treasury | 10% Systems. Supply Capped at 100,000,000 PEACE.</p>
            </div>
            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Architecture Role</h5>
              <p className="text-[10px] text-slate-500 leading-relaxed">System Architect controls the Panic Revert circuit and verifies high-stakes identity audits.</p>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center flex flex-col md:flex-row items-center justify-between gap-4">
             <p className="text-slate-600 text-[10px] font-mono uppercase tracking-[0.2em]">© 2025 PEACE-TOKEN FOUNDATION | INFRASTRUCTURE: DEPLOYED-STABLE</p>
             <button 
              onClick={() => setIsUserGuideOpen(true)}
              className="text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest"
             >
                Protocol User Guide (Read Only)
             </button>
          </div>
        </div>
      </footer>

      <ExchangeModal 
        isOpen={isExchangeOpen}
        onClose={() => setIsExchangeOpen(false)}
        balancePT={balancePT}
        ptPrice={ptPrice}
        onExchange={handleExchange}
      />

      <UserGuideModal 
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />
    </div>
  );
};

export default App;
