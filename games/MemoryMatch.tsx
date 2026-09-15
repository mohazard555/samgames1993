import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playFlipSound, playSuccessSound, playErrorSound, playWinFanfare } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const createShuffledDeck = (): Card[] => {
  const deck = [...EMOJIS, ...EMOJIS];
  const shuffledDeck = deck.sort(() => Math.random() - 0.5);
  return shuffledDeck.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryMatch: React.FC<GameProps> = ({ gameName }) => {
  const [cards, setCards] = useState<Card[]>(createShuffledDeck());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    if (flippedIndices.length < 2) return;

    const [firstIndex, secondIndex] = flippedIndices;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.emoji === secondCard.emoji) {
      // Match
      playSuccessSound();
      setCards((prevCards) =>
        prevCards.map((card) => (card.emoji === firstCard.emoji ? { ...card, isMatched: true } : card))
      );
      setFlippedIndices([]);
    } else {
      // No match
      setTimeout(() => {
        playErrorSound();
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
          )
        );
        setFlippedIndices([]);
      }, 800);
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsGameWon(true);
      playWinFanfare();
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    playFlipSound();
    setCards((prevCards) => prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)));
    setFlippedIndices((prev) => [...prev, index]);
    if (flippedIndices.length === 0) {
      setMoves((m) => m + 1);
    }
  };

  const restartGame = () => {
    setCards(createShuffledDeck());
    setFlippedIndices([]);
    setMoves(0);
    setIsGameWon(false);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-purple-300">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow"
        >
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-purple-800">{gameName}</h1>
        <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow">الحركات: {moves}</div>
      </div>

      {isGameWon ? (
        <div className="flex flex-col items-center justify-center p-8 bg-purple-50 rounded-3xl border-2 border-purple-200 animate-fade-in">
          <span className="text-6xl mb-2 animate-bounce">🏆</span>
          <h2 className="text-3xl sm:text-4xl font-black text-purple-800 mb-2">🎉 رائع جداً! لقد فزت يا ذكي! 🎉</h2>
          <p className="text-xl text-gray-700 mb-6 font-bold">أكملت مطابقة جميع البطاقات في {moves} حركة!</p>
          <button
            onClick={restartGame}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-4 px-10 rounded-2xl text-xl hover:scale-105 transition-transform shadow-xl"
          >
            العب مرة أخرى 🔄
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`h-24 sm:h-28 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all transform active:scale-95 shadow-md border-2 ${
                card.isFlipped || card.isMatched
                  ? 'bg-gradient-to-tr from-amber-100 to-yellow-200 border-amber-300 rotate-0'
                  : 'bg-gradient-to-tr from-purple-500 to-indigo-600 border-purple-300 text-white hover:scale-105'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
