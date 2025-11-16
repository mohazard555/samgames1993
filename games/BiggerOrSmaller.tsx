import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

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
    const correct = mode === 'bigger' 
      ? selectedNum === Math.max(num1, num2)
      : selectedNum === Math.min(num1, num2);

    if (correct) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    setTimeout(generateRound, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-teal-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          → العودة
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-teal-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
          النقاط: {score}
        </div>
      </div>

      <h2 className="text-4xl font-bold text-gray-700 mb-8">
        اختر الرقم <span className="text-teal-600">{mode === 'bigger' ? 'الأكبر' : 'الأصغر'}</span>
      </h2>

      <div className="flex justify-center items-center gap-8">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className="w-48 h-48 bg-teal-100 rounded-3xl flex items-center justify-center hover:bg-teal-200 transition-transform transform hover:scale-105"
          >
            <span className="text-8xl font-bold text-teal-900">{num}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div className="mt-8 text-4xl font-extrabold">
          {feedback === 'correct' && <p className="text-green-500">🎉 إجابة صحيحة! 🎉</p>}
          {feedback === 'incorrect' && <p className="text-red-500">😞 حاول مرة أخرى! 😞</p>}
        </div>
      )}
    </div>
  );
};

export default BiggerOrSmaller;