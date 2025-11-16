import React from 'react';
import { Link } from 'react-router-dom';
import WhackAMole from './WhackAMole';

// This game is mechanically similar to WhackAMole, so we can reuse it.

const CatchingShinyStars: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <WhackAMole gameName={gameName} />;
};

export default CatchingShinyStars;
