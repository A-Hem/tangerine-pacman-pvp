import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { TRAP_TOKEN_INFO, ETH_ENTRY_FEE } from '../config';
import TokenInfo from './TokenInfo';

const Home = () => {
  const { 
    connectWallet, 
    isConnected, 
    account, 
    balance, 
    tokenBalance, 
    isAuthenticated,
    signInWithEthereum,
    error
  } = useWeb3();
  
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Format account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Handle wallet connection
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle sign in
  const handleSignIn = async () => {
    try {
      await signInWithEthereum();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">Tangerine Pacman PVP</h1>
        <p className="text-xl text-gray-300">A Web3 PVP Pacman Game on Base Network</p>
        <p className="text-md text-orange-400 mt-2">Play with ETH or {TRAP_TOKEN_INFO.symbol} tokens!</p>
      </div>

      {!isConnected ? (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mb-12">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Connect your wallet to start playing Tangerine Pacman PVP and compete for crypto rewards!</p>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-3 rounded mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="bg-gray-700 p-4 rounded mb-6">
            <h3 className="text-sm font-semibold text-orange-300 mb-2">What you'll need:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                MetaMask or another Web3 wallet
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Base network configured in your wallet
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {ETH_ENTRY_FEE} ETH or equivalent {TRAP_TOKEN_INFO.symbol} tokens
              </li>
            </ul>
          </div>
          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`w-full ${
              isConnecting ? 'bg-gray-500 cursor-wait' : 'bg-orange-500 hover:bg-orange-600'
            } text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center`}
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                </svg>
                Connect Wallet
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-orange-400">Wallet Connected</h2>
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
              Connected
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300">Address:</span>
              <span className="text-white font-mono">{formatAddress(account)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300">ETH Balance:</span>
              <span className="text-blue-300 font-mono">{parseFloat(balance).toFixed(4)} ETH</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300">{TRAP_TOKEN_INFO.symbol} Balance:</span>
              <span className="text-orange-300 font-mono">{parseFloat(tokenBalance).toFixed(2)} {TRAP_TOKEN_INFO.symbol}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Status:</span>
              {isAuthenticated ? (
                <span className="text-green-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Signed In
                </span>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="text-orange-400 text-sm hover:text-orange-300 transition-colors"
                >
                  Sign In Now
                </button>
              )}
            </div>
          </div>
          
          <Link
            to="/game"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded text-center transition-colors"
          >
            Play Now
          </Link>
        </div>
      )}

      {/* Token Info Section */}
      <TokenInfo />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">How to Play</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li>Connect your wallet to get started</li>
          <li>Pay {ETH_ENTRY_FEE} ETH or</li>
          <li>Pay the equivalent in {TRAP_TOKEN_INFO.symbol} tokens to enter a match</li>
          <li>Use arrow keys to control your Pacman</li>
          <li>Eat dots and power pellets to score points</li>
          <li>Avoid ghosts or eat them when powered up</li>
          <li>The player with the highest score after 2 minutes wins!</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">Features</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li>PVP Gameplay: Compete against other players in real-time</li>
          <li>Web3 Integration: Connect your Ethereum wallet</li>
          <li>Base Network Support: Play with lower gas fees</li>
          <li>Dual Payment Options: Pay with ETH or {TRAP_TOKEN_INFO.symbol} tokens</li>
          <li>Cryptocurrency Rewards: Win ETH or {TRAP_TOKEN_INFO.symbol} tokens by defeating your opponents</li>
          <li>Ranking System: Track your performance against other players</li>
        </ul>
      </div>
    </div>
  );
};

export default Home; 