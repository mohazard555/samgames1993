import React from 'react';
import { Game } from '../types';
import { getGameIconComponent } from '../constants';

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const IconComponent = getGameIconComponent(game.id);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className={`relative bg-gradient-to-br ${game.color} rounded-2xl md:rounded-3xl shadow-sm hover:shadow-lg active:scale-95 p-3.5 sm:p-4 md:p-5 text-white flex flex-col items-center justify-between text-center cursor-pointer transform hover:-translate-y-1 transition-all duration-200 ease-out select-none min-h-[140px] sm:min-h-[160px] touch-manipulation`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 my-1.5 sm:my-2 drop-shadow-md flex items-center justify-center">
        <IconComponent />
      </div>

      <div className="w-full">
        <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 leading-tight line-clamp-2 drop-shadow-sm">
          {game.name}
        </h3>
        <p className="text-[11px] sm:text-xs md:text-sm text-white/90 font-medium line-clamp-1">
          {game.description}
        </p>
      </div>
    </div>
  );
};

export default GameCard;
