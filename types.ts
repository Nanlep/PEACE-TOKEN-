
export enum IdentityTier {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  EXPERT = 'EXPERT',
  INSTITUTION = 'INSTITUTION'
}

export type ProjectStatus = 'PENDING' | 'VOTING' | 'VALIDATED' | 'REJECTED' | 'PAID' | 'SLASHED';

export interface PeaceProject {
  id: string;
  title: string;
  description: string;
  author: string;
  tier: IdentityTier;
  impactScore: number;
  status: ProjectStatus;
  evidenceHash: string;
  evidenceUrls: string[];
  votesFor: number;
  votesAgainst: number;
  timestamp: number;
  tokensRewarded: number;
  usdcValue: number;
  slashedAmount?: number;
}

export interface InstitutionalRequest {
  id: string;
  entityName: string;
  credentialsHash: string;
  timestamp: number;
  signatures: string[]; // List of Guardian IDs who signed
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface DAOProposal {
  id: string;
  title: string;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  status: 'ACTIVE' | 'PASSED' | 'FAILED' | 'EXECUTED';
  description: string;
  deadline: number;
  category: 'GOVERNANCE' | 'TREASURY' | 'TECHNICAL';
}

export interface TransactionLog {
  id: string;
  type: 'MINT' | 'VOTE' | 'PAYOUT' | 'STAKE' | 'SLASH' | 'BRIDGE';
  amount: number;
  currency: 'PT' | 'USDC';
  timestamp: number;
  status: 'SUCCESS' | 'REVERTED';
  txHash: string;
  metadata?: string;
}

export interface SystemHealth {
  oracleLatency: number;
  treasurySolvency: number;
  activeNodes: number;
  networkLoad: number;
  securityPosture: 'HIGH' | 'GUARDED' | 'ELEVATED' | 'CRITICAL';
}
