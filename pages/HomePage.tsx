
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../constants';
import GameGrid from '../components/GameGrid';
import SubscriptionPopup from '../components/SubscriptionPopup';
import { Game } from '../types';
import { MagnifyingGlassIcon } from '../components/Icons';

const HomePage: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedGame(null);
  };

  const proceedToGame = () => {
    if (selectedGame) {
      navigate(`/game/${selectedGame.id}`);
    } else {
      handleClosePopup();
    }
  };

  const filteredGames = useMemo(() => {
    if (!searchQuery) {
      return GAMES;
    }
    return GAMES.filter(game =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-700">مرحباً في عالم الألعاب!</h1>
      <p className="text-xl text-center mb-6 text-gray-600">اكتشف أكثر من {GAMES.length} لعبة ممتعة ومميزة</p>
      
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
           <span className="absolute inset-y-0 left-0 flex items-center pl-3">
             <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15.803 15.803M15.803 15.803C17.2236 14.3824 18 12.4795 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.4795 18 14.3824 17.2236 15.803 15.803Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
           </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن لعبة..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 transition-shadow"
          />
        </div>
      </div>

      {filteredGames.length > 0 ? (
        <GameGrid games={filteredGames} onGameSelect={handleGameSelect} />
      ) : (
        <p className="text-center text-gray-500 text-xl mt-8">لم يتم العثور على ألعاب تطابق بحثك.</p>
      )}

      <SubscriptionPopup 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup}
        onSubscribed={proceedToGame}
      />
    </div>
  );
};

export default HomePage;