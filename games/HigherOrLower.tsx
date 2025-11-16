import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const HigherOrLower: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentCard, setCurrentCard] = useState(5);
  const [nextCard, setNextCard] = useState(5);
  const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
  // Fix: Add state to track if the last guess was correct for feedback.
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);


  const generateNewCards = useCallback(() => {
    const newCurrent = Math.floor(Math.random() * 10) + 1;
    let newNext = Math.floor(Math.random() * 10) + 1;
    while (newNext === newCurrent) {
      newNext = Math.floor(Math.random() * 10) + 1;
    }
    setCurrentCard(newCurrent);
    setNextCard(newNext);
    setGameState('playing');
  }, []);
  
  useEffect(() => {
      generateNewCards();
  }, [generateNewCards]);

  const handleGuess = (guess: 'higher' | 'lower') => {
    if (gameState !== 'playing') return;

    setGameState('result');
    const isHigher = nextCard > currentCard;
    const correctGuess = (guess === 'higher' && isHigher) || (guess === 'lower' && !isHigher);
    
    // Fix: Set the result of the guess.
    setWasCorrect(correctGuess);

    if (correctGuess) {
      const points = 10 + streak * 2;
      setScore(s => s + points);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
        setCurrentCard(nextCard);
        let newNext = Math.floor(Math.random() * 10) + 1;
        while (newNext === nextCard) {
            newNext = Math.floor(Math.random() * 10) + 1;
        }
        setNextCard(newNext);
        setGameState('playing');
    }, 1500);
  };

  const Card: React.FC<{ number: number | string, revealed: boolean }> = ({ number, revealed }) => (
    <div className="w-40 h-56 bg-white border-4 border-gray-300 rounded-2xl flex items-center justify-center shadow-lg">
      <span className="text-7xl font-bold text-red-600">{revealed ? number : '?'}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-red-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-red-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-700 mb-6">هل البطاقة التالية أعلى أم أدنى؟</h2>
      
      <div className="flex justify-center items-center gap-8 mb-6">
        <Card number={currentCard} revealed={true} />
        <Card number={nextCard} revealed={gameState === 'result'} />
      </div>

      {gameState === 'playing' ? (
        <div className="flex justify-center items-center gap-6">
          <button onClick={() => handleGuess('higher')} className="bg-red-500 text-white font-bold text-3xl py-4 px-8 rounded-2xl hover:bg-red-600">أعلى ▲</button>
          <button onClick={() => handleGuess('lower')} className="bg-blue-500 text-white font-bold text-3xl py-4 px-8 rounded-2xl hover:bg-blue-600">أدنى ▼</button>
        </div>
      ) : (
        <div className="text-4xl font-bold">
            {/* Fix: Display feedback based on the actual guess result. */}
            {wasCorrect ? "صحيح!" : "خطأ!"}
        </div>
      )}
    </div>
  );
};

export default HigherOrLower;