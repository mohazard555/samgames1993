import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const TRACK_LENGTH = 80; // Represents percentage of width

const CarRace: React.FC<GameProps> = ({ gameName }) => {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [cpuPosition, setCpuPosition] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'racing' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [winner, setWinner] = useState<'player' | 'cpu' | null>(null);
  
  const raceInterval = useRef<number | null>(null);

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (gameState === 'countdown' && countdown === 0) {
      setGameState('racing');
    }
  }, [gameState, countdown]);

  useEffect(() => {
    if (gameState === 'racing') {
      raceInterval.current = window.setInterval(() => {
        setCpuPosition(p => Math.min(TRACK_LENGTH, p + Math.random() * 0.6));
      }, 100);
    } else {
      if (raceInterval.current) clearInterval(raceInterval.current);
    }
    return () => {
        if(raceInterval.current) clearInterval(raceInterval.current)
    };
  }, [gameState]);
  
  useEffect(() => {
      if(playerPosition >= TRACK_LENGTH) {
          setWinner('player');
          setGameState('finished');
      }
      if(cpuPosition >= TRACK_LENGTH) {
          setWinner('cpu');
          setGameState('finished');
      }
  }, [playerPosition, cpuPosition]);

  const handleStartGame = () => {
    setPlayerPosition(0);
    setCpuPosition(0);
    setWinner(null);
    setCountdown(3);
    setGameState('countdown');
  };
  
  const handlePlayerMove = () => {
      if (gameState === 'racing') {
          setPlayerPosition(p => Math.min(TRACK_LENGTH, p + 0.8));
      }
  }

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-red-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">→ العودة</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-red-800">{gameName}</h1>
        <div className="w-24"></div>
      </div>
      
      <div className="bg-gray-200 p-4 rounded-lg relative h-48 flex flex-col justify-around">
          {/* Track Lines */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/50 border-dashed border-t-4 border-white"></div>
          
          {/* Player Car */}
          <div className="relative h-12">
            <div className="absolute text-5xl transition-all duration-100 ease-linear" style={{ left: `${playerPosition}%` }}>🚗</div>
            <div className="absolute right-0 text-3xl">🏁</div>
          </div>
          {/* CPU Car */}
           <div className="relative h-12">
            <div className="absolute text-5xl transition-all duration-100 ease-linear" style={{ left: `${cpuPosition}%` }}>🚓</div>
            <div className="absolute right-0 text-3xl">🏁</div>
          </div>
      </div>
      
      <div className="mt-6 h-40 flex items-center justify-center">
        {gameState === 'idle' && (
            <button onClick={handleStartGame} className="bg-green-500 text-white font-bold py-4 px-8 rounded-full text-3xl hover:bg-green-600 transition-transform transform hover:scale-105">
                ابدأ السباق
            </button>
        )}
        {gameState === 'countdown' && <div className="text-8xl font-bold text-red-600 animate-ping">{countdown}</div>}
        {gameState === 'racing' && (
             <button onMouseDown={handlePlayerMove} onTouchStart={handlePlayerMove} className="bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-3xl hover:bg-blue-600 active:scale-95 transition-transform transform">
                انطلق!
            </button>
        )}
        {gameState === 'finished' && (
            <div className="flex flex-col items-center">
                <h2 className="text-5xl font-bold mb-4">{winner === 'player' ? '🎉 لقد فزت! 🎉' : '😞 لقد خسرت 😞'}</h2>
                <button onClick={handleStartGame} className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-full text-2xl hover:bg-yellow-600 transition-transform transform hover:scale-105">
                    العب مرة أخرى
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CarRace;