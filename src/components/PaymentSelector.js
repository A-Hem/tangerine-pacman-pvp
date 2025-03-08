import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

const PaymentSelector = () => {
  const { 
    paymentMethod, 
    setPaymentType, 
    balance, 
    tokenBalance, 
    TRAP_TOKEN_ADDRESS 
  } = useWeb3();

  const handlePaymentChange = (method) => {
    setPaymentType(method);
  };

  // Format the token address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
          <p className="text-sm text-gray-400">Entry Fee: <span className="text-green-400">0.0001 ETH</span></p>
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
              <span className="text-white font-bold">$</span>
            </div>
            <h3 className="text-lg font-semibold text-white">$-Trap</h3>
          </div>
          <p className="text-gray-300 mb-2">Pay with $-Trap tokens</p>
          <p className="text-sm text-gray-400">Entry Fee: <span className="text-green-400">10 $-Trap</span></p>
          <p className="text-sm text-gray-400">Your Balance: <span className="text-green-400">{parseFloat(tokenBalance).toFixed(2)} $-Trap</span></p>
          <p className="text-xs text-gray-500 mt-1">Token: {formatAddress(TRAP_TOKEN_ADDRESS)}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelector; 