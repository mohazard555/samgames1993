import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playWhackSound, playWinFanfare, playClickSound } from '../utils/soundEffects';

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
      setTimeLeft((t) => {
        if (t > 1) return t - 1;
        setIsActive(false);
        playWinFanfare();
        return 0;
      });
    }, 1000);

    const moleInterval = setInterval(() => {
      const newMoles = new Array(9).fill(false);
      const randomIndex = Math.floor(Math.random() * 9);
      newMoles[randomIndex] = true;
      setMoles(newMoles);
    }, 750);

    return () => {
      clearInterval(gameTimer);
      clearInterval(moleInterval);
    };
  }, [isActive]);

  const whackMole = (index: number) => {
    if (!moles[index] || !isActive) return;
    playWhackSound();
    setScore((s) => s + 1);
    setMoles((prevMoles) => {
      const newMoles = [...prevMoles];
      newMoles[index] = false;
      return newMoles;
    });
  };

  const startGame = () => {
    playClickSound();
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsActive(true);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-lime-300">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow"
        >
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-lime-800">{gameName}</h1>
        <div className="flex gap-2">
          <div className="bg-green-500 text-white font-bold py-1.5 px-3 rounded-xl shadow text-sm sm:text-base">
            النقاط: {score}
          </div>
          <div className="bg-blue-500 text-white font-bold py-1.5 px-3 rounded-xl shadow text-sm sm:text-base">
            الوقت: {timeLeft}
          </div>
        </div>
      </div>

      {!isActive && (
        <div className="flex flex-col items-center justify-center p-8 bg-lime-50 rounded-3xl border-2 border-lime-200">
          <span className="text-6xl mb-3 animate-bounce">🐹</span>
          {timeLeft === 0 && (
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4">
              انتهى الوقت يا بطل! مجموع نقاطك: {score} 🏆
            </h2>
          )}
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-lime-600 to-green-600 text-white font-black py-4 px-10 rounded-2xl text-xl hover:scale-105 transition-transform shadow-xl"
          >
            {timeLeft === 0 ? 'العب مرة أخرى 🔄' : 'ابدأ اصطياد السناجب! 🚀'}
          </button>
        </div>
      )}

      {isActive && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-gradient-to-b from-lime-100 to-green-200 p-4 sm:p-6 rounded-3xl border-4 border-lime-300 max-w-lg mx-auto">
          {moles.map((isUp, index) => (
            <div
              key={index}
              className="h-28 sm:h-32 bg-amber-900 rounded-3xl flex justify-center items-center cursor-pointer border-4 border-amber-950 overflow-hidden shadow-inner hover:brightness-110 active:scale-95 transition-all"
              onClick={() => whackMole(index)}
            >
              {isUp && (
                <span className="text-5xl sm:text-6xl select-none animate-bounce">
                  🐹
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhackAMole;
