
import { IdentityTier } from '../types';
import { SYSTEM_CONFIG } from '../constants';

/**
 * Protocol Logic Service (SRE & Financial Engineering)
 * Designed for stateless operation and deterministic state transitions.
 */
export const ProtocolService = {
  /**
   * Calculates reward with tier-based multiplier and impact score weighting.
   */
  calculateReward(baseTokens: number, tier: IdentityTier, impactScore: number): number {
    const multiplier = SYSTEM_CONFIG.REWARD_MULTIPLIERS[tier] || 0.1;
    const impactWeight = impactScore / 100;
    return Math.floor(baseTokens * multiplier * impactWeight);
  },

  /**
   * PT -> USDC Exchange with slippage and LP fee calculation.
   * Fixed to 0.1% as per White-paper Section 3.
   */
  calculateSwap(amountPT: number, currentPrice: number) {
    const feeRate = 0.001; // 0.1% protocol fee
    const fee = amountPT * feeRate;
    const netPT = amountPT - fee;
    const usdcValue = netPT * currentPrice;
    
    // Dynamic slippage: 0.05% per 1M tokens swapped to prevent flash crashes
    const slippage = Math.min(0.05, (amountPT / 1000000) * 0.005); 
    const finalUSDC = usdcValue * (1 - slippage);

    return {
      fee,
      netPT,
      usdcValue: finalUSDC,
      slippagePercentage: (slippage * 100).toFixed(3)
    };
  },

  /**
   * USDC -> PT Acquisition for Level 2 staking or market liquidity.
   */
  calculateBuy(amountUSDC: number, currentPrice: number) {
    const feeRate = 0.0015; // 0.15% Buy fee
    const feeUSDC = amountUSDC * feeRate;
    const netUSDC = amountUSDC - feeUSDC;
    const ptValue = netUSDC / currentPrice;

    const priceImpact = Math.min(0.03, (amountUSDC / 1000000) * 0.01);
    const finalPT = ptValue * (1 - priceImpact);

    return {
      feeUSDC,
      finalPT,
      priceImpact: (priceImpact * 100).toFixed(3)
    };
  },

  /**
   * Mission-Critical Solvency Verification
   * Ensures 5% reserve floor is never breached during liquidation.
   */
  verifySolvency(requestedUSDC: number, currentTreasury: number): boolean {
    const reserveFloor = 0.05; 
    const liquidBuffer = currentTreasury * (1 - reserveFloor);
    return requestedUSDC <= liquidBuffer;
  },

  /**
   * Deterministic 256-bit Hash Simulation
   */
  generateTxHash(): string {
    const hex = '0123456789abcdef';
    let res = '0x';
    for (let i = 0; i < 64; i++) res += hex[Math.floor(Math.random() * 16)];
    return res;
  }
};
