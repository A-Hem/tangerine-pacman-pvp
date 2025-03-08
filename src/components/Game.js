import React, { useEffect, useRef, useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import PaymentSelector from './PaymentSelector';
import io from 'socket.io-client';
import { TRAP_TOKEN_INFO } from '../config';

// Game constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const CELL_SIZE = 20;
const GRID_WIDTH = CANVAS_WIDTH / CELL_SIZE;
const GRID_HEIGHT = CANVAS_HEIGHT / CELL_SIZE;

// Game states
const GAME_STATE = {
  WAITING_FOR_PAYMENT: 'WAITING_FOR_PAYMENT',
  WAITING_FOR_OPPONENT: 'WAITING_FOR_OPPONENT',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER'
};

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(GAME_STATE.WAITING_FOR_PAYMENT);
  const [gameId, setGameId] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  
  const { account, enterGame, claimReward, paymentMethod } = useWeb3();
  
  // Initialize socket connection
  useEffect(() => {
    // In a real app, this would connect to your backend server
    // For now, we'll simulate the socket connection
    const newSocket = {
      on: (event, callback) => {
        // Simulate socket events
        if (event === 'gameStart') {
          setTimeout(() => {
            callback({
              gameId: '12345',
              opponent: '0x1234567890abcdef1234567890abcdef12345678'
            });
          }, 1000);
        }
      },
      emit: (event, data) => {
        console.log(`Emitting ${event} with data:`, data);
      }
    };
    
    setSocket(newSocket);
    
    return () => {
      // Cleanup socket connection
      if (socket) {
        // socket.disconnect();
      }
    };
  }, []);
  
  // Handle game payment
  const handlePayForGame = async () => {
    try {
      setError(null);
      const success = await enterGame();
      if (success) {
        setGameState(GAME_STATE.WAITING_FOR_OPPONENT);
        
        // In a real app, this would be handled by the socket connection
        // For now, we'll simulate finding an opponent after a delay
        setTimeout(() => {
          setGameState(GAME_STATE.PLAYING);
          setGameId('12345');
          setOpponent('0x1234567890abcdef1234567890abcdef12345678');
          setCountdown(3);
          
          // Start countdown
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }, 3000);
      }
    } catch (error) {
      console.error('Error paying for game:', error);
      setError(error.message || "Failed to pay for game");
    }
  };
  
  // Handle claiming reward
  const handleClaimReward = async () => {
    try {
      await claimReward();
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };
  
  // Initialize game
  useEffect(() => {
    if (gameState !== GAME_STATE.PLAYING || countdown !== null) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Game variables
    let player = {
      x: 1,
      y: 1,
      direction: 'right',
      score: 0
    };
    
    let opponent = {
      x: GRID_WIDTH - 2,
      y: GRID_HEIGHT - 2,
      direction: 'left',
      score: 0
    };
    
    // Create maze
    const maze = createMaze();
    
    // Create dots
    let dots = createDots(maze);
    
    // Game loop
    let gameLoopId;
    
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw maze
      drawMaze(ctx, maze);
      
      // Draw dots
      drawDots(ctx, dots);
      
      // Move player
      movePlayer(player);
      
      // Simulate opponent movement
      moveOpponent(opponent, player, maze);
      
      // Check for dot collection
      checkDotCollection(player, dots);
      checkDotCollection(opponent, dots);
      
      // Draw players
      drawPlayer(ctx, player, 'orange');
      drawPlayer(ctx, opponent, 'red');
      
      // Update scores
      setScore(player.score);
      setOpponentScore(opponent.score);
      
      // Check for game over
      if (dots.length === 0) {
        endGame(player.score > opponent.score ? account : 'opponent');
      }
      
      // Continue game loop
      gameLoopId = requestAnimationFrame(gameLoop);
    };
    
    // Start game loop
    gameLoopId = requestAnimationFrame(gameLoop);
    
    // Handle keyboard input
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          player.direction = 'up';
          break;
        case 'ArrowDown':
          player.direction = 'down';
          break;
        case 'ArrowLeft':
          player.direction = 'left';
          break;
        case 'ArrowRight':
          player.direction = 'right';
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(gameLoopId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, countdown, account]);
  
  // Create maze
  const createMaze = () => {
    // Simple maze representation: 1 = wall, 0 = path
    const maze = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
    
    // Add outer walls
    for (let x = 0; x < GRID_WIDTH; x++) {
      maze[0][x] = 1;
      maze[GRID_HEIGHT - 1][x] = 1;
    }
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
      maze[y][0] = 1;
      maze[y][GRID_WIDTH - 1] = 1;
    }
    
    // Add some internal walls
    for (let i = 5; i < 15; i++) {
      maze[5][i] = 1;
      maze[15][i] = 1;
    }
    
    for (let i = 5; i < 15; i++) {
      maze[i][5] = 1;
      maze[i][15] = 1;
    }
    
    return maze;
  };
  
  // Create dots
  const createDots = (maze) => {
    const dots = [];
    
    for (let y = 1; y < GRID_HEIGHT - 1; y++) {
      for (let x = 1; x < GRID_WIDTH - 1; x++) {
        if (maze[y][x] === 0 && (x % 2 === 0 || y % 2 === 0)) {
          dots.push({ x, y });
        }
      }
    }
    
    return dots;
  };
  
  // Draw maze
  const drawMaze = (ctx, maze) => {
    ctx.fillStyle = 'blue';
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (maze[y][x] === 1) {
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  };
  
  // Draw dots
  const drawDots = (ctx, dots) => {
    ctx.fillStyle = 'white';
    
    for (const dot of dots) {
      ctx.beginPath();
      ctx.arc(
        dot.x * CELL_SIZE + CELL_SIZE / 2,
        dot.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 6,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };
  
  // Draw player
  const drawPlayer = (ctx, player, color) => {
    ctx.fillStyle = color;
    
    // Draw tangerine body (circle)
    ctx.beginPath();
    ctx.arc(
      player.x * CELL_SIZE + CELL_SIZE / 2,
      player.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw mouth
    ctx.fillStyle = 'black';
    ctx.beginPath();
    
    const centerX = player.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = player.y * CELL_SIZE + CELL_SIZE / 2;
    
    switch (player.direction) {
      case 'right':
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + CELL_SIZE / 2, centerY - CELL_SIZE / 4);
        ctx.lineTo(centerX + CELL_SIZE / 2, centerY + CELL_SIZE / 4);
        break;
      case 'left':
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX - CELL_SIZE / 2, centerY - CELL_SIZE / 4);
        ctx.lineTo(centerX - CELL_SIZE / 2, centerY + CELL_SIZE / 4);
        break;
      case 'up':
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX - CELL_SIZE / 4, centerY - CELL_SIZE / 2);
        ctx.lineTo(centerX + CELL_SIZE / 4, centerY - CELL_SIZE / 2);
        break;
      case 'down':
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX - CELL_SIZE / 4, centerY + CELL_SIZE / 2);
        ctx.lineTo(centerX + CELL_SIZE / 4, centerY + CELL_SIZE / 2);
        break;
      default:
        break;
    }
    
    ctx.fill();
  };
  
  // Move player
  const movePlayer = (player) => {
    switch (player.direction) {
      case 'up':
        if (player.y > 1) player.y -= 0.1;
        break;
      case 'down':
        if (player.y < GRID_HEIGHT - 2) player.y += 0.1;
        break;
      case 'left':
        if (player.x > 1) player.x -= 0.1;
        break;
      case 'right':
        if (player.x < GRID_WIDTH - 2) player.x += 0.1;
        break;
      default:
        break;
    }
  };
  
  // Move opponent (simple AI)
  const moveOpponent = (opponent, player, maze) => {
    // Simple AI: move towards the player
    const dx = player.x - opponent.x;
    const dy = player.y - opponent.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      opponent.direction = dx > 0 ? 'right' : 'left';
    } else {
      opponent.direction = dy > 0 ? 'down' : 'up';
    }
    
    // Move in the chosen direction
    switch (opponent.direction) {
      case 'up':
        if (opponent.y > 1) opponent.y -= 0.08;
        break;
      case 'down':
        if (opponent.y < GRID_HEIGHT - 2) opponent.y += 0.08;
        break;
      case 'left':
        if (opponent.x > 1) opponent.x -= 0.08;
        break;
      case 'right':
        if (opponent.x < GRID_WIDTH - 2) opponent.x += 0.08;
        break;
      default:
        break;
    }
  };
  
  // Check for dot collection
  const checkDotCollection = (player, dots) => {
    for (let i = dots.length - 1; i >= 0; i--) {
      const dot = dots[i];
      const dx = player.x - dot.x;
      const dy = player.y - dot.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 0.5) {
        dots.splice(i, 1);
        player.score += 10;
      }
    }
  };
  
  // End game
  const endGame = (winner) => {
    setGameState(GAME_STATE.GAME_OVER);
    setWinner(winner);
  };
  
  // Render game UI based on game state
  const renderGameUI = () => {
    switch (gameState) {
      case GAME_STATE.WAITING_FOR_PAYMENT:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-orange-500 mb-6">Ready to Play?</h2>
            
            <PaymentSelector />
            
            {error && (
              <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <button 
              onClick={handlePayForGame}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-xl font-bold"
            >
              Pay & Play Now
            </button>
          </div>
        );
      
      case GAME_STATE.WAITING_FOR_OPPONENT:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-orange-500 mb-6">Waiting for Opponent</h2>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-300">Payment successful! Looking for an opponent...</p>
            <p className="text-gray-400 text-sm mt-4">Using {paymentMethod === 'eth' ? 'ETH' : `${TRAP_TOKEN_INFO.symbol} tokens`} for this game</p>
          </div>
        );
      
      case GAME_STATE.PLAYING:
        return (
          <div className="flex flex-col items-center">
            {countdown !== null ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10">
                <div className="text-6xl font-bold text-orange-500">{countdown}</div>
              </div>
            ) : null}
            
            <div className="flex justify-between w-full mb-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300">Your Score: <span className="text-orange-500 font-bold">{score}</span></p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300">Opponent Score: <span className="text-red-500 font-bold">{opponentScore}</span></p>
              </div>
            </div>
            
            <canvas 
              ref={canvasRef} 
              width={CANVAS_WIDTH} 
              height={CANVAS_HEIGHT}
              className="border-4 border-gray-700 rounded-lg"
            ></canvas>
            
            <div className="mt-4 text-gray-300">
              <p>Use arrow keys to move your Pacman</p>
            </div>
          </div>
        );
      
      case GAME_STATE.GAME_OVER:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">Game Over!</h2>
            
            {winner === account ? (
              <div className="bg-green-500 text-white p-6 rounded-lg mb-6 text-center">
                <p className="text-2xl font-bold mb-2">You Won!</p>
                <p>Congratulations! You've earned a reward.</p>
              </div>
            ) : (
              <div className="bg-red-500 text-white p-6 rounded-lg mb-6 text-center">
                <p className="text-2xl font-bold mb-2">You Lost!</p>
                <p>Better luck next time!</p>
              </div>
            )}
            
            <div className="flex gap-4">
              {winner === account && (
                <button 
                  onClick={handleClaimReward}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
                >
                  Claim Reward
                </button>
              )}
              
              <button 
                onClick={() => setGameState(GAME_STATE.WAITING_FOR_PAYMENT)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                Play Again
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">Tangerine Pacman PVP</h1>
      
      {renderGameUI()}
    </div>
  );
};

export default Game; 