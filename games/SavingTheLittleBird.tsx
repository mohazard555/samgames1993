import React from 'react';
import { Link } from 'react-router-dom';
import AstronautAdventure from './AstronautAdventure';

// This game is mechanically similar to AstronautAdventure, so we can reuse it.

const SavingTheLittleBird: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <AstronautAdventure gameName={gameName} />;
};

export default SavingTheLittleBird;
