import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

const Profile = () => {
  const { account, balance } = useWeb3();
  const [stats, setStats] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from your backend
    // For now, we'll use mock data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock stats data
        const mockStats = {
          gamesPlayed: 15,
          gamesWon: 8,
          winRate: 53.33,
          totalEarnings: 0.00152,
          rank: 23
        };
        
        // Mock game history
        const mockGameHistory = [
          {
            id: '12345',
            date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            opponent: '0x1234567890abcdef1234567890abcdef12345678',
            result: 'win',
            earnings: 0.000186,
            score: {
              player: 240,
              opponent: 180
            }
          },
          {
            id: '12344',
            date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
            opponent: '0x2345678901abcdef2345678901abcdef23456789',
            result: 'loss',
            earnings: 0,
            score: {
              player: 150,
              opponent: 220
            }
          },
          {
            id: '12343',
            date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            opponent: '0x3456789012abcdef3456789012abcdef34567890',
            result: 'win',
            earnings: 0.000186,
            score: {
              player: 300,
              opponent: 240
            }
          },
          {
            id: '12342',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            opponent: '0x4567890123abcdef4567890123abcdef45678901',
            result: 'win',
            earnings: 0.000186,
            score: {
              player: 280,
              opponent: 200
            }
          },
          {
            id: '12341',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
            opponent: '0x5678901234abcdef5678901234abcdef56789012',
            result: 'loss',
            earnings: 0,
            score: {
              player: 180,
              opponent: 260
            }
          }
        ];
        
        setStats(mockStats);
        setGameHistory(mockGameHistory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    if (account) {
      fetchUserData();
    }
  }, [account]);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Profile</h1>
        <p className="text-xl text-gray-300">Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">Your Profile</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {/* Player Info Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-white mb-1">{formatAddress(account)}</h2>
                <p className="text-sm text-gray-400">Wallet Balance: <span className="text-green-400">{parseFloat(balance).toFixed(4)} ETH</span></p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end gap-4">
                <div className="bg-gray-700 rounded-lg p-3 text-center min-w-[100px]">
                  <p className="text-sm text-gray-400">Rank</p>
                  <p className="text-xl font-bold text-white">#{stats.rank}</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-3 text-center min-w-[100px]">
                  <p className="text-sm text-gray-400">Games</p>
                  <p className="text-xl font-bold text-white">{stats.gamesPlayed}</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-3 text-center min-w-[100px]">
                  <p className="text-sm text-gray-400">Wins</p>
                  <p className="text-xl font-bold text-white">{stats.gamesWon}</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-3 text-center min-w-[100px]">
                  <p className="text-sm text-gray-400">Win Rate</p>
                  <p className="text-xl font-bold text-white">{stats.winRate.toFixed(1)}%</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-3 text-center min-w-[100px]">
                  <p className="text-sm text-gray-400">Earnings</p>
                  <p className="text-xl font-bold text-green-400">{stats.totalEarnings.toFixed(5)} ETH</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Game History */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-900">
              <h3 className="text-lg font-bold text-white">Recent Games</h3>
            </div>
            
            {gameHistory.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No games played yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {gameHistory.map((game) => (
                  <div key={game.id} className="p-4 hover:bg-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${game.result === 'win' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className={`font-medium ${game.result === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                            {game.result === 'win' ? 'Victory' : 'Defeat'}
                          </span>
                          <span className="text-gray-400 text-sm ml-2">
                            {formatDate(game.date)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-300">
                          Opponent: {formatAddress(game.opponent)}
                        </div>
                        
                        <div className="text-sm text-gray-300 mt-1">
                          Score: <span className="text-orange-400">{game.score.player}</span> - <span className="text-red-400">{game.score.opponent}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-0">
                        {game.result === 'win' ? (
                          <div className="text-green-400 font-medium">
                            +{game.earnings.toFixed(6)} ETH
                          </div>
                        ) : (
                          <div className="text-gray-400 font-medium">
                            0 ETH
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 