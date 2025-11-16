import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      setCards(prevCards => prevCards.map(card => 
        card.emoji === firstCard.emoji ? { ...card, isMatched: true } : card
      ));
      setFlippedIndices([]);
    } else {
      // No match
      setTimeout(() => {
        setCards(prevCards => prevCards.map((card, index) => 
          index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
        ));
        setFlippedIndices([]);
      }, 1000);
    }
  }, [flippedIndices, cards]);
  
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
        setIsGameWon(true);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    setCards(prevCards => prevCards.map((card, i) => i === index ? { ...card, isFlipped: true } : card));
    setFlippedIndices(prev => [...prev, index]);
    if(flippedIndices.length === 0) {
        setMoves(m => m + 1);
    }
  };

  const restartGame = () => {
    setCards(createShuffledDeck());
    setFlippedIndices([]);
    setMoves(0);
    setIsGameWon(false);
  }

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">→ العودة</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800">{gameName}</h1>
        <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">الحركات: {moves}</div>
      </div>
      
      {isGameWon ? (
        <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-4xl font-bold text-green-600 mb-4">🎉 رائع! لقد فزت! 🎉</h2>
            <p className="text-xl text-gray-700 mb-6">لقد أكملت اللعبة في {moves} حركة.</p>
            <button onClick={restartGame} className="bg-purple-600 text-white font-bold py-4 px-8 rounded-full text-2xl hover:bg-purple-700 transition-transform transform hover:scale-105">
                العب مرة أخرى
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => (
            <div key={card.id} className="perspective w-full h-24 md:h-32 cursor-pointer" onClick={() => handleCardClick(index)}>
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                    <div className="absolute w-full h-full backface-hidden bg-purple-500 rounded-lg flex items-center justify-center text-4xl text-white font-bold">?</div>
                    <div className="absolute w-full h-full backface-hidden bg-purple-200 rounded-lg flex items-center justify-center text-5xl rotate-y-180">{card.emoji}</div>
                </div>
            </div>
            ))}
        </div>
      )}
      <style>{`
        .perspective { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default MemoryMatch;
