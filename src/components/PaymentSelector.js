import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { TRAP_TOKEN_INFO, ETH_ENTRY_FEE } from '../config';

const PaymentSelector = () => {
  const { 
    paymentMethod, 
    setPaymentType, 
    balance, 
    tokenBalance, 
    TRAP_TOKEN_ADDRESS,
    tokenEntryFee,
    isLoadingPrice,
    formatTokenAmount
  } = useWeb3();

  const handlePaymentChange = (method) => {
    setPaymentType(method);
  };

  // Format the token address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format the token entry fee for display
  const displayTokenFee = () => {
    if (isLoadingPrice) {
      return "Loading...";
    }
    
    if (!tokenEntryFee || tokenEntryFee === "0") {
      return "Calculating...";
    }
    
    return `${formatTokenAmount ? formatTokenAmount(parseFloat(tokenEntryFee)) : tokenEntryFee}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-orange-500 mb-4">Choose Payment Method</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div 
          className={`p-4 rounded-lg cursor-pointer border-2 ${
            paymentMethod === 'eth' 
              ? 'border-orange-500 bg-gray-700' 
              : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
          }`}
          onClick={() => handlePaymentChange('eth')}
        >
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
              <span className="text-white font-bold">Ξ</span>
            </div>
            <h3 className="text-lg font-semibold text-white">ETH</h3>
          </div>
          <p className="text-gray-300 mb-2">Pay with ETH on Base network</p>
          <p className="text-sm text-gray-400">Entry Fee: <span className="text-green-400">{ETH_ENTRY_FEE} ETH</span></p>
          <p className="text-sm text-gray-400">Your Balance: <span className="text-green-400">{parseFloat(balance).toFixed(4)} ETH</span></p>
        </div>
        
        <div 
          className={`p-4 rounded-lg cursor-pointer border-2 ${
            paymentMethod === 'token' 
              ? 'border-orange-500 bg-gray-700' 
              : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
          }`}
          onClick={() => handlePaymentChange('token')}
        >
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-2">
              <span className="text-white font-bold">🍊</span>
            </div>
            <h3 className="text-lg font-semibold text-white">{TRAP_TOKEN_INFO.symbol}</h3>
          </div>
          <p className="text-gray-300 mb-2">Pay with {TRAP_TOKEN_INFO.name} tokens</p>
          <p className="text-sm text-gray-400">
            Entry Fee: <span className="text-green-400">{displayTokenFee()} {TRAP_TOKEN_INFO.symbol}</span>
            {isLoadingPrice && <span className="ml-2 text-xs text-gray-500">(Fetching price...)</span>}
          </p>
          <p className="text-sm text-gray-400">Your Balance: <span className="text-green-400">{parseFloat(tokenBalance).toFixed(2)} {TRAP_TOKEN_INFO.symbol}</span></p>
          <p className="text-xs text-gray-500 mt-1">Token: <a 
            href={`https://basescan.org/token/${TRAP_TOKEN_ADDRESS}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline"
          >
            {formatAddress(TRAP_TOKEN_ADDRESS)}
          </a></p>
          <div className="mt-2 text-xs text-gray-400">
            <p>"{TRAP_TOKEN_INFO.description.substring(0, 60)}..."</p>
            <a 
              href={TRAP_TOKEN_INFO.uniswapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline"
            >
              View on Uniswap
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          The {TRAP_TOKEN_INFO.symbol} token price is dynamically calculated to be equivalent to {ETH_ENTRY_FEE} ETH using Uniswap oracle pricing.
        </p>
      </div>
    </div>
  );
};

export default PaymentSelector; 