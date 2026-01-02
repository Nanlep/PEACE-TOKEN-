
export enum IdentityTier {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  EXPERT = 'EXPERT',
  INSTITUTION = 'INSTITUTION'
}

export interface PeaceProject {
  id: string;
  title: string;
  description: string;
  author: string;
  tier: IdentityTier;
  impactScore: number;
  status: 'PENDING' | 'VOTING' | 'VALIDATED' | 'REJECTED' | 'PAID';
  evidenceHash: string;
  evidenceUrls: string[]; // Added for deep dive verification
  votesFor: number; // Community validation quota
  votesAgainst: number;
  timestamp: number;
  tokensRewarded: number;
  usdcValue: number;
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
  type: 'MINT' | 'VOTE' | 'PAYOUT' | 'STAKE';
  amount: number;
  currency: 'PT' | 'USDC';
  timestamp: number;
  status: 'SUCCESS' | 'REVERTED';
  txHash: string;
}

export interface UserProfile {
  address: string;
  tier: IdentityTier;
  reputation: number;
  balancePT: number;
  balanceUSDC: number;
  sbtTokenId: string | null;
}
