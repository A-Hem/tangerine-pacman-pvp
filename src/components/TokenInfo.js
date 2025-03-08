import React from 'react';
import { TRAP_TOKEN_INFO } from '../config';

const TokenInfo = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-orange-500 mb-4">About {TRAP_TOKEN_INFO.symbol}</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex flex-col items-center">
          <img 
            src={TRAP_TOKEN_INFO.logo} 
            alt={`${TRAP_TOKEN_INFO.name} Logo`} 
            className="w-32 h-32 mb-4"
          />
          <h3 className="text-xl font-bold text-white">{TRAP_TOKEN_INFO.name}</h3>
          <p className="text-gray-400 text-center mt-2">{TRAP_TOKEN_INFO.category}</p>
          <div className="flex space-x-2 mt-4">
            <a 
              href={TRAP_TOKEN_INFO.uniswapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
            >
              Uniswap
            </a>
            <a 
              href={TRAP_TOKEN_INFO.basescanUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
            >
              Basescan
            </a>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <p className="text-gray-300 mb-4">
            {TRAP_TOKEN_INFO.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="text-orange-400 font-semibold">Network</h4>
              <p className="text-white">{TRAP_TOKEN_INFO.network}</p>
            </div>
            
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="text-orange-400 font-semibold">Launch Date</h4>
              <p className="text-white">{TRAP_TOKEN_INFO.launchDate}</p>
            </div>
            
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="text-orange-400 font-semibold">Contract Address</h4>
              <p className="text-white text-sm break-all">{TRAP_TOKEN_INFO.contractAddress}</p>
            </div>
            
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="text-orange-400 font-semibold">Game Entry Fee</h4>
              <p className="text-white">{10} {TRAP_TOKEN_INFO.symbol}</p>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-700 p-4 rounded border-l-4 border-orange-500">
            <h4 className="text-lg font-semibold text-white mb-2">Why Play with {TRAP_TOKEN_INFO.symbol}?</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Support a fun meme coin on the Base network</li>
              <li>Lower transaction fees compared to Ethereum mainnet</li>
              <li>Win more {TRAP_TOKEN_INFO.symbol} by defeating opponents</li>
              <li>Be part of the tangerine-themed crypto gaming community</li>
              <li>Join the "Trump on Solana is a trap" meme movement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo; 