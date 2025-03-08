import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3();

  useEffect(() => {
    // In a real app, this would fetch data from your backend
    // For now, we'll use mock data
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockPlayers = [
          {
            address: '0x1234567890abcdef1234567890abcdef12345678',
            gamesPlayed: 42,
            gamesWon: 28,
            winRate: 66.67,
            totalEarnings: 0.00532,
            rank: 1
          },
          {
            address: '0x2345678901abcdef2345678901abcdef23456789',
            gamesPlayed: 38,
            gamesWon: 22,
            winRate: 57.89,
            totalEarnings: 0.00418,
            rank: 2
          },
          {
            address: '0x3456789012abcdef3456789012abcdef34567890',
            gamesPlayed: 31,
            gamesWon: 17,
            winRate: 54.84,
            totalEarnings: 0.00323,
            rank: 3
          },
          {
            address: '0x4567890123abcdef4567890123abcdef45678901',
            gamesPlayed: 27,
            gamesWon: 14,
            winRate: 51.85,
            totalEarnings: 0.00266,
            rank: 4
          },
          {
            address: '0x5678901234abcdef5678901234abcdef56789012',
            gamesPlayed: 25,
            gamesWon: 12,
            winRate: 48.00,
            totalEarnings: 0.00228,
            rank: 5
          },
          {
            address: '0x6789012345abcdef6789012345abcdef67890123',
            gamesPlayed: 22,
            gamesWon: 10,
            winRate: 45.45,
            totalEarnings: 0.00190,
            rank: 6
          },
          {
            address: '0x7890123456abcdef7890123456abcdef78901234',
            gamesPlayed: 19,
            gamesWon: 8,
            winRate: 42.11,
            totalEarnings: 0.00152,
            rank: 7
          },
          {
            address: '0x8901234567abcdef8901234567abcdef89012345',
            gamesPlayed: 15,
            gamesWon: 6,
            winRate: 40.00,
            totalEarnings: 0.00114,
            rank: 8
          },
          {
            address: '0x9012345678abcdef9012345678abcdef90123456',
            gamesPlayed: 12,
            gamesWon: 4,
            winRate: 33.33,
            totalEarnings: 0.00076,
            rank: 9
          },
          {
            address: '0x0123456789abcdef0123456789abcdef01234567',
            gamesPlayed: 8,
            gamesWon: 2,
            winRate: 25.00,
            totalEarnings: 0.00038,
            rank: 10
          }
        ];
        
        // Add the current user if they're not in the top 10
        if (account && !mockPlayers.find(p => p.address.toLowerCase() === account.toLowerCase())) {
          mockPlayers.push({
            address: account,
            gamesPlayed: 5,
            gamesWon: 2,
            winRate: 40.00,
            totalEarnings: 0.00038,
            rank: 15
          });
        }
        
        setPlayers(mockPlayers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [account]);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">Leaderboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Player
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Games
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Wins
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Win Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {players.map((player) => (
                  <tr 
                    key={player.address}
                    className={`${player.address.toLowerCase() === account?.toLowerCase() ? 'bg-gray-700' : ''} hover:bg-gray-700`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-white">
                          {player.rank <= 3 ? (
                            <span className={`
                              inline-flex items-center justify-center w-6 h-6 rounded-full 
                              ${player.rank === 1 ? 'bg-yellow-500' : 
                                player.rank === 2 ? 'bg-gray-400' : 'bg-yellow-700'}
                            `}>
                              {player.rank}
                            </span>
                          ) : (
                            player.rank
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`text-sm font-medium ${player.address.toLowerCase() === account?.toLowerCase() ? 'text-orange-400' : 'text-white'}`}>
                          {formatAddress(player.address)}
                          {player.address.toLowerCase() === account?.toLowerCase() && (
                            <span className="ml-2 text-xs text-orange-400">(You)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{player.gamesPlayed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{player.gamesWon}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{player.winRate.toFixed(2)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-400">{player.totalEarnings.toFixed(5)} ETH</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 