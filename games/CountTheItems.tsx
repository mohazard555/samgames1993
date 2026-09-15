import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playSuccessSound, playErrorSound } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

const ITEMS: { [key: string]: string } = {
  'عد الفواكه': '🍓',
  'عد الكواكب': '🪐',
};

const CountTheItems: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [targetCount, setTargetCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const itemEmoji = ITEMS[gameName] || '⭐';

  const generateRound = useCallback(() => {
    setFeedback(null);
    const newTarget = Math.floor(Math.random() * 9) + 1; // 1 to 9
    setTargetCount(newTarget);

    const opts = new Set<number>([newTarget]);
    while (opts.size < 4) {
      const wrongOpt = Math.floor(Math.random() * 9) + 1;
      opts.add(wrongOpt);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleOptionClick = (option: number) => {
    if (feedback) return;

    if (option === targetCount) {
      setScore((s) => s + 10);
      setFeedback('correct');
      playSuccessSound();
    } else {
      setFeedback('incorrect');
      playErrorSound();
    }

    setTimeout(generateRound, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-amber-300">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow"
        >
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-amber-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl shadow">النقاط: {score}</div>
      </div>

      <div className="bg-amber-50 p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-inner">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6">كم عدد {itemEmoji} في الصندوق؟</h2>

        <div className="bg-white min-h-[150px] p-6 rounded-2xl flex flex-wrap justify-center items-center gap-4 mb-8 border-2 border-amber-200 shadow">
          {Array.from({ length: targetCount }).map((_, i) => (
            <span key={i} className="text-5xl sm:text-6xl animate-bounce select-none">
              {itemEmoji}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className="bg-gradient-to-tr from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-4xl sm:text-5xl p-5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-amber-300"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="mt-6 text-2xl sm:text-3xl font-black animate-bounce">
          {feedback === 'correct' && (
            <p className="text-emerald-600 bg-emerald-50 py-3 rounded-2xl border border-emerald-200">
              🎉 رائع! إجابة دقيقة وصحيحة! 🎉
            </p>
          )}
          {feedback === 'incorrect' && (
            <p className="text-rose-600 bg-rose-50 py-3 rounded-2xl border border-rose-200">
              😞 ليس هذا العدد.. حاول مرة أخرى! 😞
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CountTheItems;
