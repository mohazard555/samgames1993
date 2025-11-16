
import React from 'react';
import { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onGameSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onClick={() => onGameSelect(game)} />
      ))}
    </div>
  );
};

export default GameGrid;
