import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playSuccessSound, playErrorSound, playObjectSound } from '../utils/soundEffects';

interface GameProps { gameName: string; }

const INSTRUMENTS = [
  { name: 'جيتار', image: '🎸', options: ['جيتار', 'بيانو', 'طبل'] },
  { name: 'بيانو', image: '🎹', options: ['كمان', 'بيانو', 'بوق'] },
  { name: 'طبل', image: '🥁', options: ['بوق', 'جيتار', 'طبل'] },
  { name: 'كمان', image: '🎻', options: ['كمان', 'طبل', 'بيانو'] },
];

const MusicalInstruments: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [currentInstrument, setCurrentInstrument] = useState(INSTRUMENTS[0]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const playInstrument = useCallback((name?: string) => {
    playObjectSound(name || currentInstrument.name);
  }, [currentInstrument]);

  const generateRound = useCallback(() => {
    setFeedback(null);
    const newInstrument = INSTRUMENTS[Math.floor(Math.random() * INSTRUMENTS.length)];
    const shuffledOptions = [...newInstrument.options].sort(() => Math.random() - 0.5);
    const obj = { ...newInstrument, options: shuffledOptions };
    setCurrentInstrument(obj);
    setTimeout(() => {
      playObjectSound(obj.name);
    }, 250);
  }, []);

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (option: string) => {
    if (feedback) return;
    if (option === currentInstrument.name) {
      setScore((s) => s + 10);
      setFeedback('correct');
      playSuccessSound();
    } else {
      setFeedback('incorrect');
      playErrorSound();
    }
    setTimeout(generateRound, 1600);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-pink-400">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow">
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-pink-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl shadow">النقاط: {score}</div>
      </div>

      <div className="bg-gradient-to-b from-pink-50 to-rose-50 p-6 sm:p-8 rounded-3xl border border-pink-200 shadow-inner">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4">ما اسم هذه الآلة الموسيقية؟ 🎵</h2>

        <div className="my-4">
          <button
            onClick={() => playInstrument()}
            className="text-8xl sm:text-9xl mb-2 hover:scale-110 transition-transform active:scale-95 inline-block cursor-pointer"
            title="انقر لسماع الآلة الموسيقية"
          >
            {currentInstrument.image}
          </button>
          <div>
            <button
              onClick={() => playInstrument()}
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-black px-4 py-2 rounded-xl text-sm shadow active:scale-95 transition-all"
            >
              <span>🔊</span>
              <span>اسمع صوت الآلة</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto mt-6">
          {currentInstrument.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="bg-white hover:bg-pink-100 text-pink-700 font-black text-2xl p-4 sm:p-5 rounded-2xl border-2 border-pink-200 hover:border-pink-400 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="mt-6 text-2xl sm:text-3xl font-black animate-bounce">
          {feedback === 'correct' && <p className="text-emerald-600 bg-emerald-50 py-3 rounded-2xl border border-emerald-200">🎉 نغمة صحيحة ورائعة! 🎉</p>}
          {feedback === 'incorrect' && <p className="text-rose-600 bg-rose-50 py-3 rounded-2xl border border-rose-200">😞 إجابة خاطئة.. حاول مرة أخرى! 😞</p>}
        </div>
      )}
    </div>
  );
};

export default MusicalInstruments;
