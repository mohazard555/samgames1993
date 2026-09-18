import React from 'react';
import { Game } from '../types';
import { getGameIconComponent } from '../constants';
import { useSettings } from '../contexts/SettingsContext';

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const IconComponent = getGameIconComponent(game.id);
  const { settings, isVipActive } = useSettings();

  const isPaidGame =
    settings.paidSettings?.enabled &&
    settings.paidSettings.paidGameIds?.includes(game.id);

  const isNewGame = settings.newGameIds
    ? settings.newGameIds.includes(game.id)
    : [8888, 9999].includes(game.id);

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
      className={`relative bg-gradient-to-br ${game.color} rounded-2xl md:rounded-3xl shadow-sm hover:shadow-lg active:scale-95 p-3.5 sm:p-4 md:p-5 text-white flex flex-col items-center justify-between text-center cursor-pointer transform hover:-translate-y-1 transition-all duration-200 ease-out select-none min-h-[140px] sm:min-h-[160px] touch-manipulation overflow-hidden`}
    >
      {/* NEW Badge */}
      {isNewGame && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/60 flex items-center gap-0.5 animate-pulse">
            <span>NEW 🔥</span>
          </span>
        </div>
      )}

      {/* VIP Badge */}
      {isPaidGame && (
        <div className="absolute top-2 right-2 z-10">
          {isVipActive ? (
            <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow border border-white/50 flex items-center gap-0.5">
              👑 VIP
            </span>
          ) : (
            <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md border border-white/60 flex items-center gap-1 animate-pulse">
              <span>🔒 VIP</span>
            </span>
          )}
        </div>
      )}

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

