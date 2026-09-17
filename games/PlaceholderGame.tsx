import React from 'react';
import InteractiveNewGame from './InteractiveNewGame';

interface GameProps {
  gameName: string;
}

const PlaceholderGame: React.FC<GameProps> = ({ gameName }) => {
  return <InteractiveNewGame gameName={gameName} />;
};

export default PlaceholderGame;
