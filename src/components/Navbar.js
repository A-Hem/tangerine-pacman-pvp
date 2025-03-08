import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';

const Navbar = () => {
  const { 
    isConnected, 
    account, 
    balance, 
    connectWallet, 
    disconnectWallet,
    isAuthenticated,
    signInWithEthereum
  } = useWeb3();

  // Format account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-orange-500 font-bold text-xl">
            Tangerine Pacman PVP
          </Link>
          
          <div className="ml-10 hidden md:flex space-x-4">
            <Link to="/" className="text-white hover:text-orange-300">
              Home
            </Link>
            <Link to="/game" className="text-white hover:text-orange-300">
              Play
            </Link>
            <Link to="/leaderboard" className="text-white hover:text-orange-300">
              Leaderboard
            </Link>
            {isConnected && (
              <Link to="/profile" className="text-white hover:text-orange-300">
                Profile
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <>
              <div className="text-white">
                <span className="text-xs md:text-sm">{formatAddress(account)}</span>
                <span className="ml-2 text-xs md:text-sm text-green-400">{parseFloat(balance).toFixed(4)} ETH</span>
              </div>
              
              {!isAuthenticated && (
                <button
                  onClick={signInWithEthereum}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm"
                >
                  Sign In
                </button>
              )}
              
              <button
                onClick={disconnectWallet}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 