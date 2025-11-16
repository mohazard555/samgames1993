import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const SHAPES = [
  { id: 'square', emoji: '🟩', name: 'مربع' },
  { id: 'circle', emoji: '🔴', name: 'دائرة' },
  { id: 'triangle', emoji: '🔺', name: 'مثلث' },
  { id: 'star', emoji: '⭐', name: 'نجمة' },
];

const ShapeMatching: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [targetShape, setTargetShape] = useState(SHAPES[0]);
  const [options, setOptions] = useState<typeof SHAPES>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateRound = useCallback(() => {
    setFeedback(null);
    const newTarget = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setTargetShape(newTarget);
    setOptions([...SHAPES].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleOptionClick = (option: typeof SHAPES[0]) => {
    if (feedback) return;

    if (option.id === targetShape.id) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    setTimeout(generateRound, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          → العودة
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
          النقاط: {score}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-700 mb-2">ابحث عن الشكل:</h2>
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className="text-8xl">{targetShape.emoji}</span>
        <span className="text-5xl font-bold">{targetShape.name}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            className="bg-blue-100 p-6 rounded-2xl hover:bg-blue-200 transition-transform transform hover:scale-110"
          >
            <span className="text-8xl">{option.emoji}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div className="mt-6 text-4xl font-extrabold">
          {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! أحسنت! 🎉</p>}
          {feedback === 'incorrect' && <p className="text-red-500">😞 هذا ليس الشكل الصحيح! 😞</p>}
        </div>
      )}
    </div>
  );
};

export default ShapeMatching;