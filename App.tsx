
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import IdentityVerification from './components/IdentityVerification';
import ProjectSubmission from './components/ProjectSubmission';
import PayoutLedger from './components/PayoutLedger';
import ProposalCard from './components/ProposalCard';
import CommunityWidget from './components/CommunityWidget';
import ExchangeModal from './components/ExchangeModal';
import FundingModal from './components/FundingModal';
import UserGuideModal from './components/UserGuideModal';
import ComplianceModal from './components/ComplianceModal';
import GuardianTerminal from './components/GuardianTerminal';
import NewProposalModal from './components/NewProposalModal';
import { PeaceProject, DAOProposal, IdentityTier, TransactionLog, SystemHealth, ProjectStatus, InstitutionalRequest } from './types';
import { Icons, TOKENOMICS } from './constants';
import { ProtocolService } from './services/protocolService';
import { downloadWhitePaper } from './services/documentService';

const PERSISTENCE_VERSION = 'PEACE_PROTOCOL_V4_PROD';

const App: React.FC = () => {
  // --- CORE STATE ---
  const [currentTier, setCurrentTier] = useState<IdentityTier>(IdentityTier.UNVERIFIED);
  const [projects, setProjects] = useState<PeaceProject[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isDiscordLinked, setIsDiscordLinked] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  // --- GUARDIAN STATE ---
  const [isGuardianTerminalOpen, setIsGuardianTerminalOpen] = useState(false);
  const [institutionalRequests, setInstitutionalRequests] = useState<InstitutionalRequest[]>([]);
  const [activeGuardianId, setActiveGuardianId] = useState<string | null>(null);

  // --- ASSET STATE ---
  const [treasuryUSDC, setTreasuryUSDC] = useState(TOKENOMICS.TARGET_MARKET_CAP * TOKENOMICS.ALLOCATION.DAO); 
  const [totalRewardedPT, setTotalRewardedPT] = useState(0);
  const [balancePT, setBalancePT] = useState(0);
  const [balanceUSDC, setBalanceUSDC] = useState(0.00); 
  const [ptPrice, setPtPrice] = useState(TOKENOMICS.INITIAL_PRICE_USDC);

  // --- OBSERVABILITY ---
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [health, setHealth] = useState<SystemHealth>({
    oracleLatency: 24,
    treasurySolvency: 100,
    activeNodes: 8291,
    networkLoad: 12,
    securityPosture: 'HIGH'
  });

  // --- UI STATE ---
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isFundingOpen, setIsFundingOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);

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
    }
  ]);

  const canVote = useMemo(() => 
    currentTier === IdentityTier.EXPERT || currentTier === IdentityTier.INSTITUTION, 
  [currentTier]);

  // --- MARKET SIMULATION ---
  useEffect(() => {
    const market = setInterval(() => {
      setPtPrice(prev => Math.max(0.12, prev + (Math.random() - 0.48) * 0.002));
      setHealth(h => ({
        ...h,
        oracleLatency: Math.floor(20 + Math.random() * 15),
        networkLoad: Math.floor(10 + Math.random() * 20)
      }));
    }, 4000);
    return () => clearInterval(market);
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    const raw = localStorage.getItem(PERSISTENCE_VERSION);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setProjects(data.projects || []);
        setLogs(data.logs || []);
        setTreasuryUSDC(data.treasuryUSDC || 76000000);
        setTotalRewardedPT(data.totalRewardedPT || 0);
        setBalancePT(data.balancePT || 0);
        setBalanceUSDC(data.balanceUSDC || 0.00);
        setCurrentTier(data.currentTier || IdentityTier.UNVERIFIED);
        setIsDiscordLinked(data.isDiscordLinked || false);
        setWalletAddress(data.walletAddress || null);
        setInstitutionalRequests(data.institutionalRequests || []);
        setProposals(data.proposals || proposals);
      } catch (e) { console.error("Snapshot corruption detected. Resetting state."); }
    }
  }, []);

  useEffect(() => {
    const state = { projects, logs, treasuryUSDC, totalRewardedPT, balancePT, balanceUSDC, currentTier, isDiscordLinked, walletAddress, institutionalRequests, proposals };
    localStorage.setItem(PERSISTENCE_VERSION, JSON.stringify(state));
  }, [projects, logs, treasuryUSDC, totalRewardedPT, balancePT, balanceUSDC, currentTier, isDiscordLinked, walletAddress, institutionalRequests, proposals]);

  // --- LOGIC HANDLERS ---
  const addLog = (type: TransactionLog['type'], amount: number, currency: TransactionLog['currency'], metadata?: string) => {
    const entry: TransactionLog = {
      id: Math.random().toString(36).substring(2, 9),
      type, amount, currency, metadata,
      timestamp: Date.now(),
      status: 'SUCCESS',
      txHash: ProtocolService.generateTxHash()
    };
    setLogs(prev => [entry, ...prev.slice(0, 19)]);
  };

  const handleConnect = () => {
    setWalletAddress('0x' + Math.random().toString(16).substring(2, 42));
    addLog('STAKE', 0, 'PT', 'Persistent Session Initialized');
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setActiveGuardianId(null);
    addLog('STAKE', 0, 'PT', 'Session Terminated by User');
  };

  const handleInstitutionalRequest = (req: InstitutionalRequest) => {
    setInstitutionalRequests(prev => [...prev, req]);
    addLog('STAKE', 0, 'PT', `Audit Request Queued: ${req.id}`);
  };

  const handleGuardianSign = (requestId: string, guardianId: string) => {
    setInstitutionalRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const newSigs = req.signatures.includes(guardianId) ? req.signatures : [...req.signatures, guardianId];
        const newStatus = newSigs.length >= 4 ? 'APPROVED' : req.status;
        
        if (newStatus === 'APPROVED' && req.status !== 'APPROVED') {
           addLog('MINT', 0, 'PT', `Institutional Quorum Reached: ${req.entityName}`);
        }
        
        return { ...req, signatures: newSigs, status: newStatus as any };
      }
      return req;
    }));
  };

  const handleGuardianAuth = (id: string | null) => {
    setActiveGuardianId(id);
    if (id) {
      addLog('STAKE', 0, 'PT', `Guardian Authenticated: ${id}`);
    } else {
      addLog('STAKE', 0, 'PT', `Guardian Session Revoked`);
    }
  };

  const handleProjectValidated = (newProject: PeaceProject) => {
    if (isPaused || !walletAddress) return;
    const finalTokens = ProtocolService.calculateReward(newProject.tokensRewarded, currentTier, newProject.impactScore);
    const enriched = { ...newProject, tokensRewarded: finalTokens, usdcValue: finalTokens * ptPrice };
    setProjects(prev => [enriched, ...prev]);
    addLog('MINT', 0, 'PT', `Oracle Pre-Approval: ${newProject.id}`);
  };

  const handleProjectVote = (id: string, side: 'FOR' | 'AGAINST') => {
    if (isPaused || !walletAddress) return;
    setProjects(prev => prev.map(p => {
      if (p.id === id && p.status === 'VOTING') {
        const votesFor = side === 'FOR' ? p.votesFor + 1 : p.votesFor;
        const votesAgainst = side === 'AGAINST' ? p.votesAgainst + 1 : p.votesAgainst;
        let status: ProjectStatus = p.status;
        if (votesFor >= 5) { status = 'VALIDATED'; addLog('VOTE', 0, 'PT', `Validated: ${id}`); }
        else if (votesAgainst >= 3) { status = 'REJECTED'; addLog('SLASH', 0, 'PT', `Rejected: ${id}`); }
        return { ...p, votesFor, votesAgainst, status };
      }
      return p;
    }));
  };

  const handlePayout = (projectId: string) => {
    if (isPaused || !walletAddress) return;
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.status === 'VALIDATED') {
        setBalancePT(b => b + p.tokensRewarded);
        setTotalRewardedPT(t => t + p.tokensRewarded);
        addLog('MINT', p.tokensRewarded, 'PT', `Disbursement: ${projectId}`);
        return { ...p, status: 'PAID' };
      }
      return p;
    }));
  };

  const handleExchange = (amount: number, side: 'BUY' | 'SELL') => {
    if (side === 'SELL') {
      const calc = ProtocolService.calculateSwap(amount, ptPrice);
      if (!ProtocolService.verifySolvency(calc.usdcValue, treasuryUSDC)) return alert("Treasury Limit Reached");
      setBalancePT(p => p - amount);
      setBalanceUSDC(u => u + calc.usdcValue);
      setTreasuryUSDC(t => t - calc.usdcValue);
      addLog('PAYOUT', calc.usdcValue, 'USDC', 'Market Exit Executed');
    } else {
      const usdcCost = amount * ptPrice;
      if (balanceUSDC < usdcCost) return alert("Insufficient USDC");
      setBalanceUSDC(u => u - usdcCost);
      setBalancePT(p => p + amount);
      setTreasuryUSDC(t => t + usdcCost);
      addLog('BRIDGE', amount, 'PT', 'Market Stake Acquired');
    }
  };

  const handleFundUSDC = (amount: number) => {
    setBalanceUSDC(b => b + amount);
    addLog('BRIDGE', amount, 'USDC', 'Global Liquidity Bridge');
  };

  const handleVoteProposal = (id: string, side: 'FOR' | 'AGAINST') => {
    if (isPaused || !walletAddress) return;
    if (!canVote) {
      alert("Eligibility Restricted: Level 2+ Required for Governance.");
      return;
    }
    setProposals(prev => prev.map(p => {
      if (p.id === id && p.status === 'ACTIVE') {
        const weight = currentTier === IdentityTier.INSTITUTION ? 500 : 100;
        const newVotesFor = side === 'FOR' ? p.votesFor + weight : p.votesFor;
        const newVotesAgainst = side === 'AGAINST' ? p.votesAgainst + weight : p.votesAgainst;
        
        let newStatus: DAOProposal['status'] = p.status;
        if (newVotesFor > 50000) newStatus = 'PASSED';
        if (newVotesAgainst > 50000) newStatus = 'FAILED';

        addLog('VOTE', 0, 'PT', `Voted ${side} on ${id}`);
        return { ...p, votesFor: newVotesFor, votesAgainst: newVotesAgainst, status: newStatus };
      }
      return p;
    }));
  };

  const handleCreateProposal = (data: Partial<DAOProposal>) => {
    const newProposal: DAOProposal = {
      id: `PIP-${Math.floor(Math.random() * 900) + 100}`,
      title: data.title || 'Untitled Proposal',
      description: data.description || '',
      category: data.category || 'TREASURY',
      deadline: data.deadline || Date.now() + 604800000,
      status: 'ACTIVE',
      votesFor: 0,
      votesAgainst: 0,
      proposer: walletAddress?.slice(0, 6) || 'Unknown'
    };
    setProposals(prev => [newProposal, ...prev]);
    setBalancePT(prev => prev - 500); // 500 PT Stake requirement
    addLog('STAKE', 500, 'PT', `Governance Stake: ${newProposal.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0c] text-slate-200">
      <Header 
        balancePT={balancePT} balanceUSDC={balanceUSDC} walletAddress={walletAddress}
        onConnect={handleConnect} onDisconnect={handleDisconnect}
        onOpenExchange={() => setIsExchangeOpen(true)}
        onOpenBridge={() => setIsFundingOpen(true)}
        isEligible={currentTier !== IdentityTier.UNVERIFIED}
      />
      
      {isPaused && (
        <div className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.3em] py-2.5 text-center animate-pulse z-[60] border-b border-rose-400/20">
          PROTOCOL EMERGENCY CIRCUIT BREAKER ACTIVE: ASSETS FROZEN
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full">
        {!walletAddress ? (
          <div className="flex flex-col items-center py-20 animate-in fade-in duration-1000">
             <div className="bg-blue-600/10 p-8 rounded-full border border-blue-500/20 mb-8 shadow-2xl shadow-blue-900/40">
                <Icons.Shield />
             </div>
             <h2 className="text-5xl font-black text-white uppercase tracking-tight mb-4 text-center">Peace-Token Platform</h2>
             <p className="text-slate-500 text-xl text-center max-w-xl mb-12">The world's first production-grade protocol for incentivized conflict resolution and peace verification.</p>
             <button onClick={handleConnect} className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/60 transition-all hover:-translate-y-1 active:scale-95">
                Initialize Secure Node
             </button>
             <div className="mt-20 flex gap-8 border-t border-white/5 pt-10">
               <button onClick={() => setIsUserGuideOpen(true)} className="text-[10px] font-black uppercase text-blue-400 tracking-widest hover:text-white transition-colors">Documentation</button>
               <button onClick={downloadWhitePaper} className="text-[10px] font-black uppercase text-slate-500 tracking-widest hover:text-white transition-colors">White-paper</button>
               <button onClick={() => setIsComplianceOpen(true)} className="text-[10px] font-black uppercase text-slate-500 tracking-widest hover:text-white transition-colors">Compliance Audit</button>
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
            {/* TOP BAR / OBSERVE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Mission Control</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-500/20">
                        <div className="status-pulse scale-50"></div> NODE 0x..77 SYNCED
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        Latency: {health.oracleLatency}ms | Solvency: 100%
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsGuardianTerminalOpen(true)} className="px-4 py-2 bg-amber-600/10 text-amber-500 border border-amber-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:bg-amber-500 hover:text-black">Guardian Portal</button>
                <button onClick={() => setIsFundingOpen(true)} className="px-4 py-2 glass-panel hover:bg-emerald-600/10 hover:text-emerald-400 border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Liquidity Bridge</button>
                <button onClick={() => setIsUserGuideOpen(true)} className="px-4 py-2 glass-panel hover:bg-blue-600/10 hover:text-blue-400 border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Protocol Guide</button>
                
                {/* Panic Button: Restricted strictly to authenticated System Guardians */}
                {activeGuardianId && (
                  <button onClick={() => setIsPaused(!isPaused)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border shadow-lg ${isPaused ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/40' : 'bg-rose-900/60 border-rose-500 text-rose-200 hover:bg-rose-500 hover:text-white shadow-rose-900/40 animate-pulse'}`}>
                    {isPaused ? 'RESUME PROTOCOL' : 'PANIC REVERT'}
                  </button>
                )}
              </div>
            </div>

            <DashboardStats treasury={treasuryUSDC} totalRewarded={totalRewardedPT} ptPrice={ptPrice} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <ProjectSubmission onValidated={handleProjectValidated} userTier={currentTier} />
                <PayoutLedger projects={projects} onPayout={handlePayout} onVote={handleProjectVote} userTier={currentTier} ptPrice={ptPrice} />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <IdentityVerification 
                  currentTier={currentTier} 
                  isDiscordLinked={isDiscordLinked} 
                  onTierUpgrade={setCurrentTier} 
                  onLinkDiscord={() => setIsDiscordLinked(true)} 
                  onInstitutionalRequest={handleInstitutionalRequest}
                  approvalStatus={institutionalRequests.find(r => r.entityName === "SIMULATED_ENTITY_01")?.status}
                />
                <CommunityWidget isDiscordLinked={isDiscordLinked} onLinkDiscord={() => setIsDiscordLinked(true)} />
                <div className="glass-panel p-6 rounded-3xl border border-white/10">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <Icons.Vote /> DAO GOVERNANCE
                      </h3>
                      <button 
                        onClick={() => setIsNewProposalOpen(true)}
                        className="text-[9px] font-black uppercase text-blue-400 border border-blue-400/20 px-2 py-1 rounded hover:bg-blue-400 hover:text-black transition-all"
                      >
                        + New Proposal
                      </button>
                   </div>
                   <div className="space-y-4">
                      {proposals.map(p => (
                        <ProposalCard 
                          key={p.id} 
                          proposal={p} 
                          onVote={handleVoteProposal} 
                          onExecute={id => addLog('MINT', 0, 'PT', `Executed ${id}`)} 
                          canVote={canVote}
                        />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <ExchangeModal 
        isOpen={isExchangeOpen} onClose={() => setIsExchangeOpen(false)}
        balancePT={balancePT} balanceUSDC={balanceUSDC} ptPrice={ptPrice}
        onExchange={handleExchange} onOpenBridge={() => { setIsExchangeOpen(false); setIsFundingOpen(true); }}
      />
      <FundingModal isOpen={isFundingOpen} onClose={() => setIsFundingOpen(false)} onFund={handleFundUSDC} />
      <UserGuideModal isOpen={isUserGuideOpen} onClose={() => setIsUserGuideOpen(false)} />
      <ComplianceModal isOpen={isComplianceOpen} onClose={() => setIsComplianceOpen(false)} treasuryUSDC={treasuryUSDC} />
      
      <GuardianTerminal 
        isOpen={isGuardianTerminalOpen} 
        onClose={() => setIsGuardianTerminalOpen(false)} 
        pendingRequests={institutionalRequests.filter(r => r.status === 'PENDING')}
        onSign={handleGuardianSign}
        activeGuardianId={activeGuardianId}
        onAuth={handleGuardianAuth}
      />

      <NewProposalModal 
        isOpen={isNewProposalOpen} 
        onClose={() => setIsNewProposalOpen(false)} 
        onSubmit={handleCreateProposal}
        userTier={currentTier}
      />

      {/* Persistence Hook for Sync */}
      <footer className="max-w-7xl mx-auto w-full px-8 py-4 flex justify-between items-center text-[9px] text-slate-600 font-mono uppercase">
         <div className="flex items-center gap-4">
            <span>© 2025 Peace-Token Protocol | v4.2</span>
            {activeGuardianId && (
              <span className="text-amber-500 font-black animate-pulse flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> GUARDIAN SESSION ACTIVE: {activeGuardianId}
              </span>
            )}
         </div>
         <div className="flex gap-4">
            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div> LEDGER SYNCED</span>
            <span className="cursor-help hover:text-amber-500" onClick={() => setIsGuardianTerminalOpen(true)}>GUARDIAN_GATEWAY_AUTH</span>
         </div>
      </footer>
    </div>
  );
};

export default App;
