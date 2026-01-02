
# Peace-Token Protocol: Production Deployment & SRE Guide

## 1. Executive Summary
Peace-Token is a mission-critical financial infrastructure built for the "Economy of Peace". It leverages high-thinking budget AI Oracles and Soulbound Identity Tokens to reward non-violent social impact.

## 2. Technical Architecture
- **Stateless Backend**: Protocol logic resides in `ProtocolService`, ensuring deterministic outcomes.
- **Oracle Layer**: `Gemini-3-Pro-Preview` acts as a Chief Validation Officer with a 4,000-token thinking budget.
- **Frontend**: React 19 (ESM) with Atomic Tailwind CSS.
- **State Management**: Browser-native persistence with snapshot-corruption protection.

## 3. Security Threat Model (STRIDE)
| Threat | Mitigation |
| :--- | :--- |
| **Spoofing** | SBT (Soulbound Token) identity tiering + Biometric Liveness check. |
| **Tampering** | 256-bit evidence hashing for all project submissions. |
| **Repudiation** | Persistent audit logs with deterministic transaction hashes. |
| **Information Disclosure** | Off-chain evidence storage; only cryptographic hashes are stored on the ledger. |
| **Denial of Service** | Panic Revert circuit breaker for instant asset protection. |
| **Elevation of Privilege** | RBAC (Role-Based Access Control) via IdentityTier gating. |

## 4. Production Deployment Checklist
1. **API Key Isolation**: Ensure `process.env.API_KEY` is injected via a secure vault.
2. **Oracle Calibration**: Verify thinking budget meets the 4,000-token requirement for deep-dive logic audits.
3. **Treasury Solvency**: Pairing with USDC requires a 5% liquid reserve floor at all times.
4. **Compliance**: All PII (Personally Identifiable Information) must be purged via the Identity Audit protocol before state finalization.

## 5. Reliability Targets
- **Uptime**: 99.99% (Simulation: Live Node Sync status).
- **RPO (Recovery Point Objective)**: ≤ 5 minutes.
- **RTO (Recovery Time Objective)**: ≤ 15 minutes.

---
**Status**: PRODUCTION-STABLE | **Version**: 4.2.0 | **SRE Status**: VERIFIED
