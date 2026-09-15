import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playSuccessSound, playErrorSound } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

const ITEMS = [
  { name: 'تفاحة', emoji: '🍎', type: 'فاكهة' },
  { name: 'بروكلي', emoji: '🥦', type: 'خضار' },
  { name: 'موز', emoji: '🍌', type: 'فاكهة' },
  { name: 'جزر', emoji: '🥕', type: 'خضار' },
  { name: 'فراولة', emoji: '🍓', type: 'فاكهة' },
  { name: 'طماطم', emoji: '🍅', type: 'خضار' },
  { name: 'برتقال', emoji: '🍊', type: 'فاكهة' },
  { name: 'خيار', emoji: '🥒', type: 'خضار' },
  { name: 'عنب', emoji: '🍇', type: 'فاكهة' },
  { name: 'باذنجان', emoji: '🍆', type: 'خضار' },
  { name: 'بطيخ', emoji: '🍉', type: 'فاكهة' },
  { name: 'ذرة', emoji: '🌽', type: 'خضار' },
];

const VegetableOrFruit: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [currentItem, setCurrentItem] = useState(ITEMS[0]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateRound = useCallback(() => {
    setFeedback(null);
    setCurrentItem(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleGuess = (guess: 'فاكهة' | 'خضار') => {
    if (feedback) return;
    if (guess === currentItem.type) {
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
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-rose-300">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow"
        >
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-rose-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl shadow">النقاط: {score}</div>
      </div>

      <div className="bg-gradient-to-b from-rose-50 to-orange-50 p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-inner">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">هل هذا الصنف فاكهة 🍎 أم خضار 🥦؟</h2>
        <span className="text-lg font-bold text-gray-600 mb-4 block">({currentItem.name})</span>

        <div className="text-8xl sm:text-9xl mb-8 transform hover:scale-110 transition-transform select-none">
          {currentItem.emoji}
        </div>

        <div className="flex justify-center items-center gap-4 sm:gap-8 max-w-md mx-auto">
          <button
            onClick={() => handleGuess('فاكهة')}
            className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-2xl sm:text-3xl py-4 sm:py-5 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-red-400"
          >
            🍎 فاكهة
          </button>
          <button
            onClick={() => handleGuess('خضار')}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-2xl sm:text-3xl py-4 sm:py-5 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-emerald-400"
          >
            🥦 خضار
          </button>
        </div>
      </div>

      {feedback && (
        <div className="mt-6 text-2xl sm:text-3xl font-black animate-bounce">
          {feedback === 'correct' && (
            <p className="text-emerald-600 bg-emerald-50 py-3 rounded-2xl border border-emerald-200">
              🎉 أحسنت! إجابة ذكية وصحيحة! 🎉
            </p>
          )}
          {feedback === 'incorrect' && (
            <p className="text-rose-600 bg-rose-50 py-3 rounded-2xl border border-rose-200">
              😞 إجابة غير دقيقة.. حاول مجدداً! 😞
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VegetableOrFruit;
