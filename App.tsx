
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

const PERSISTENCE_VERSION = 'PEACE_PROTOCOL_V4_PROD_R2';

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
  const [treasuryPT, setTreasuryPT] = useState(TOKENOMICS.TOTAL_SUPPLY * TOKENOMICS.ALLOCATION.DAO);
  const [rewardPoolPT, setRewardPoolPT] = useState(TOKENOMICS.TOTAL_SUPPLY * TOKENOMICS.ALLOCATION.REWARDS);
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
    securityPosture: 'HIGH',
    rewardPoolStatus: 'NORMAL'
  });

  // --- UI STATE ---
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isFundingOpen, setIsFundingOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);

  const successfulProjectsCount = useMemo(() => 
    projects.filter(p => p.status === 'PAID').length, 
  [projects]);

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

  // Update Reward Pool Health based on balance
  useEffect(() => {
    const totalPossible = TOKENOMICS.TOTAL_SUPPLY * TOKENOMICS.ALLOCATION.REWARDS;
    const ratio = rewardPoolPT / totalPossible;
    let status: SystemHealth['rewardPoolStatus'] = 'NORMAL';
    if (ratio < 0.05) status = 'CRITICAL';
    else if (ratio < 0.15) status = 'LOW';
    setHealth(h => ({ ...h, rewardPoolStatus: status }));
  }, [rewardPoolPT]);

  // --- PERSISTENCE ---
  useEffect(() => {
    const raw = localStorage.getItem(PERSISTENCE_VERSION);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setProjects(data.projects || []);
        setLogs(data.logs || []);
        setTreasuryUSDC(data.treasuryUSDC || 76000000);
        setTreasuryPT(data.treasuryPT || 400000000);
        setRewardPoolPT(data.rewardPoolPT || 500000000);
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
    const state = { projects, logs, treasuryUSDC, treasuryPT, rewardPoolPT, totalRewardedPT, balancePT, balanceUSDC, currentTier, isDiscordLinked, walletAddress, institutionalRequests, proposals };
    localStorage.setItem(PERSISTENCE_VERSION, JSON.stringify(state));
  }, [projects, logs, treasuryUSDC, treasuryPT, rewardPoolPT, totalRewardedPT, balancePT, balanceUSDC, currentTier, isDiscordLinked, walletAddress, institutionalRequests, proposals]);

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
    addLog('STAKE', 0, 'PT', `Institutional Audit Queued: ${req.entityName}`);
  };

  const handleGuardianSign = (requestId: string, guardianId: string) => {
    setInstitutionalRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const newSigs = req.signatures.includes(guardianId) ? req.signatures : [...req.signatures, guardianId];
        const isApprovedNow = newSigs.length >= 4;
        const newStatus = isApprovedNow ? 'APPROVED' : req.status;
        if (newStatus === 'APPROVED' && req.status !== 'APPROVED') {
           addLog('MINT', 0, 'PT', `Level 3 Quorum Reached: ${req.entityName}`);
        }
        return { ...req, signatures: newSigs, status: newStatus as any };
      }
      return req;
    }));
  };

  const handleGuardianAuth = (id: string | null) => {
    setActiveGuardianId(id);
    if (id) addLog('STAKE', 0, 'PT', `Guardian Access Authenticated: ${id}`);
  };

  const handleProjectValidated = (newProject: PeaceProject) => {
    if (isPaused || !walletAddress) return;
    const finalTokens = ProtocolService.calculateReward(newProject.tokensRewarded, currentTier, newProject.impactScore);
    const enriched = { ...newProject, tokensRewarded: finalTokens, usdcValue: finalTokens * ptPrice };
    setProjects(prev => [enriched, ...prev]);
    addLog('MINT', 0, 'PT', `Evidence Logged: ${newProject.id}`);
  };

  const handleProjectVote = (id: string, side: 'FOR' | 'AGAINST') => {
    if (isPaused || !walletAddress) return;
    setProjects(prev => prev.map(p => {
      if (p.id === id && p.status === 'VOTING') {
        const votesFor = side === 'FOR' ? p.votesFor + 1 : p.votesFor;
        const votesAgainst = side === 'AGAINST' ? p.votesAgainst + 1 : p.votesAgainst;
        let status: ProjectStatus = p.status;
        if (votesFor >= 5) status = 'VALIDATED';
        else if (votesAgainst >= 3) status = 'REJECTED';
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
        setRewardPoolPT(r => r - p.tokensRewarded);
        setTotalRewardedPT(t => t + p.tokensRewarded);
        addLog('MINT', p.tokensRewarded, 'PT', `Impact Reward Claimed: ${projectId}`);
        return { ...p, status: 'PAID' };
      }
      return p;
    }));
  };

  const handleExchange = (amount: number, side: 'BUY' | 'SELL') => {
    if (side === 'SELL') {
      const calc = ProtocolService.calculateSwap(amount, ptPrice);
      setBalancePT(p => p - amount);
      setBalanceUSDC(u => u + calc.usdcValue);
      setTreasuryUSDC(t => t - calc.usdcValue);
      addLog('PAYOUT', calc.usdcValue, 'USDC', 'Market Exit');
    } else {
      const usdcCost = amount * ptPrice;
      if (balanceUSDC < usdcCost) return;
      setBalanceUSDC(u => u - usdcCost);
      setBalancePT(p => p + amount);
      setTreasuryUSDC(t => t + usdcCost);
      addLog('BRIDGE', amount, 'PT', 'Asset Acquisition');
    }
  };

  const handleFundUSDC = (amount: number) => {
    setBalanceUSDC(b => b + amount);
    addLog('BRIDGE', amount, 'USDC', 'Global Liquidity Injection');
  };

  const handleVoteProposal = (id: string, side: 'FOR' | 'AGAINST') => {
    if (isPaused || !walletAddress || !canVote) return;
    setProposals(prev => prev.map(p => {
      if (p.id === id && p.status === 'ACTIVE') {
        const weight = currentTier === IdentityTier.INSTITUTION ? 500 : 100;
        const newVotesFor = side === 'FOR' ? p.votesFor + weight : p.votesFor;
        const newVotesAgainst = side === 'AGAINST' ? p.votesAgainst + weight : p.votesAgainst;
        let newStatus: DAOProposal['status'] = p.status;
        if (newVotesFor > 50000) newStatus = 'PASSED';
        if (newVotesAgainst > 50000) newStatus = 'FAILED';
        return { ...p, votesFor: newVotesFor, votesAgainst: newVotesAgainst, status: newStatus };
      }
      return p;
    }));
  };

  const handleExecuteProposal = (id: string) => {
    setProposals(prev => prev.map(p => {
      if (p.id === id && p.status === 'PASSED') {
        if (p.category === 'TREASURY' && p.description.toLowerCase().includes('refill')) {
           const refillAmount = p.targetAmount || 50000000;
           setTreasuryPT(t => t - refillAmount);
           setRewardPoolPT(r => r + refillAmount);
           addLog('RE_ALLOCATION', refillAmount, 'PT', 'Reward Pool Refill');
        }
        return { ...p, status: 'EXECUTED' };
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
      targetAmount: data.targetAmount,
      proposer: walletAddress?.slice(0, 6) || 'Unknown'
    };
    setProposals(prev => [newProposal, ...prev]);
    setBalancePT(prev => prev - 500); 
    addLog('STAKE', 500, 'PT', `PIP Stake: ${newProposal.id}`);
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
          /* --- ENHANCED LANDING PAGE --- */
          <div className="space-y-16 py-10 animate-in fade-in duration-1000">
            {/* HERO SECTION */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-600/10 p-10 rounded-full border border-blue-500/20 mb-8 shadow-2xl shadow-blue-900/40 relative group">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping opacity-20"></div>
                <Icons.Shield />
              </div>
              <h2 className="text-6xl font-black text-white uppercase tracking-tight mb-4 text-center leading-[0.9]">
                Peace-Token <br/><span className="text-blue-500">Protocol</span>
              </h2>
              <p className="text-slate-500 text-xl text-center max-w-xl mb-12">The world's first production-grade protocol for incentivized conflict resolution and peace verification.</p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-16">
                <button onClick={handleConnect} className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/60 transition-all hover:-translate-y-1 active:scale-95">
                  Initialize Secure Node
                </button>
                <button onClick={() => setIsUserGuideOpen(true)} className="px-12 py-5 glass-panel text-white hover:bg-white/5 rounded-2xl text-sm font-black uppercase tracking-[0.4em] transition-all active:scale-95">
                  Review Briefing
                </button>
              </div>
            </div>

            {/* QUICK-LOOK FAQ & LOGIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all group">
                <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3">01. Social Scalability</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Proof-of-Participation (PoP) requires Level 1 users to log 7 verified impact acts before attaining Expert status.</p>
              </div>
              <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">02. Economic Stake</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Level 2 Mediation requires 1,000 PT collateral to ensure 'Skin in the Game' and liability for malicious audits.</p>
              </div>
              <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all group">
                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3">03. Institutional Quorum</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Level 3 Entities bypass common hurdles through a 4-of-7 Guardian Consensus audit, the protocol's highest hurdle.</p>
              </div>
            </div>

            {/* RESOURCE HUB */}
            <div className="flex flex-col items-center">
              <div className="h-px w-24 bg-white/10 mb-8"></div>
              <div className="flex flex-wrap justify-center gap-12">
                <button onClick={() => setIsUserGuideOpen(true)} className="group flex flex-col items-center gap-3">
                   <div className="text-[10px] font-black uppercase text-blue-400 tracking-widest group-hover:text-white transition-colors">User Guide & FAQs</div>
                   <div className="text-[8px] text-slate-600 font-mono uppercase">Read Operations Manual</div>
                </button>
                <button onClick={downloadWhitePaper} className="group flex flex-col items-center gap-3">
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-hover:text-white transition-colors">Protocol White-paper</div>
                   <div className="text-[8px] text-slate-600 font-mono uppercase">Download PDF Briefing</div>
                </button>
                <button onClick={() => setIsComplianceOpen(true)} className="group flex flex-col items-center gap-3">
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-hover:text-white transition-colors">Compliance Vault</div>
                   <div className="text-[8px] text-slate-600 font-mono uppercase">Verify Solvency Ledger</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* --- DASHBOARD VIEW --- */
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Mission Control</h2>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-500/20">
                      <div className="status-pulse scale-50"></div> NODE 0x..77 SYNCED
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsGuardianTerminalOpen(true)} className="px-4 py-2 bg-amber-600/10 text-amber-500 border border-amber-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:bg-amber-500 hover:text-black">Guardian Portal</button>
                <button onClick={() => setIsUserGuideOpen(true)} className="px-4 py-2 glass-panel hover:bg-blue-600/10 hover:text-blue-400 border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Protocol Guide</button>
              </div>
            </div>

            <DashboardStats 
              treasury={treasuryUSDC} 
              totalRewarded={totalRewardedPT} 
              ptPrice={ptPrice} 
              rewardPoolPT={rewardPoolPT}
              health={health}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <ProjectSubmission onValidated={handleProjectValidated} userTier={currentTier} poolHealth={health.rewardPoolStatus} />
                <PayoutLedger projects={projects} onPayout={handlePayout} onVote={handleProjectVote} userTier={currentTier} ptPrice={ptPrice} />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <IdentityVerification 
                  currentTier={currentTier} 
                  balancePT={balancePT}
                  successfulProjectsCount={successfulProjectsCount}
                  isDiscordLinked={isDiscordLinked} 
                  onTierUpgrade={setCurrentTier} 
                  onLinkDiscord={() => setIsDiscordLinked(true)} 
                  onInstitutionalRequest={handleInstitutionalRequest}
                  approvalStatus={institutionalRequests.find(r => r.entityName === "SIMULATED_ENTITY_01")?.status}
                />
                <CommunityWidget isDiscordLinked={isDiscordLinked} onLinkDiscord={() => setIsDiscordLinked(true)} />
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
    </div>
  );
};

export default App;
