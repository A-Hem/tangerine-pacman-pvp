import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

const Admin = () => {
  const { 
    isConnected, 
    connectWallet, 
    isGameAdmin, 
    addGameAdmin, 
    removeGameAdmin, 
    endGameWithWinner,
    account
  } = useWeb3();
  
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [removeAdminAddress, setRemoveAdminAddress] = useState('');
  const [gameId, setGameId] = useState('');
  const [winnerAddress, setWinnerAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Handle adding a new game admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsProcessing(true);
    
    try {
      if (!newAdminAddress || !ethers.isAddress(newAdminAddress)) {
        throw new Error("Please enter a valid Ethereum address");
      }
      
      const result = await addGameAdmin(newAdminAddress);
      
      if (result.success) {
        setSuccessMessage(`Successfully added ${newAdminAddress} as a game admin`);
        setNewAdminAddress('');
      } else {
        throw new Error(result.error || "Failed to add game admin");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle removing a game admin
  const handleRemoveAdmin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsProcessing(true);
    
    try {
      if (!removeAdminAddress || !ethers.isAddress(removeAdminAddress)) {
        throw new Error("Please enter a valid Ethereum address");
      }
      
      const result = await removeGameAdmin(removeAdminAddress);
      
      if (result.success) {
        setSuccessMessage(`Successfully removed ${removeAdminAddress} as a game admin`);
        setRemoveAdminAddress('');
      } else {
        throw new Error(result.error || "Failed to remove game admin");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle ending a game
  const handleEndGame = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsProcessing(true);
    
    try {
      if (!gameId || isNaN(parseInt(gameId))) {
        throw new Error("Please enter a valid game ID");
      }
      
      if (!winnerAddress || !ethers.isAddress(winnerAddress)) {
        throw new Error("Please enter a valid winner address");
      }
      
      const result = await endGameWithWinner(parseInt(gameId), winnerAddress);
      
      if (result.success) {
        setSuccessMessage(`Successfully ended game ${gameId} with winner ${winnerAddress}`);
        setGameId('');
        setWinnerAddress('');
      } else {
        throw new Error(result.error || "Failed to end game");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // If not connected, show connect wallet button
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Admin Panel</h1>
        <div className="bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-100 p-4 rounded mb-6 max-w-md">
          <h3 className="font-bold text-blue-300 mb-2">Wallet Not Connected</h3>
          <p className="text-sm mb-3">You need to connect your wallet to access the admin panel.</p>
          <button 
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  // If not a game admin, show unauthorized message
  if (!isGameAdmin) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Admin Panel</h1>
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-4 rounded mb-6 max-w-md">
          <h3 className="font-bold text-red-300 mb-2">Unauthorized</h3>
          <p className="text-sm mb-3">Your wallet address ({account}) is not authorized as a game admin.</p>
          <p className="text-sm">Please contact the contract owner to be added as an admin.</p>
        </div>
      </div>
    );
  }
  
  // Admin panel UI
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">Admin Panel</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4 max-w-md w-full">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded-lg mb-4 max-w-md w-full">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Add Game Admin */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Add Game Admin</h2>
          <form onSubmit={handleAddAdmin}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Admin Address</label>
              <input 
                type="text" 
                value={newAdminAddress}
                onChange={(e) => setNewAdminAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-700 text-white p-2 rounded"
                disabled={isProcessing}
              />
            </div>
            <button 
              type="submit"
              disabled={isProcessing}
              className={`${
                isProcessing ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
              } text-white px-4 py-2 rounded transition-colors w-full`}
            >
              {isProcessing ? 'Processing...' : 'Add Admin'}
            </button>
          </form>
        </div>
        
        {/* Remove Game Admin */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Remove Game Admin</h2>
          <form onSubmit={handleRemoveAdmin}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Admin Address</label>
              <input 
                type="text" 
                value={removeAdminAddress}
                onChange={(e) => setRemoveAdminAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-700 text-white p-2 rounded"
                disabled={isProcessing}
              />
            </div>
            <button 
              type="submit"
              disabled={isProcessing}
              className={`${
                isProcessing ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
              } text-white px-4 py-2 rounded transition-colors w-full`}
            >
              {isProcessing ? 'Processing...' : 'Remove Admin'}
            </button>
          </form>
        </div>
        
        {/* End Game */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg md:col-span-2">
          <h2 className="text-xl font-bold text-orange-400 mb-4">End Game</h2>
          <form onSubmit={handleEndGame}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2">Game ID</label>
                <input 
                  type="number" 
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="1"
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Winner Address</label>
                <input 
                  type="text" 
                  value={winnerAddress}
                  onChange={(e) => setWinnerAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  disabled={isProcessing}
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={isProcessing}
              className={`${
                isProcessing ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 py-2 rounded transition-colors w-full`}
            >
              {isProcessing ? 'Processing...' : 'End Game'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin; 