import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const PATTERNS = [
  ['🍎', '🍌', '🍎', '🍌'],
  ['🚗', '🚗', '✈️', '✈️'],
  ['🟥', '🟦', '🟩', '🟥'],
  ['🐶', '🐱', '🐶', '🐱'],
];
const ALL_ITEMS = ['🍎', '🍌', '🚗', '✈️', '🟥', '🟦', '🟩', '🐶', '🐱'];


const CompleteThePattern: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [pattern, setPattern] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateRound = useCallback(() => {
    setFeedback(null);
    const newPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    const correctAnswer = newPattern[newPattern.length - 1];
    setPattern(newPattern.slice(0, -1)); // all but the last one
    setAnswer(correctAnswer);

    const wrongOpts = ALL_ITEMS.filter(item => !newPattern.includes(item));
    const finalOptions = [
      correctAnswer,
      ...wrongOpts.sort(() => Math.random() - 0.5).slice(0, 2)
    ].sort(() => Math.random() - 0.5);
    setOptions(finalOptions);

  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleOptionClick = (option: string) => {
    if (feedback) return;
    if (option === answer) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    setTimeout(generateRound, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          → العودة
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
          النقاط: {score}
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-700 mb-8">أكمل النمط التالي:</h2>

      <div className="bg-purple-50 p-6 rounded-2xl flex justify-center items-center gap-6 mb-8">
        {pattern.map((item, index) => (
          <span key={index} className="text-7xl">{item}</span>
        ))}
        <span className="text-7xl font-bold text-purple-700">؟</span>
      </div>

      <div className="flex justify-center items-center gap-6">
        {options.map(option => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className="bg-purple-200 p-6 rounded-2xl hover:bg-purple-300 transition-transform transform hover:scale-110"
          >
            <span className="text-7xl">{option}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div className="mt-6 text-4xl font-extrabold">
          {feedback === 'correct' && <p className="text-green-500">🎉 ممتاز! نمط صحيح! 🎉</p>}
          {feedback === 'incorrect' && <p className="text-red-500">😞 حاول مرة أخرى! 😞</p>}
        </div>
      )}
    </div>
  );
};

export default CompleteThePattern;