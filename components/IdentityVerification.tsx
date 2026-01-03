
import React, { useState, useRef, useEffect } from 'react';
import { IdentityTier, InstitutionalRequest, VerificationChallenge } from '../types';
import { Icons } from '../constants';
import { auditInstitutionalIdentity, auditWalletReputation, verifyLivenessChallenge } from '../services/geminiService';

interface IdentityVerificationProps {
  currentTier: IdentityTier;
  balancePT: number;
  successfulProjectsCount: number;
  isDiscordLinked: boolean;
  onTierUpgrade: (newTier: IdentityTier) => void;
  onLinkDiscord: () => void;
  onInstitutionalRequest: (req: InstitutionalRequest) => void;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

type VerificationStatus = 'IDLE' | 'AI_AUDIT' | 'AWAITING_GUARDIAN' | 'LIVENESS_CHALLENGE' | 'FINALIZING';

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ 
  currentTier, 
  balancePT,
  successfulProjectsCount,
  isDiscordLinked,
  onTierUpgrade,
  onLinkDiscord,
  onInstitutionalRequest,
  approvalStatus
}) => {
  const [status, setStatus] = useState<VerificationStatus>('IDLE');
  const [activeTab, setActiveTab] = useState<IdentityTier>(currentTier);
  const [challenge, setChallenge] = useState<VerificationChallenge | null>(null);
  const [auditLog, setAuditLog] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (approvalStatus === 'APPROVED' && currentTier !== IdentityTier.INSTITUTION) {
      finalizeUpgrade(IdentityTier.INSTITUTION);
    }
  }, [approvalStatus]);

  const tierMetadata = {
    [IdentityTier.UNVERIFIED]: { label: 'Level 0: Guest', req: 'Connect Wallet', perks: 'ReadOnly Access', multiplier: '0.1x', color: 'text-slate-400' },
    [IdentityTier.VERIFIED]: { label: 'Level 1: Verified Actor', req: 'Link Discord Identity', perks: 'Submit Impact Evidence', multiplier: '1.0x', color: 'text-blue-400' },
    [IdentityTier.EXPERT]: { label: 'Level 2: Expert Mediator', req: '1,000 PT + 7 Impact Reports', perks: 'DAO Voting Rights', multiplier: '2.5x', color: 'text-purple-400' },
    [IdentityTier.INSTITUTION]: { label: 'Level 3: Strategic Institution', req: 'Guardian Multi-Sig Quorum', perks: 'Treasury Grant Creation', multiplier: '5.0x', color: 'text-emerald-400' }
  };

  const isLevel2Eligible = currentTier === IdentityTier.VERIFIED && balancePT >= 1000 && successfulProjectsCount >= 7;
  const isLevel3Eligible = currentTier !== IdentityTier.INSTITUTION; // Institutions are handled via separate audit track

  const startLivenessChallenge = async () => {
    if (!isLevel2Eligible) return;
    setStatus('LIVENESS_CHALLENGE');
    const challenges = ["Tilt head right", "Blink twice", "Touch nose", "Look 45 deg left"];
    setChallenge({
      type: 'GESTURE',
      instruction: challenges[Math.floor(Math.random() * challenges.length)],
      challengeId: Math.random().toString(36).substr(2, 9)
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access required for Biometric Liveness.");
      setStatus('IDLE');
    }
  };

  const captureAndVerify = async () => {
    if (!videoRef.current || !canvasRef.current || !challenge) return;
    setAuditLog("Analyzing Biometric Authenticity...");
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx?.drawImage(videoRef.current, 0, 0);
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    const result = await verifyLivenessChallenge(base64, challenge.instruction);
    
    if (result.isVerified && result.confidence > 0.8) {
      finalizeUpgrade(IdentityTier.EXPERT);
    } else {
      alert("Verification Failed: Biometric mismatch detected.");
      setStatus('IDLE');
    }
  };

  const runInstitutionalAudit = async () => {
    setStatus('AI_AUDIT');
    setAuditLog("Conducting Institutional Forensic Audit...");
    const result = await auditInstitutionalIdentity("SIMULATED_ENTITY_01", "0x" + Math.random().toString(16).substr(2, 64));
    setAuditLog(result.reasoning);
    setTimeout(() => {
      if (result.isApproved) {
        onInstitutionalRequest({
           id: 'REQ-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
           entityName: "SIMULATED_ENTITY_01",
           credentialsHash: "0x" + Math.random().toString(16).substr(2, 32),
           timestamp: Date.now(),
           signatures: [],
           status: 'PENDING'
        });
        setStatus('AWAITING_GUARDIAN');
      } else {
        alert("Institutional rejection: " + result.reasoning);
        setStatus('IDLE');
      }
    }, 2000);
  };

  const runReputationAudit = async () => {
    if (!isDiscordLinked) return onLinkDiscord();
    setStatus('AI_AUDIT');
    setAuditLog("Auditing Social Cross-Link Reputation...");
    const result = await auditWalletReputation("0x" + Math.random().toString(16).substr(2, 40));
    setAuditLog(result.report);
    if (result.score >= 40) {
      setTimeout(() => finalizeUpgrade(IdentityTier.VERIFIED), 2000);
    } else {
      alert("Reputation Audit Failed: Low Trust Score.");
      setStatus('IDLE');
    }
  };

  const finalizeUpgrade = (targetTier: IdentityTier) => {
    setStatus('FINALIZING');
    setTimeout(() => {
      onTierUpgrade(targetTier);
      setActiveTab(targetTier);
      setStatus('IDLE');
      setChallenge(null);
    }, 2000);
  };

  const handleUpgradeTrigger = (targetTier: IdentityTier) => {
    if (targetTier === IdentityTier.VERIFIED) runReputationAudit();
    else if (targetTier === IdentityTier.EXPERT) startLivenessChallenge();
    else if (targetTier === IdentityTier.INSTITUTION) runInstitutionalAudit();
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden min-h-[440px]">
      {(status === 'AI_AUDIT' || status === 'FINALIZING' || status === 'AWAITING_GUARDIAN') && (
        <div className="absolute inset-0 bg-[#0a0a0c]/95 backdrop-blur-md z-[50] flex flex-col items-center justify-center space-y-6 px-8 text-center animate-in fade-in">
          {status === 'AWAITING_GUARDIAN' ? (
             <div className="status-pulse bg-amber-500 scale-150 mb-4"></div>
          ) : (
             <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-500 rounded-full animate-spin"></div>
          )}
          <div>
            <p className="text-xs font-black text-white uppercase tracking-[0.3em] mb-2">
              {status === 'AWAITING_GUARDIAN' ? 'PENDING GUARDIAN QUORUM' : 'Security Logic Execution'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono leading-relaxed">{auditLog || (status === 'AWAITING_GUARDIAN' ? 'Awaiting 4 of 7 signatures from registered System Guardians...' : 'Synchronizing Ledger...')}</p>
          </div>
          {status === 'AWAITING_GUARDIAN' && (
             <button onClick={() => setStatus('IDLE')} className="text-[9px] text-slate-500 uppercase font-black hover:text-white transition-colors">Cancel Request</button>
          )}
        </div>
      )}

      {status === 'LIVENESS_CHALLENGE' && (
        <div className="absolute inset-0 bg-black/98 z-[60] flex flex-col items-center justify-center p-6 space-y-6">
          <div className="relative w-full max-w-xs aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-blue-500/50">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale opacity-50" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
               <div className="w-32 h-32 border border-blue-500/20 rounded-full animate-pulse mb-4"></div>
               <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{challenge?.instruction}</p>
            </div>
          </div>
          <button onClick={captureAndVerify} className="w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-2xl shadow-blue-900/40">Capture Biometric Proof</button>
          <button onClick={() => setStatus('IDLE')} className="text-[9px] text-slate-500 font-bold uppercase hover:text-white transition-colors">Abort</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">Identity Enclave</h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Protocol Version 4.2</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-slate-500 font-black uppercase mb-1">Current Status</span>
          <span className={`text-xs font-black px-3 py-1 bg-white/5 border border-white/10 rounded-full ${tierMetadata[currentTier].color}`}>
            {currentTier}
          </span>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-xl border border-white/10">
        {[IdentityTier.UNVERIFIED, IdentityTier.VERIFIED, IdentityTier.EXPERT, IdentityTier.INSTITUTION].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter rounded-lg transition-all ${
              activeTab === t ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.slice(0, 4)}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
           <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 uppercase font-black tracking-widest text-[9px]">Upgrade Path</span>
              <span className="text-blue-400 font-bold">{tierMetadata[activeTab].req}</span>
           </div>
           
           {/* Level 2 Hurdle Progress */}
           {activeTab === IdentityTier.EXPERT && currentTier === IdentityTier.VERIFIED && (
             <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-slate-400">Wallet Balance (PT)</span>
                   <span className={balancePT >= 1000 ? 'text-emerald-400' : 'text-rose-400'}>{balancePT.toLocaleString()} / 1,000</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-slate-400">Successful Reports</span>
                   <span className={successfulProjectsCount >= 7 ? 'text-emerald-400' : 'text-rose-400'}>{successfulProjectsCount} / 7</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                   <div className="bg-blue-600 h-full transition-all" style={{ width: `${Math.min(100, (successfulProjectsCount / 7) * 100)}%` }}></div>
                </div>
             </div>
           )}

           <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-slate-500 uppercase font-black tracking-widest text-[9px]">Reward Yield</span>
              <span className="text-sm text-emerald-400 font-mono font-black">{tierMetadata[activeTab].multiplier}</span>
           </div>
        </div>

        {activeTab !== currentTier ? (
          <button
            onClick={() => handleUpgradeTrigger(activeTab)}
            disabled={(activeTab === IdentityTier.EXPERT && !isLevel2Eligible)}
            className={`w-full py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl ${
              (activeTab === IdentityTier.EXPERT && !isLevel2Eligible) 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 active:scale-95'
            }`}
          >
            {activeTab === IdentityTier.EXPERT && !isLevel2Eligible 
              ? 'Progression Locked' 
              : `Initialize ${activeTab} Upgrade`}
          </button>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-2">
             <div className="status-pulse bg-emerald-500"></div>
             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Credential Synchronized</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentityVerification;
