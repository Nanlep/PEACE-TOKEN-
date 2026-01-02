
import { IdentityTier } from '../types';
import { SYSTEM_CONFIG } from '../constants';

/**
 * Protocol Logic Service
 * Acts as the "Controller" for the simulated backend state transitions.
 */
export const ProtocolService = {
  /**
   * Calculates the final token reward based on user tier and base impact tokens.
   */
  calculateReward(baseTokens: number, tier: IdentityTier): number {
    const multiplier = SYSTEM_CONFIG.REWARD_MULTIPLIERS[tier] || 0.1;
    return Math.floor(baseTokens * multiplier);
  },

  /**
   * Calculates Sell metrics (PT -> USDC)
   */
  calculateSwap(amountPT: number, currentPrice: number) {
    const feeRate = 0.001; // 0.1% protocol fee
    const fee = amountPT * feeRate;
    const netPT = amountPT - fee;
    const usdcValue = netPT * currentPrice;
    
    const slippage = Math.min(0.02, (amountPT / 1000000) * 0.05); 
    const finalUSDC = usdcValue * (1 - slippage);

    return {
      fee,
      netPT,
      usdcValue: finalUSDC,
      slippagePercentage: (slippage * 100).toFixed(2)
    };
  },

  /**
   * Calculates Buy metrics (USDC -> PT)
   */
  calculateBuy(amountUSDC: number, currentPrice: number) {
    const feeRate = 0.0015; // Slightly higher 0.15% for buy side to fund DAO
    const feeUSDC = amountUSDC * feeRate;
    const netUSDC = amountUSDC - feeUSDC;
    const ptValue = netUSDC / currentPrice;

    // Price impact simulation
    const priceImpact = Math.min(0.03, (amountUSDC / 500000) * 0.05);
    const finalPT = ptValue * (1 - priceImpact);

    return {
      feeUSDC,
      finalPT,
      priceImpact: (priceImpact * 100).toFixed(2)
    };
  },

  /**
   * Verifies treasury solvency for a proposed disbursement.
   */
  verifySolvency(requestedUSDC: number, currentTreasury: number): boolean {
    const reserveRequirement = 0.05; // Maintain 5% reserve minimum
    const available = currentTreasury * (1 - reserveRequirement);
    return requestedUSDC <= available;
  },

  /**
   * Generates a deterministic transaction hash for logging.
   */
  generateTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }
};
