import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

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
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(generateRound, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          → العودة
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
          النقاط: {score}
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-700 mb-6">كم عدد {itemEmoji} في الصورة؟</h2>

      <div className="bg-yellow-50 min-h-[150px] p-4 rounded-xl flex flex-wrap justify-center items-center gap-2 mb-8">
        {Array.from({ length: targetCount }).map((_, i) => (
          <span key={i} className="text-5xl">{itemEmoji}</span>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {options.map(option => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className="bg-yellow-400 text-white font-bold text-5xl p-6 rounded-2xl hover:bg-yellow-500 transition-transform transform hover:scale-110"
          >
            {option}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="mt-6 text-4xl font-extrabold">
          {feedback === 'correct' && <p className="text-green-500">🎉 إجابة رائعة! 🎉</p>}
          {feedback === 'incorrect' && <p className="text-red-500">😞 حاول مرة أخرى! 😞</p>}
        </div>
      )}
    </div>
  );
};

export default CountTheItems;