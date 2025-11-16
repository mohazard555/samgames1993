import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

interface Color {
  name: string;
  hex: string;
}

const COLORS: Color[] = [
  { name: 'أحمر', hex: '#ef4444' },
  { name: 'أزرق', hex: '#3b82f6' },
  { name: 'أخضر', hex: '#22c55e' },
  { name: 'أصفر', hex: '#eab308' },
  { name: 'برتقالي', hex: '#f97316' },
  { name: 'بنفسجي', hex: '#8b5cf6' },
  { name: 'وردي', hex: '#ec4899' },
  { name: 'بني', hex: '#78350f' },
];

const MagicColorPuzzle: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState<Color | null>(null);
  const [options, setOptions] = useState<Color[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const generateNewRound = useCallback(() => {
    setFeedback(null);
    const correctColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(correctColor);

    const wrongOptions = COLORS.filter(c => c.hex !== correctColor.hex);
    const shuffledWrongOptions = shuffleArray(wrongOptions).slice(0, 3);
    
    const allOptions = shuffleArray([correctColor, ...shuffledWrongOptions]);
    setOptions(allOptions);
  }, []);

  useEffect(() => {
    generateNewRound();
  }, [generateNewRound]);

  const handleOptionClick = (color: Color) => {
    if (feedback) return; // Prevent clicking again until next round

    if (color.hex === targetColor?.hex) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      generateNewRound();
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-sky-200">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          → العودة
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-sky-700">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
          النقاط: {score}
        </div>
      </div>
      
      {targetColor && (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-800 animate-pulse">اختر اللون: {targetColor.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {options.map(option => (
                    <button
                        key={option.hex}
                        onClick={() => handleOptionClick(option)}
                        className="w-full h-32 md:h-40 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                        style={{ backgroundColor: option.hex }}
                        aria-label={`Option ${option.name}`}
                    />
                ))}
            </div>
        </div>
      )}

      {feedback && (
        <div className="mt-6 text-4xl font-extrabold">
            {feedback === 'correct' && <p className="text-green-500">🎉 أحسنت! إجابة صحيحة 🎉</p>}
            {feedback === 'incorrect' && <p className="text-red-500">😞 حاول مرة أخرى! 😞</p>}
        </div>
      )}
    </div>
  );
};

export default MagicColorPuzzle;
