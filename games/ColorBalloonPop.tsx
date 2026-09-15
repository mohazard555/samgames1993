import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playPopSound, playSuccessSound, playErrorSound, playWinFanfare } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

const COLORS = [
  { name: 'أحمر', hex: '#ef4444', border: 'border-red-400' },
  { name: 'أزرق', hex: '#3b82f6', border: 'border-blue-400' },
  { name: 'أخضر', hex: '#22c55e', border: 'border-green-400' },
  { name: 'أصفر', hex: '#eab308', border: 'border-yellow-400' },
];

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: (typeof COLORS)[0];
}

const ColorBalloonPop: React.FC<GameProps> = ({ gameName }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');

  const changeTargetColor = useCallback(() => {
    setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setBalloons([]);
    changeTargetColor();
    setGameState('playing');
  };

  // Game Timer & Color Changer
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('finished');
      playWinFanfare();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
      if ((timeLeft - 1) % 5 === 0) changeTargetColor();
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft, changeTargetColor]);

  // Balloon Spawner & Mover
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setBalloons((b) => b.map((bal) => ({ ...bal, y: bal.y - 1.2 })).filter((bal) => bal.y > -20));
      if (Math.random() > 0.5) {
        const newBalloon: Balloon = {
          id: Date.now() + Math.random(),
          x: Math.random() * 85 + 5,
          y: 105,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
        setBalloons((b) => [...b, newBalloon]);
      }
    }, 90);
    return () => clearInterval(interval);
  }, [gameState]);

  const popBalloon = (balloon: Balloon) => {
    playPopSound();
    if (balloon.color.name === targetColor.name) {
      setScore((s) => s + 10);
      playSuccessSound();
    } else {
      setScore((s) => Math.max(0, s - 5));
      playErrorSound();
    }
    setBalloons((b) => b.filter((b) => b.id !== balloon.id));
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-pink-300">
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/"
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow"
        >
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-pink-800">{gameName}</h1>
        <div className="flex gap-2">
          <div className="bg-green-500 text-white font-bold py-1.5 px-3 rounded-xl shadow text-sm sm:text-base">
            النقاط: {score}
          </div>
          <div className="bg-red-500 text-white font-bold py-1.5 px-3 rounded-xl shadow text-sm sm:text-base">
            الوقت: {timeLeft}
          </div>
        </div>
      </div>

      <div
        className="p-4 rounded-2xl mb-4 shadow text-white font-black text-xl sm:text-2xl transition-colors"
        style={{ backgroundColor: targetColor.hex }}
      >
        🎈 فرقع البالونات ذات اللون: {targetColor.name}! 🎈
      </div>

      <div className="relative w-full h-[450px] sm:h-[500px] bg-gradient-to-b from-sky-100 to-sky-200 rounded-3xl overflow-hidden border-4 border-sky-300 shadow-inner">
        {gameState === 'playing' ? (
          balloons.map((b) => (
            <div
              key={b.id}
              onClick={() => popBalloon(b)}
              className="absolute text-5xl sm:text-6xl cursor-pointer select-none hover:scale-125 active:scale-90 transition-transform"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              🎈
            </div>
          ))
        ) : gameState === 'finished' ? (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-white/90">
            <span className="text-6xl mb-2">🏆</span>
            <h3 className="text-3xl font-black text-purple-800 mb-2">انتهت اللعبة يا بطل!</h3>
            <p className="text-2xl font-bold text-gray-700 mb-6">مجموع نقاطك: {score} نقطة 🎉</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl py-3 px-8 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              العب مرة أخرى 🔄
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <span className="text-6xl mb-4 animate-bounce">🎈</span>
            <h3 className="text-2xl sm:text-3xl font-black text-sky-900 mb-4">هل أنت مستعد لفرقعة البالونات؟</h3>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-2xl py-4 px-10 rounded-3xl shadow-xl hover:scale-105 transition-transform"
            >
              ابدأ اللعب الآن! 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorBalloonPop;
