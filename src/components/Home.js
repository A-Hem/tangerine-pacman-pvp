import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { TRAP_TOKEN_INFO } from '../config';

const Home = () => {
  const { isConnected, connectWallet } = useWeb3();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-orange-500 mb-4">
          Tangerine Pacman PVP
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          A web3-enabled PVP Pacman game where players can compete against each other for cryptocurrency rewards on the Base network.
        </p>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full mb-12">
        <h2 className="text-2xl font-bold text-orange-400 mb-4">How to Play</h2>
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

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full mb-12">
        <h2 className="text-2xl font-bold text-orange-400 mb-4">Game Features</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-300">
          <li>Tangerine-themed Pacman character</li>
          <li>PVP Gameplay: Compete against other players in real-time</li>
          <li>Web3 Integration: Connect your Ethereum wallet</li>
          <li>Base Network Support: Play with lower gas fees</li>
          <li>Dual Payment Options: Pay with ETH or {TRAP_TOKEN_INFO.symbol} tokens</li>
          <li>Cryptocurrency Rewards: Win ETH or {TRAP_TOKEN_INFO.symbol} tokens by defeating your opponents</li>
          <li>Ranking System: Track your performance against other players</li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {isConnected ? (
          <Link 
            to="/game" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-xl font-bold"
          >
            Play Now
          </Link>
        ) : (
          <button 
            onClick={connectWallet}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-xl font-bold"
          >
            Connect Wallet to Play
          </button>
        )}
        
        <Link 
          to="/leaderboard" 
          className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg text-xl font-bold"
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
};

export default Home; 