import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { 
  GAME_CONTRACT_ADDRESS, 
  ADMIN_WALLET_ADDRESS, 
  TRAP_TOKEN_ADDRESS,
  ETH_ENTRY_FEE,
  TOKEN_ENTRY_FEE,
  BASE_NETWORK
} from '../config';

// Create context
const Web3Context = createContext();

// Game contract ABI (simplified for now)
const gameContractABI = [
  "function enterGame() external payable",
  "function enterGameWithToken() external",
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

  // Connect wallet
  const connectWallet = async () => {
    try {
      // Reset error state
      setError(null);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError("Please install MetaMask to use this application");
        return;
      }

      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        setError("No accounts found. Please connect to MetaMask.");
        return;
      }

      // Create ethers provider and signer
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await ethersProvider.getSigner();
      
      // Set state
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setAccount(accounts[0]);
      setIsConnected(true);
      
      // Check if we're on the Base network
      const { chainId } = await ethersProvider.getNetwork();
      if (Number(chainId) !== 8453) {
        // If not on Base, prompt to switch
        await switchToBaseNetwork();
      }
      
      // Create game contract instance
      const contract = new ethers.Contract(
        GAME_CONTRACT_ADDRESS,
        gameContractABI,
        ethersSigner
      );
      setGameContract(contract);
      
      // Create token contract instance
      const token = new ethers.Contract(
        TRAP_TOKEN_ADDRESS,
        tokenABI,
        ethersSigner
      );
      setTokenContract(token);
      
      // Get account ETH balance
      const accountBalance = await ethersProvider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(accountBalance));
      
      // Get token balance
      try {
        const tokenBalanceWei = await token.balanceOf(accounts[0]);
        setTokenBalance(ethers.formatUnits(tokenBalanceWei, 18)); // Assuming 18 decimals, adjust if different
      } catch (err) {
        console.error("Error fetching token balance:", err);
        setTokenBalance("0");
      }
      
      // Add event listeners for account and chain changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error.message || "Failed to connect wallet");
      setIsConnected(false);
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
      if (!gameContract || !signer) {
        throw new Error("Wallet not connected or contract not initialized");
      }
      
      let tx;
      
      if (paymentMethod === 'eth') {
        // Entry fee in ETH
        const entryFee = ethers.parseEther(ETH_ENTRY_FEE);
        
        // Call the enterGame function with the entry fee
        tx = await gameContract.enterGame({ value: entryFee });
      } else if (paymentMethod === 'token') {
        // Check token allowance
        const allowance = await tokenContract.allowance(account, GAME_CONTRACT_ADDRESS);
        const requiredAmount = ethers.parseEther(TOKEN_ENTRY_FEE);
        
        // If allowance is insufficient, request approval
        if (allowance < requiredAmount) {
          const approveTx = await tokenContract.approve(GAME_CONTRACT_ADDRESS, requiredAmount);
          await approveTx.wait();
        }
        
        // Call the enterGameWithToken function
        tx = await gameContract.enterGameWithToken();
      } else {
        throw new Error("Invalid payment method");
      }
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Update balances
      if (paymentMethod === 'eth') {
        const updatedBalance = await provider.getBalance(account);
        setBalance(ethers.formatEther(updatedBalance));
      } else {
        const tokenBalanceWei = await tokenContract.balanceOf(account);
        setTokenBalance(ethers.formatUnits(tokenBalanceWei, 18));
      }
      
      return true;
    } catch (err) {
      console.error("Error entering game:", err);
      setError(err.message || "Failed to enter game");
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
    switchToBaseNetwork
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 