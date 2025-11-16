import React from 'react';
import { Link } from 'react-router-dom';
import TurboCarRacing from './TurboCarRacing';

// This game is mechanically similar to TurboCarRacing (vertical avoidance), so we can reuse it.

const CrazyRocketRace: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <TurboCarRacing gameName={gameName} />;
};

export default CrazyRocketRace;
