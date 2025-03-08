import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { 
  GAME_CONTRACT_ADDRESS, 
  ADMIN_WALLET_ADDRESS, 
  TRAP_TOKEN_ADDRESS,
  ETH_ENTRY_FEE,
  TOKEN_ENTRY_FEE,
  BASE_NETWORK,
  PRICE_ORACLE
} from '../config';
import PriceService from '../services/PriceService';

// Create context
const Web3Context = createContext();

// Game contract ABI (simplified for now)
const gameContractABI = [
  "function enterGame() external payable",
  "function enterGameWithToken(uint256 amount) external",
  "function claimReward() external",
  "event GameStarted(address indexed player1, address indexed player2, uint256 gameId)",
  "event GameEnded(uint256 indexed gameId, address indexed winner)"
];

// ERC20 Token ABI (simplified)
const tokenABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address recipient, uint256 amount) external returns (bool)"
];

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameContract, setGameContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("eth"); // "eth" or "token"
  const [error, setError] = useState(null);
  const [tokenEntryFee, setTokenEntryFee] = useState("0");
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  // Add useEffect for wallet reconnection on page refresh
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        try {
          await connectWallet();
        } catch (error) {
          console.error("Failed to reconnect wallet:", error);
        }
      }
    };
    
    checkConnection();
    
    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Fetch token price and calculate entry fee
  useEffect(() => {
    const fetchTokenPrice = async () => {
      if (provider) {
        try {
          setIsLoadingPrice(true);
          const trapAmount = await PriceService.getEquivalentTrapAmount(ETH_ENTRY_FEE, provider);
          setTokenEntryFee(trapAmount.toString());
        } catch (error) {
          console.error("Error fetching token price:", error);
          // Use fallback calculation
          const fallbackAmount = PRICE_ORACLE.calculateTokenAmount(ETH_ENTRY_FEE);
          setTokenEntryFee(fallbackAmount.toString());
        } finally {
          setIsLoadingPrice(false);
        }
      }
    };

    fetchTokenPrice();
  }, [provider]);

  // Connect wallet
  const connectWallet = async () => {
    try {
      // Reset error state
      setError(null);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError("Please install MetaMask to use this application");
        return false;
      }

      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        setError("No accounts found. Please connect to MetaMask.");
        return false;
      }

      // Create ethers provider and signer
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await ethersProvider.getSigner();
      
      // Set provider and signer
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setAccount(accounts[0]);
      setIsConnected(true);
      
      // Create contract instances
      const game = new ethers.Contract(GAME_CONTRACT_ADDRESS, gameContractABI, ethersSigner);
      const token = new ethers.Contract(TRAP_TOKEN_ADDRESS, tokenABI, ethersSigner);
      
      setGameContract(game);
      setTokenContract(token);
      
      // Get balances
      const ethBalance = await ethersProvider.getBalance(accounts[0]);
      const tokenBalanceWei = await token.balanceOf(accounts[0]);
      
      setBalance(ethers.formatEther(ethBalance));
      setTokenBalance(ethers.formatUnits(tokenBalanceWei, 18));
      
      // Check if we need to switch to Base network
      const network = await ethersProvider.getNetwork();
      if (network.chainId.toString() !== BASE_NETWORK.chainId) {
        const switched = await switchToBaseNetwork();
        if (!switched) {
          return false;
        }
      }

      // Add event listeners for account and chain changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error.message || "Failed to connect wallet");
      setIsConnected(false);
      return false;
    }
  };

  // Improve switchToBaseNetwork with better error handling
  const switchToBaseNetwork = async () => {
    try {
      setError(null);
      
      if (!window.ethereum) {
        setError("Please install MetaMask to use this application");
        return false;
      }

      try {
        // Try to switch to the Base network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_NETWORK.chainId }],
        });
        return true;
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: BASE_NETWORK.chainId,
                  chainName: BASE_NETWORK.chainName,
                  nativeCurrency: BASE_NETWORK.nativeCurrency,
                  rpcUrls: BASE_NETWORK.rpcUrls,
                  blockExplorerUrls: BASE_NETWORK.blockExplorerUrls,
                },
              ],
            });
            return true;
          } catch (addError) {
            console.error("Error adding Base network:", addError);
            setError("Failed to add Base network to your wallet");
            return false;
          }
        } else {
          console.error("Error switching to Base network:", switchError);
          setError("Failed to switch to Base network");
          return false;
        }
      }
    } catch (error) {
      console.error("Error in switchToBaseNetwork:", error);
      setError(error.message || "Failed to switch network");
      return false;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    setGameContract(null);
    setTokenContract(null);
    setIsAuthenticated(false);
    
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else {
      // User switched accounts
      setAccount(accounts[0]);
      setIsAuthenticated(false); // Reset authentication when account changes
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    // Reload the page when the chain changes
    window.location.reload();
  };

  // Sign in with Ethereum
  const signInWithEthereum = async () => {
    try {
      if (!signer) {
        throw new Error("Wallet not connected");
      }
      
      // Create SIWE message
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = 'Sign in with Ethereum to Tangerine Pacman PVP';
      
      // Get the current chain ID
      const { chainId } = await provider.getNetwork();
      
      const message = new SiweMessage({
        domain,
        address: account,
        statement,
        uri: origin,
        version: '1',
        chainId: Number(chainId), // Use the current chain ID
        nonce: Math.floor(Math.random() * 1000000).toString(),
      });
      
      const messageToSign = message.prepareMessage();
      
      // Sign the message
      await signer.signMessage(messageToSign);
      
      // Verify the signature (in a real app, this would be done on the backend)
      // For now, we'll just set authenticated state
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      console.error("Error signing in with Ethereum:", err);
      setError(err.message || "Failed to sign in with Ethereum");
      return false;
    }
  };

  // Set payment method
  const setPaymentType = (method) => {
    if (method === 'eth' || method === 'token') {
      setPaymentMethod(method);
      return true;
    }
    return false;
  };

  // Enter game (pay entry fee)
  const enterGame = async () => {
    try {
      setError(null);
      
      if (!isConnected) {
        setError("Please connect your wallet first");
        return false;
      }
      
      // Check if we're on the right network
      const network = await provider.getNetwork();
      if (network.chainId.toString() !== BASE_NETWORK.chainId) {
        const switched = await switchToBaseNetwork();
        if (!switched) {
          throw new Error("Please switch to the Base network to play");
        }
      }
      
      // Refresh balances before proceeding
      const ethBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(ethBalance));
      
      if (paymentMethod === "eth") {
        // Check if user has enough ETH
        const entryFeeWei = ethers.parseEther(ETH_ENTRY_FEE);
        if (ethBalance < entryFeeWei) {
          throw new Error(`Insufficient ETH balance. You need at least ${ETH_ENTRY_FEE} ETH.`);
        }
        
        // Enter game with ETH
        const tx = await gameContract.enterGame({
          value: ethers.parseEther(ETH_ENTRY_FEE)
        });
        
        await tx.wait();
        
        // Update balance after transaction
        const newBalance = await provider.getBalance(account);
        setBalance(ethers.formatEther(newBalance));
        
        return true;
      } else {
        // Refresh token balance
        const tokenBalanceWei = await tokenContract.balanceOf(account);
        setTokenBalance(ethers.formatUnits(tokenBalanceWei, 18));
        
        // Enter game with tokens
        // First, approve the token transfer
        const tokenAmountWei = ethers.parseEther(tokenEntryFee);
        
        // Check if we have enough tokens
        if (tokenBalanceWei < tokenAmountWei) {
          throw new Error(`Insufficient token balance. You need ${tokenEntryFee} 🍊TRAP tokens.`);
        }
        
        // Check if we already have approval
        const allowance = await tokenContract.allowance(account, GAME_CONTRACT_ADDRESS);
        if (allowance < tokenAmountWei) {
          try {
            const approveTx = await tokenContract.approve(GAME_CONTRACT_ADDRESS, tokenAmountWei);
            await approveTx.wait();
          } catch (error) {
            throw new Error("Failed to approve token transfer. Please try again.");
          }
        }
        
        // Now enter the game with tokens
        try {
          const tx = await gameContract.enterGameWithToken(tokenAmountWei);
          await tx.wait();
          
          // Update token balance after transaction
          const newTokenBalance = await tokenContract.balanceOf(account);
          setTokenBalance(ethers.formatUnits(newTokenBalance, 18));
          
          return true;
        } catch (error) {
          throw new Error("Failed to enter game with tokens. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error entering game:", error);
      setError(error.message || "Failed to enter game");
      return false;
    }
  };

  // Claim reward
  const claimReward = async () => {
    try {
      if (!gameContract || !signer) {
        throw new Error("Wallet not connected or contract not initialized");
      }
      
      // Call the claimReward function
      const tx = await gameContract.claimReward();
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Update ETH balance
      const updatedBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(updatedBalance));
      
      // Update token balance
      try {
        const tokenBalanceWei = await tokenContract.balanceOf(account);
        setTokenBalance(ethers.formatUnits(tokenBalanceWei, 18));
      } catch (err) {
        console.error("Error updating token balance:", err);
      }
      
      return true;
    } catch (err) {
      console.error("Error claiming reward:", err);
      setError(err.message || "Failed to claim reward");
      return false;
    }
  };

  // Context value
  const value = {
    provider,
    signer,
    account,
    isConnected,
    isAuthenticated,
    balance,
    tokenBalance,
    paymentMethod,
    error,
    gameContract,
    tokenContract,
    connectWallet,
    disconnectWallet,
    signInWithEthereum,
    enterGame,
    claimReward,
    setPaymentType,
    ADMIN_WALLET_ADDRESS,
    TRAP_TOKEN_ADDRESS,
    switchToBaseNetwork,
    tokenEntryFee,
    isLoadingPrice,
    formatTokenAmount: PRICE_ORACLE.formatTokenAmount
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 