import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { TRAP_TOKEN_INFO } from '../config';
import TokenInfo from './TokenInfo';

const Home = () => {
  const { connectWallet, isConnected } = useWeb3();

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
          <button
            onClick={connectWallet}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mb-12">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Ready to Play!</h2>
          <p className="text-gray-300 mb-6">Your wallet is connected. You're ready to start playing!</p>
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
          <li>Pay 0.0001 ETH or</li>
          <li>Pay 10 {TRAP_TOKEN_INFO.symbol} tokens to enter a match</li>
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