import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Navbar from './components/Navbar';
import { useWeb3 } from './contexts/Web3Context';

function App() {
  const { isConnected, isGameAdmin } = useWeb3();

  return (
    <div className="App min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/game" 
            element={isConnected ? <Game /> : <Home />} 
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route 
            path="/profile" 
            element={isConnected ? <Profile /> : <Home />} 
          />
          <Route 
            path="/admin" 
            element={<Admin />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App; 