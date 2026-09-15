import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playSuccessSound, playErrorSound } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

const BiggerOrSmaller: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [numbers, setNumbers] = useState([0, 0]);
  const [mode, setMode] = useState<'bigger' | 'smaller'>('bigger');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateRound = useCallback(() => {
    setFeedback(null);
    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 20) + 1;
    while (num1 === num2) {
      num2 = Math.floor(Math.random() * 20) + 1;
    }
    setNumbers([num1, num2]);
    setMode(Math.random() > 0.5 ? 'bigger' : 'smaller');
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleNumberClick = (selectedNum: number) => {
    if (feedback) return;
    const [num1, num2] = numbers;
    const correct = mode === 'bigger' ? selectedNum === Math.max(num1, num2) : selectedNum === Math.min(num1, num2);

    if (correct) {
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
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-teal-300">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow"
        >
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-teal-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl shadow">النقاط: {score}</div>
      </div>

      <div className="bg-teal-50 p-6 sm:p-8 rounded-3xl border border-teal-200 shadow-inner">
        <h2 className="text-2xl sm:text-4xl font-black text-gray-800 mb-8">
          اختر الرقم <span className="text-teal-600 underline decoration-wavy">{mode === 'bigger' ? 'الأكبر 🔼' : 'الأصغر 🔽'}</span>
        </h2>

        <div className="flex justify-center items-center gap-6 sm:gap-10">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-36 h-36 sm:w-48 sm:h-48 bg-white hover:bg-teal-100 rounded-3xl flex items-center justify-center border-4 border-teal-300 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="text-6xl sm:text-8xl font-black text-teal-900">{num}</span>
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="mt-6 text-2xl sm:text-3xl font-black animate-bounce">
          {feedback === 'correct' && (
            <p className="text-emerald-600 bg-emerald-50 py-3 rounded-2xl border border-emerald-200">
              🎉 رائع! إجابة رياضية صحيحة! 🎉
            </p>
          )}
          {feedback === 'incorrect' && (
            <p className="text-rose-600 bg-rose-50 py-3 rounded-2xl border border-rose-200">
              😞 إجابة غير صحيحة.. فكّر وحاول مجدداً! 😞
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BiggerOrSmaller;
