import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const GAME_DURATION = 30; // 30 seconds

const WhackAMole: React.FC<GameProps> = ({ gameName }) => {
  const [moles, setMoles] = useState<boolean[]>(new Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const gameTimer = setInterval(() => {
      setTimeLeft(t => {
        if (t > 1) return t - 1;
        setIsActive(false);
        return 0;
      });
    }, 1000);

    const moleInterval = setInterval(() => {
      const newMoles = new Array(9).fill(false);
      const randomIndex = Math.floor(Math.random() * 9);
      newMoles[randomIndex] = true;
      setMoles(newMoles);
    }, 800);

    return () => {
      clearInterval(gameTimer);
      clearInterval(moleInterval);
    };
  }, [isActive]);

  const whackMole = (index: number) => {
    if (!moles[index] || !isActive) return;
    setScore(s => s + 1);
    setMoles(prevMoles => {
      const newMoles = [...prevMoles];
      newMoles[index] = false;
      return newMoles;
    });
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsActive(true);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-lime-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">→ العودة</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-lime-800">{gameName}</h1>
        <div className="flex gap-4">
            <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">الوقت: {timeLeft}</div>
        </div>
      </div>

      {!isActive && (
        <div className="flex flex-col items-center justify-center h-96">
            {timeLeft === 0 && <h2 className="text-4xl font-bold text-gray-800 mb-4">انتهى الوقت! نتيجتك النهائية: {score}</h2>}
            <button onClick={startGame} className="bg-lime-600 text-white font-bold py-4 px-8 rounded-full text-2xl hover:bg-lime-700 transition-transform transform hover:scale-105">
                {timeLeft === 0 ? 'العب مرة أخرى' : 'ابدأ اللعب'}
            </button>
        </div>
      )}

      {isActive && (
        <div className="grid grid-cols-3 gap-4 bg-lime-100 p-4 rounded-lg">
            {moles.map((isUp, index) => (
            <div key={index} className="h-32 bg-yellow-800 rounded-full flex justify-center items-center cursor-pointer border-4 border-yellow-900 overflow-hidden" onClick={() => whackMole(index)}>
                {isUp && <span className="text-6xl select-none" style={{ animation: 'mole-pop 0.3s ease-out' }}>🐹</span>}
            </div>
            ))}
        </div>
      )}
       <style>{`
        @keyframes mole-pop {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WhackAMole;
