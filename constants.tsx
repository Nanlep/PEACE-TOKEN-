
import React from 'react';

export const COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  GUARDIAN: '#f59e0b', // Gold/Amber for high authority
  BG_DARK: '#0a0a0c',
  PANEL: 'rgba(255, 255, 255, 0.05)',
};

export const TOKENOMICS = {
  TOTAL_SUPPLY: 1000000000,
  INITIAL_PRICE_USDC: 0.19,
  ALLOCATION: {
    REWARDS: 0.50,
    DAO: 0.40,
    SYSTEM: 0.10,
  },
  TARGET_MARKET_CAP: 190000000,
};

export const GUARDIAN_REGISTRY = [
  { id: 'GUARDIAN-ALPHA', hash: '0x82f..41e', status: 'ACTIVE', entity: 'Peace-Token Foundation' },
  { id: 'GUARDIAN-BRAVO', hash: '0x19a..22c', status: 'ACTIVE', entity: 'Global Legal Audit Group' },
  { id: 'GUARDIAN-CHARLIE', hash: '0xbb2..901', status: 'ACTIVE', entity: 'Consensus Systems NGO' },
  { id: 'GUARDIAN-DELTA', hash: '0x77f..00a', status: 'ACTIVE', entity: 'UN-Affiliated Tech Lead' },
  { id: 'GUARDIAN-ECHO', hash: '0x92d..881', status: 'ACTIVE', entity: 'Disaster Recovery SRE' },
  { id: 'GUARDIAN-FOXTROT', hash: '0x44c..312', status: 'STANDBY', entity: 'Digital Sovereign Trust' },
  { id: 'GUARDIAN-GOLF', hash: '0xee1..55f', status: 'ACTIVE', entity: 'Institutional Liquidity Provider' }
];

export const SYSTEM_CONFIG = {
  REWARD_MULTIPLIERS: {
    [ 'UNVERIFIED' ]: 0.1,
    [ 'VERIFIED' ]: 1.0,
    [ 'EXPERT' ]: 2.5,
    [ 'INSTITUTION' ]: 5.0,
  },
  QUORUM_PERCENTAGE: 15,
  VOTING_PERIOD_DAYS: 7,
};

export const Icons = {
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Pulse: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
  Vote: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
  ),
  Token: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  ),
  Guardian: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
  ),
};
