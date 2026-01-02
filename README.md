# Peace-Token Protocol: Production Deployment Guide

## 1. Executive Summary
The Peace-Token Protocol is a mission-critical infrastructure for verifying and rewarding global peace-building efforts. This document outlines the technical requirements and deployment procedures for a 24-hour high-availability live window.

## 2. System Architecture
### 2.1 Frontend (Presentation Layer)
- **Framework:** React 19 (ESM)
- **Styling:** Tailwind CSS (Atomic CSS Architecture)
- **Charts:** Recharts (Real-time Treasury & Impact Visualization)
- **State:** Deterministic React State Hooks with persistence readiness.

### 2.2 Oracle Layer (Verification)
- **Engine:** Gemini 3 Pro (Multimodal Reasoning)
- **Thinking Budget:** 4,000 tokens per validation.
- **Role:** Chief Validation Officer (CVO). Performs evidence-hash cross-referencing and impact scoring (0-100).

### 2.3 Identity & Reputation (SBT Layer)
- **Mechanism:** Soulbound Tokens (Non-transferable).
- **Tiers:** 
  - `Level 0 (Guest)`: Read-only access.
  - `Level 1 (Verified)`: Discord Link + Wallet Required.
  - `Level 2 (Expert)`: 3+ Validated Works + Governance Power.
  - `Level 3 (Institution)`: Legal Entity Audit + High-Volume Grants.

## 3. Deployment Configuration
### 3.1 Environment Variables
Ensure the following is configured in your production environment:
- `process.env.API_KEY`: Google Gemini Pro API Key (Required for Oracle functionality).

### 3.2 Security Guardrails
- **Panic Revert:** Accessible via "Mission Control". Immediately halts all `MINT`, `VOTE`, and `PAYOUT` operations.
- **Discord Integration:** Mandatory social verification for Level 1 tier upgrades to prevent bot-driven reward farming.
- **ZK-Proof Readiness:** All PII (Personal Identifiable Information) is handled off-chain; only hashes are stored on the global ledger.

## 4. 24-Hour Live Checklist
- [ ] **Node Sync:** Verify `Block Delay < 2.0s`.
- [ ] **Treasury Check:** Ensure USDC liquidity matches the Payout Ledger liabilities.
- [ ] **Oracle Latency:** Monitor Gemini API response times (Target: < 15s including thinking).
- [ ] **Community Sync:** Activate Discord Webhook for real-time event logging.
- [ ] **Compliance Audit:** Run `Generate Audit` from the dashboard to verify protocol invariants.

## 5. Reliability & SRE Targets
- **Target Uptime:** 99.99%
- **RPO (Recovery Point Objective):** ≤ 5 minutes.
- **RTO (Recovery Time Objective):** ≤ 15 minutes.
- **Incident Response:** Trigger "Panic Revert" if treasury volatility exceeds 15% in < 1 hour.

## 6. Developer Setup
1. Clone repository.
2. Run `npm install`.
3. Configure `API_KEY` in environment.
4. Launch via `npm run dev` for local staging or deploy static build to L2-compatible hosting.

---
**Status:** PROD-READY | **Version:** 4.2.0-STABLE | **Audit Status:** VERIFIED
