import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { TRAP_TOKEN_INFO } from '../config';

const Navbar = () => {
  const { 
    isConnected, 
    account, 
    balance, 
    tokenBalance,
    connectWallet, 
    disconnectWallet,
    isAuthenticated,
    signInWithEthereum,
    isLoadingPrice
  } = useWeb3();
  
  const [isConnecting, setIsConnecting] = useState(false);

  // Format account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle sign in
  const handleSignIn = async () => {
    try {
      await signInWithEthereum();
    } catch (error) {
      console.error("Error signing in:", error);
    }
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

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="text-orange-500 font-bold text-xl flex items-center">
            <span className="mr-2">🍊</span>
            Tangerine Pacman PVP
          </Link>
          
          <div className="ml-10 hidden md:flex space-x-4">
            <Link to="/" className="text-white hover:text-orange-300 transition-colors">
              Home
            </Link>
            <Link to="/game" className="text-white hover:text-orange-300 transition-colors">
              Play
            </Link>
            <Link to="/leaderboard" className="text-white hover:text-orange-300 transition-colors">
              Leaderboard
            </Link>
            {isConnected && (
              <Link to="/profile" className="text-white hover:text-orange-300 transition-colors">
                Profile
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="bg-gray-800 rounded-lg p-2 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs md:text-sm text-white">{formatAddress(account)}</span>
              </div>
              
              <div className="flex space-x-2">
                <div className="bg-blue-900 rounded-lg p-2 flex items-center">
                  <span className="text-blue-300 mr-1 text-xs">ETH:</span>
                  <span className="text-xs md:text-sm text-white">{parseFloat(balance).toFixed(4)}</span>
                </div>
                
                <div className="bg-orange-900 rounded-lg p-2 flex items-center">
                  <span className="text-orange-300 mr-1 text-xs">🍊TRAP:</span>
                  <span className="text-xs md:text-sm text-white">
                    {isLoadingPrice ? "..." : parseFloat(tokenBalance).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-2 md:mt-0">
                {!isAuthenticated ? (
                  <button
                    onClick={handleSignIn}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Sign In
                  </button>
                ) : (
                  <span className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Signed In
                  </span>
                )}
                
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`${
                isConnecting ? 'bg-gray-500 cursor-wait' : 'bg-orange-500 hover:bg-orange-600'
              } text-white px-4 py-2 rounded transition-colors flex items-center`}
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 