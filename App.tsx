
import React, { useState, useEffect } from 'react';
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
  
  const [treasury, setTreasury] = useState(TOKENOMICS.TARGET_MARKET_CAP * TOKENOMICS.ALLOCATION.DAO); 
  const [totalRewarded, setTotalRewarded] = useState(0);
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balancePT, setBalancePT] = useState(0);
  const [balanceUSDC, setBalanceUSDC] = useState(190.00); 
  
  // Market & UI State
  const [ptPrice, setPtPrice] = useState(TOKENOMICS.INITIAL_PRICE_USDC); 
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isFundingOpen, setIsFundingOpen] = useState(false);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setPtPrice(prev => {
        const drift = (Math.random() - 0.45) * 0.001; 
        return Math.max(0.15, prev + drift);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    const tieredReward = ProtocolService.calculateReward(newProject.tokensRewarded, currentTier);
    const finalProject = { ...newProject, tokensRewarded: tieredReward, usdcValue: tieredReward * ptPrice };
    setProjects(prev => [finalProject, ...prev]);
    addLog('MINT', 0, 'PT'); 
  };

  const handleProjectVote = (id: string, side: 'FOR' | 'AGAINST') => {
    if (isPaused || !walletAddress) return;
    const VOTE_QUOTA = 5;
    setProjects(prev => prev.map(p => {
      if (p.id === id && p.status === 'VOTING') {
        const newVotesFor = side === 'FOR' ? p.votesFor + 1 : p.votesFor;
        const newVotesAgainst = side === 'AGAINST' ? p.votesAgainst + 1 : p.votesAgainst;
        let newStatus: PeaceProject['status'] = p.status;
        if (newVotesFor >= VOTE_QUOTA) { newStatus = 'VALIDATED'; addLog('VOTE', 0, 'PT'); }
        else if (newVotesAgainst >= VOTE_QUOTA) { newStatus = 'REJECTED'; }
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
    setProposals(prev => prev.map(p => p.id === id ? { ...p, votesFor: side === 'FOR' ? p.votesFor + 1250 : p.votesFor, votesAgainst: side === 'AGAINST' ? p.votesAgainst + 1250 : p.votesAgainst } : p));
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

  const handleExchange = (amount: number, side: 'BUY' | 'SELL') => {
    if (side === 'SELL') {
      const swap = ProtocolService.calculateSwap(amount, ptPrice);
      if (!ProtocolService.verifySolvency(swap.usdcValue, treasury)) { alert("SOLVENCY ERROR"); return; }
      setBalancePT(prev => prev - amount);
      setBalanceUSDC(prev => prev + swap.usdcValue);
      setTreasury(prev => prev - swap.usdcValue);
      addLog('PAYOUT', swap.usdcValue, 'USDC');
    } else {
      const calc = ProtocolService.calculateBuy(amount * ptPrice, ptPrice); // amount here is final PT requested
      const usdcCost = amount * ptPrice;
      setBalanceUSDC(prev => prev - usdcCost);
      setBalancePT(prev => prev + amount);
      setTreasury(prev => prev + usdcCost);
      addLog('MINT', amount, 'PT');
    }
  };

  const handleFundUSDC = (amount: number) => {
    setBalanceUSDC(prev => prev + amount);
    addLog('PAYOUT', amount, 'USDC'); // Simulating bridge deposit
  };

  const addLog = (type: any, amount: number, currency: any) => {
    const newLog: TransactionLog = {
      id: Math.random().toString(36).substr(2, 9),
      type, amount, currency, timestamp: Date.now(), status: 'SUCCESS',
      txHash: ProtocolService.generateTxHash()
    };
    setLogs(prev => [newLog, ...prev.slice(0, 14)]);
  };

  const togglePause = () => {
    if (!walletAddress || currentTier !== IdentityTier.INSTITUTION) return;
    setIsPaused(!isPaused);
    addLog('STAKE', 0, 'PT');
  };

  const isArchitect = currentTier === IdentityTier.INSTITUTION;

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      <Header 
        balancePT={balancePT} balanceUSDC={balanceUSDC} walletAddress={walletAddress}
        onConnect={handleConnect} onOpenExchange={() => setIsExchangeOpen(true)}
        onOpenBridge={() => setIsFundingOpen(true)}
        isEligible={currentTier !== IdentityTier.UNVERIFIED}
      />
      
      {isPaused && (
        <div className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.3em] py-2.5 text-center animate-pulse sticky top-16 z-50 border-b border-rose-400/20">
          PROTOCOL EMERGENCY CIRCUIT BREAKER ACTIVE
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {!walletAddress ? (
          <div className="flex flex-col items-center py-12 space-y-16 animate-in fade-in duration-700">
             <div className="flex flex-col items-center space-y-8 text-center max-w-2xl">
                <div className="bg-blue-600/10 p-6 rounded-full border border-blue-500/20 shadow-2xl shadow-blue-900/20">
                   <Icons.Shield />
                </div>
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-4">Peace-Token Protocol</h2>
                   <p className="text-slate-400 text-lg leading-relaxed">A mission-critical decentralized ledger for verifying and rewarding global peace-building efforts.</p>
                </div>
                <button onClick={handleConnect} className="px-16 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/60 transition-all active:scale-95 group">
                   Initialize Persistent Node <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
             </div>
             <div className="flex items-center gap-8 border-t border-white/5 pt-6 w-full justify-center">
               <button onClick={() => setIsUserGuideOpen(true)} className="text-blue-400 hover:text-blue-300 text-[9px] font-black uppercase tracking-widest text-center">Documentation</button>
               <button onClick={downloadWhitePaper} className="text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest text-center">White-paper</button>
             </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">Mission Control</h2>
                <p className="text-slate-400 text-sm">USDC Reserves: ${treasury.toLocaleString()} | PT Market: ${ptPrice.toFixed(4)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setIsFundingOpen(true)} className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/10 transition-all">
                  Liquidity Bridge
                </button>
                {isArchitect && (
                  <button onClick={togglePause} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${isPaused ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-rose-900/20 border-rose-500/20 text-rose-500'}`}>
                    {isPaused ? 'RESUME' : 'PANIC'}
                  </button>
                )}
              </div>
            </div>

            <DashboardStats treasury={treasury} totalRewarded={totalRewarded} ptPrice={ptPrice} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-8">
                <ProjectSubmission onValidated={handleProjectValidated} userTier={currentTier} />
                <PayoutLedger projects={projects} onPayout={handlePayout} onVote={handleProjectVote} userTier={currentTier} ptPrice={ptPrice} />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-8">
                <IdentityVerification currentTier={currentTier} isDiscordLinked={isDiscordLinked} onTierUpgrade={handleTierUpgrade} onLinkDiscord={handleLinkDiscord} />
                <CommunityWidget isDiscordLinked={isDiscordLinked} onLinkDiscord={handleLinkDiscord} />
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h2 className="text-lg font-bold text-white mb-6">DAO Governance</h2>
                  <div className="space-y-4">
                    {proposals.map((p) => <ProposalCard key={p.id} proposal={p} onVote={handleVote} onExecute={handleExecute} />)}
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
    </div>
  );
};

export default App;
