
import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${game.color} rounded-2xl shadow-lg p-5 text-white flex flex-col items-center justify-center text-center cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out`}
    >
      <div className="mb-3 w-12 h-12">{game.icon}</div>
      <h3 className="font-bold text-xl mb-1">{game.name}</h3>
      <p className="text-sm opacity-80">{game.description}</p>
    </div>
  );
};

export default GameCard;
