import React from 'react';
import { Link } from 'react-router-dom';
import LittleHeroAdventure from './LittleHeroAdventure';

// This game is mechanically similar to LittleHeroAdventure, so we can reuse it
// with a different name to represent the new game.

const PirateChase: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <LittleHeroAdventure gameName={gameName} />;
};

export default PirateChase;
