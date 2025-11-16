import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

interface Fish {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
  direction: 'left' | 'right';
  size: number;
}

const FISH_TYPES = ['🐠', '🐟', '🐡', '🦐', '🦀'];
const GAME_DURATION = 30; // seconds

const FishCatching: React.FC<GameProps> = ({ gameName }) => {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');

  const createFish = useCallback((): Fish => {
    const direction = Math.random() > 0.5 ? 'left' : 'right';
    return {
      id: Date.now() + Math.random(),
      emoji: FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)],
      x: direction === 'right' ? -10 : 110,
      y: Math.random() * 85, // percentage from top
      speed: Math.random() * 0.3 + 0.1,
      direction,
      size: Math.random() * 3 + 2, // rem size
    };
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFishes(Array.from({ length: 5 }, createFish));
    setGameState('playing');
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameInterval = setInterval(() => {
      setFishes(fishes => {
        return fishes.map(fish => {
          const newX = fish.direction === 'right' ? fish.x + fish.speed : fish.x - fish.speed;
          if ((fish.direction === 'right' && newX > 110) || (fish.direction === 'left' && newX < -10)) {
            // Fish is off-screen, remove it, it will be replaced later
            return { ...fish, id: -1 }; // Mark for removal
          }
          return { ...fish, x: newX };
        }).filter(f => f.id !== -1);
      });
    }, 16); // ~60fps

    return () => clearInterval(gameInterval);
  }, [gameState]);

  // Fish spawner
  useEffect(() => {
    if (gameState !== 'playing') return;
    const spawnInterval = setInterval(() => {
        setFishes(fishes => {
            if (fishes.length < 10) {
                return [...fishes, createFish()];
            }
            return fishes;
        });
    }, 1000);
    return () => clearInterval(spawnInterval);
  }, [gameState, createFish]);


  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('finished');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const catchFish = (id: number) => {
    setFishes(fishes => fishes.filter(f => f.id !== id));
    setScore(s => s + 10);
  };
  
  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">→ العودة</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">{gameName}</h1>
        <div className="flex gap-4">
            <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            <div className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">الوقت: {timeLeft}</div>
        </div>
      </div>

      <div className="relative w-full h-[400px] bg-blue-100 rounded-lg overflow-hidden cursor-pointer" style={{backgroundImage: 'linear-gradient(to bottom, #87CEEB, #1E90FF)'}}>
        {gameState === 'playing' ? (
          fishes.map(fish => (
            <div
              key={fish.id}
              className="absolute transition-all duration-1000 ease-linear"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y}%`,
                fontSize: `${fish.size}rem`,
                transform: `translate(-50%, -50%) ${fish.direction === 'left' ? 'scaleX(-1)' : ''}`,
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={() => catchFish(fish.id)}
            >
              {fish.emoji}
            </div>
          ))
        ) : (
             <div className="flex flex-col items-center justify-center h-full">
                {gameState === 'finished' && <h2 className="text-4xl font-bold text-white mb-4">انتهى الوقت! نتيجتك: {score}</h2>}
                <button onClick={startGame} className="bg-yellow-500 text-white font-bold py-4 px-8 rounded-full text-2xl hover:bg-yellow-600 transition-transform transform hover:scale-105">
                    {gameState === 'idle' ? 'ابدأ الصيد' : 'العب مرة أخرى'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default FishCatching;
