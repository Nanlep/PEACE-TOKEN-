
import React, { useState, useRef, useEffect } from 'react';
import { IdentityTier, InstitutionalRequest } from '../types';
import { Icons, GUARDIAN_REGISTRY } from '../constants';
import { auditInstitutionalIdentity } from '../services/geminiService';

interface IdentityVerificationProps {
  currentTier: IdentityTier;
  isDiscordLinked: boolean;
  onTierUpgrade: (newTier: IdentityTier) => void;
  onLinkDiscord: () => void;
  onInstitutionalRequest: (req: InstitutionalRequest) => void;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

type VerificationStatus = 'IDLE' | 'AI_AUDIT' | 'AWAITING_GUARDIAN' | 'GUARDIAN_SIGNING' | 'FINALIZED';

interface SignatureEvent {
  guardianId: string;
  hash: string;
  timestamp: number;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ 
  currentTier, 
  isDiscordLinked,
  onTierUpgrade,
  onLinkDiscord,
  onInstitutionalRequest,
  approvalStatus
}) => {
  const [status, setStatus] = useState<VerificationStatus>('IDLE');
  const [activeTab, setActiveTab] = useState<IdentityTier>(currentTier);
  const [showCamera, setShowCamera] = useState(false);
  const [auditLog, setAuditLog] = useState<string | null>(null);
  const [guardianProgress, setGuardianProgress] = useState(0);
  const [signedCount, setSignedCount] = useState(0);
  const [signatureLogs, setSignatureLogs] = useState<SignatureEvent[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (approvalStatus === 'APPROVED' && currentTier !== IdentityTier.INSTITUTION) {
      finalizeUpgrade(IdentityTier.INSTITUTION);
    }
  }, [approvalStatus]);

  const tierMetadata = {
    [IdentityTier.UNVERIFIED]: { label: 'Level 0: Guest', req: 'Node Access', perks: 'ReadOnly Access', multiplier: '0.1x', color: 'text-slate-400' },
    [IdentityTier.VERIFIED]: { label: 'Level 1: Verified Actor', req: 'Discord + Wallet Link', perks: 'Submit Evidence, 1:1 Rewards', multiplier: '1.0x', color: 'text-blue-400' },
    [IdentityTier.EXPERT]: { label: 'Level 2: Expert Mediator', req: 'Biometric + 1k PT Stake', perks: 'DAO Voting, 2.5x Rewards', multiplier: '2.5x', color: 'text-purple-400' },
    [IdentityTier.INSTITUTION]: { label: 'Level 3: Strategic Institution', req: 'Guardian Approval Form', perks: 'Treasury Grants, 5.0x Rewards', multiplier: '5.0x', color: 'text-emerald-400' }
  };

  const startLivenessCheck = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setShowCamera(false);
        finalizeUpgrade(IdentityTier.EXPERT);
      }, 3000);
    } catch (err) {
      alert("Camera access denied. Biometric verification is mandatory for Expert tier.");
      setShowCamera(false);
    }
  };

  const runInstitutionalAudit = async () => {
    setStatus('AI_AUDIT');
    setAuditLog("Initializing Oracle Compliance Check...");
    
    const result = await auditInstitutionalIdentity(
      "SIMULATED_ENTITY_01",
      "0x" + Math.random().toString(16).substr(2, 64)
    );

    setAuditLog(result.reasoning);

    setTimeout(() => {
      if (result.isApproved) {
        const newReq: InstitutionalRequest = {
           id: 'REQ-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
           entityName: "SIMULATED_ENTITY_01",
           credentialsHash: "0x" + Math.random().toString(16).substr(2, 32),
           timestamp: Date.now(),
           signatures: [],
           status: 'PENDING'
        };
        onInstitutionalRequest(newReq);
        setStatus('AWAITING_GUARDIAN');
      } else {
        alert("AUDIT REJECTED: " + result.reasoning);
        setStatus('IDLE');
        setAuditLog(null);
      }
    }, 3000);
  };

  const finalizeUpgrade = (targetTier: IdentityTier) => {
    setStatus('AI_AUDIT'); // Generic processing
    setAuditLog("Finalizing State Transition on Ledger...");
    setTimeout(() => {
      onTierUpgrade(targetTier);
      setActiveTab(targetTier);
      setStatus('IDLE');
      setAuditLog(null);
      setSignatureLogs([]);
    }, 2000);
  };

  const handleUpgrade = (targetTier: IdentityTier) => {
    if (targetTier === IdentityTier.VERIFIED && !isDiscordLinked) {
      alert("Protocol Violation: Discord Identity Link required for Level 1.");
      return;
    }
    
    if (targetTier === IdentityTier.EXPERT) {
      startLivenessCheck();
      return;
    }

    if (targetTier === IdentityTier.INSTITUTION) {
      runInstitutionalAudit();
      return;
    }

    finalizeUpgrade(targetTier);
  };

  const isProcessing = status === 'AI_AUDIT';

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
      {isProcessing && (
        <div className="absolute inset-0 bg-[#0a0a0c]/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-4 px-6 text-center">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest">
              {auditLog ? 'ORACLE COMPLIANCE AUDIT' : 'GENERATING ZK-PROOF'}
            </p>
            <p className="text-[10px] text-slate-500 mono mt-1">
              {auditLog || 'State Migration in Progress...'}
            </p>
          </div>
        </div>
      )}

      {showCamera && (
        <div className="absolute inset-0 bg-black z-40 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 rounded-full border-2 border-blue-500 overflow-hidden mb-4">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale" />
            <div className="absolute inset-0 border-[20px] border-black/50"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
          </div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">Scanning Liveness...</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-white">Identity SBT Protocol</h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Mission-Critical Auth</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-slate-500 font-bold uppercase mb-1">Current Class</span>
          <span className={`text-xs font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full ${tierMetadata[currentTier].color}`}>
            {currentTier}
          </span>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-lg border border-white/10">
        {[IdentityTier.UNVERIFIED, IdentityTier.VERIFIED, IdentityTier.EXPERT, IdentityTier.INSTITUTION].map((t) => (
          <button
            key={t}
            onClick={() => {
                if(status === 'IDLE') setActiveTab(t);
            }}
            className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter rounded-md transition-all ${
              activeTab === t ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            } ${status !== 'IDLE' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t.slice(0, 4)}
          </button>
        ))}
      </div>

      {status === 'AWAITING_GUARDIAN' ? (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
           <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                 <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Quorum Protocol Active</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                AI Audit: <span className="text-emerald-400 font-bold">PASSED</span>. Request has been broadcast to the Guardian Network. Awaiting 4 unique cryptographic attestations to proceed.
              </p>
              <div className="p-3 bg-black/40 rounded-lg border border-amber-500/10 flex items-center justify-center">
                 <p className="text-[9px] text-amber-500 font-mono uppercase animate-pulse">Awaiting Guardian Broadcast...</p>
              </div>
           </div>
           <button 
             disabled 
             className="w-full py-4 bg-slate-800 text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl cursor-wait"
           >
             Protocol Locked: Pending Quorum
           </button>
           <button 
             onClick={() => { setStatus('IDLE'); setAuditLog(null); }}
             className="w-full text-[9px] font-bold text-slate-500 uppercase hover:text-slate-400 transition-colors"
           >
             Cancel Institutional Audit
           </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Protocol Descriptor</span>
              <span className="text-sm text-white font-bold">{tierMetadata[activeTab].label}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Verification Gap</span>
              <span className={`text-[10px] font-mono ${activeTab === IdentityTier.VERIFIED && !isDiscordLinked ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                {activeTab === IdentityTier.VERIFIED && !isDiscordLinked ? 'Link Discord Account' : tierMetadata[activeTab].req}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Reward Multiplier</span>
              <span className="text-sm text-emerald-400 font-mono font-bold">{tierMetadata[activeTab].multiplier}</span>
            </div>
          </div>

          {activeTab !== currentTier ? (
            <button
              onClick={() => handleUpgrade(activeTab)}
              className={`w-full py-3 text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 ${
                activeTab === IdentityTier.VERIFIED && !isDiscordLinked 
                ? 'bg-rose-900/40 text-rose-400 border border-rose-500/30 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/40'
              }`}
            >
              {activeTab === IdentityTier.VERIFIED && !isDiscordLinked ? 'Verification Blocked' : (activeTab === IdentityTier.INSTITUTION ? 'REQUEST INSTITUTIONAL AUDIT' : 'Execute Tier Migration')}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
               <div className="status-pulse scale-75"></div>
               <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Class Synchronized</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IdentityVerification;
