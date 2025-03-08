// Configuration for the Tangerine Pacman PVP game

// Game contract address on Base network
// This should be updated after deploying the smart contract
export const GAME_CONTRACT_ADDRESS = process.env.REACT_APP_GAME_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Admin wallet address that will receive platform fees
export const ADMIN_WALLET_ADDRESS = process.env.REACT_APP_ADMIN_WALLET_ADDRESS || "0x5ae019F7eE28612b058381f4Fea213Cc90ee88A4";

// 🍊TRAP token address on Base network
export const TRAP_TOKEN_ADDRESS = process.env.REACT_APP_TRAP_TOKEN_ADDRESS || "0x300Ba4799Ab7d6fd55b87BCcBCeCb772b413349b";

// Game fee constants
export const ETH_ENTRY_FEE = process.env.REACT_APP_ETH_ENTRY_FEE || "0.0001"; // in ETH
// Token entry fee will be dynamically calculated based on ETH equivalent
export const PLATFORM_FEE_PERCENTAGE = process.env.REACT_APP_PLATFORM_FEE_PERCENTAGE || 6.9; // 6.9%

// Base network configuration
export const BASE_NETWORK = {
  chainId: process.env.REACT_APP_BASE_NETWORK_CHAIN_ID || "0x2105", // 8453 in hex
  chainName: "Base",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [process.env.REACT_APP_BASE_NETWORK_RPC_URL || "https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

// Token information
export const TRAP_TOKEN_INFO = {
  name: "🍊TRAP",
  symbol: "🍊TRAP",
  decimals: 18,
  logo: "https://a-hem.github.io/tangerine-pacman-pvp/trap-token-logo.svg",
  description: "A meme coin on Base network centered around the idea that Trump on Solana is a trap. Launched as a playful counterpart to the Solana-based Trump tokens.",
  uniswapUrl: "https://app.uniswap.org/explore/tokens/base/0x300ba4799ab7d6fd55b87bccbcecb772b413349b",
  contractAddress: "0x300Ba4799Ab7d6fd55b87BCcBCeCb772b413349b",
  network: "Base",
  launchDate: "Launched when Trump tokens appeared on Solana",
  category: "Meme Coin",
  basescanUrl: "https://basescan.org/token/0x300Ba4799Ab7d6fd55b87BCcBCeCb772b413349b",
};

// Uniswap V3 Router address on Base
export const UNISWAP_ROUTER_ADDRESS = "0x2626664c2603336E57B271c5C0b26F421741e481";

// Price oracle configuration
export const PRICE_ORACLE = {
  // Default fallback price if oracle fails (in ETH per TRAP)
  // This is just a placeholder and should be updated with real market data
  fallbackPrice: 0.00000001, // 1 ETH = 100,000,000 TRAP tokens (example value)
  
  // Calculate token amount based on ETH value
  calculateTokenAmount: (ethAmount) => {
    // Convert ETH amount to token amount based on current price
    // For now, using the fallback price
    return parseFloat(ethAmount) / PRICE_ORACLE.fallbackPrice;
  },
  
  // Format token amount for display
  formatTokenAmount: (tokenAmount) => {
    // If the amount is very large, format it with appropriate suffix
    if (tokenAmount >= 1000000) {
      return `${(tokenAmount / 1000000).toFixed(2)}M`;
    } else if (tokenAmount >= 1000) {
      return `${(tokenAmount / 1000).toFixed(2)}K`;
    } else {
      return tokenAmount.toFixed(2);
    }
  }
}; 