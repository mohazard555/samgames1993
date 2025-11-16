import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];

const MindAdventures: React.FC<GameProps> = ({ gameName }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'watching' | 'playing' | 'over'>('idle');
  const [level, setLevel] = useState(0);

  const nextRound = useCallback(() => {
    setGameState('watching');
    setPlayerSequence([]);
    const newSequence = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    
    // Flash sequence
    newSequence.forEach((colorIndex, i) => {
      setTimeout(() => {
        setActiveColor(colorIndex);
        setTimeout(() => setActiveColor(null), 400);
      }, (i + 1) * 700);
    });

    setTimeout(() => {
      setGameState('playing');
    }, newSequence.length * 700 + 200);

  }, [sequence]);
  
  const startGame = () => {
    setLevel(1);
    setSequence([]);
    // A little hack with setTimeout to make sure sequence is empty before nextRound
    setTimeout(() => nextRound(), 0); 
  };
  
  useEffect(() => {
      if (sequence.length > 0 && level > 1) {
          nextRound();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const handleColorClick = (colorIndex: number) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    if (sequence[newPlayerSequence.length - 1] !== colorIndex) {
      setGameState('over');
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setLevel(l => l + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-indigo-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          → العودة
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
          المستوى: {level > 0 ? level - 1 : 0}
        </div>
      </div>
      
      {gameState === 'idle' || gameState === 'over' ? (
        <div className="flex flex-col items-center justify-center h-96">
            {gameState === 'over' && <h2 className="text-4xl font-bold text-red-600 mb-4">لقد خسرت! وصلت للمستوى {level -1}</h2>}
            <button onClick={startGame} className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-full text-2xl hover:bg-indigo-700 transition-transform transform hover:scale-105">
                {gameState === 'idle' ? 'ابدأ اللعبة' : 'العب مرة أخرى'}
            </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl mb-4 font-semibold">
                {gameState === 'watching' ? '...شاهد' : 'دورك!'}
            </h2>
            <div className="grid grid-cols-2 gap-4 w-80 h-80">
                {COLORS.map((color, index) => (
                    <button
                        key={index}
                        onClick={() => handleColorClick(index)}
                        disabled={gameState !== 'playing'}
                        className="w-full h-full rounded-2xl transition-opacity"
                        style={{ backgroundColor: color, opacity: activeColor === index ? 1 : 0.6 }}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default MindAdventures;