import React from 'react';
import { Link } from 'react-router-dom';
import CuteAnimalRace from './CuteAnimalRace';

// This game is mechanically similar to CuteAnimalRace, so we can reuse it.

const FunRunningRace: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <CuteAnimalRace gameName={gameName} />;
};

export default FunRunningRace;
