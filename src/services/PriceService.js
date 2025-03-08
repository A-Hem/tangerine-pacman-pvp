import { ethers } from 'ethers';
import { TRAP_TOKEN_ADDRESS, UNISWAP_ROUTER_ADDRESS, PRICE_ORACLE } from '../config';

// Simplified Uniswap V3 Quote ABI (only what we need)
const UNISWAP_QUOTE_ABI = [
  "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external view returns (uint256 amountOut)"
];

// WETH address on Base
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";

/**
 * Service to fetch token prices from Uniswap
 */
class PriceService {
  constructor() {
    this.lastFetchTime = 0;
    this.cachedPrice = null;
    this.fetchInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  /**
   * Get the current price of TRAP in ETH
   * @param {ethers.providers.Provider} provider - Ethers provider
   * @returns {Promise<number>} - Price of 1 TRAP in ETH
   */
  async getTrapPriceInEth(provider) {
    try {
      // Check if we have a cached price that's still valid
      const now = Date.now();
      if (this.cachedPrice && now - this.lastFetchTime < this.fetchInterval) {
        return this.cachedPrice;
      }

      // Create Uniswap router contract instance
      const uniswapRouter = new ethers.Contract(
        UNISWAP_ROUTER_ADDRESS,
        UNISWAP_QUOTE_ABI,
        provider
      );

      // Amount of TRAP to quote (1 TRAP with 18 decimals)
      const amountIn = ethers.parseUnits("1", 18);

      // Get quote from Uniswap
      const amountOut = await uniswapRouter.quoteExactInputSingle(
        TRAP_TOKEN_ADDRESS,
        WETH_ADDRESS,
        3000, // 0.3% fee tier
        amountIn,
        0 // No price limit
      );

      // Convert to ETH (divide by 10^18)
      const priceInEth = parseFloat(ethers.formatEther(amountOut));
      
      // Cache the result
      this.cachedPrice = priceInEth;
      this.lastFetchTime = now;
      
      return priceInEth;
    } catch (error) {
      console.error("Error fetching TRAP price:", error);
      // Return fallback price if there's an error
      return PRICE_ORACLE.fallbackPrice;
    }
  }

  /**
   * Calculate the amount of TRAP tokens equivalent to a given ETH amount
   * @param {string|number} ethAmount - Amount of ETH
   * @param {ethers.providers.Provider} provider - Ethers provider
   * @returns {Promise<number>} - Equivalent amount of TRAP tokens
   */
  async getEquivalentTrapAmount(ethAmount, provider) {
    try {
      const trapPriceInEth = await this.getTrapPriceInEth(provider);
      // If 1 TRAP = x ETH, then y ETH = y/x TRAP
      return parseFloat(ethAmount) / trapPriceInEth;
    } catch (error) {
      console.error("Error calculating equivalent TRAP amount:", error);
      // Use fallback calculation
      return PRICE_ORACLE.calculateTokenAmount(ethAmount);
    }
  }
}

// Export a singleton instance
export default new PriceService(); 