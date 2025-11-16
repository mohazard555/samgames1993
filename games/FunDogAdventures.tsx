import React from 'react';
import { Link } from 'react-router-dom';
import LittleHeroAdventure from './LittleHeroAdventure';

// This game is mechanically similar to LittleHeroAdventure, so we can reuse it.

const FunDogAdventures: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <LittleHeroAdventure gameName={gameName} />;
};

export default FunDogAdventures;
