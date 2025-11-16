
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../constants';
import GameGrid from '../components/GameGrid';
import SubscriptionPopup from '../components/SubscriptionPopup';
import { Game } from '../types';

const HomePage: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
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
      // The popup will disappear automatically when the page changes,
      // so we don't need to call handleClosePopup() here. This avoids
      // a potential race condition between navigation and state updates.
    } else {
      // As a fallback, if no game is selected, just close the popup.
      handleClosePopup();
    }
  };


  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-700">مرحباً في عالم الألعاب!</h1>
      <p className="text-xl text-center mb-8 text-gray-600">اكتشف أكثر من {GAMES.length} لعبة ممتعة ومميزة</p>
      <GameGrid games={GAMES} onGameSelect={handleGameSelect} />
      <SubscriptionPopup 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup}
        onSubscribed={proceedToGame}
       />
    </div>
  );
};

export default HomePage;