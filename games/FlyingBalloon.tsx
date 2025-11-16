import React from 'react';
import { Link } from 'react-router-dom';
// Fix: Changed import from './AstronautAdventure' which is not a module because the file is empty,
// to './GlowingPlanetJourney' which is a functional space-themed game.
import GlowingPlanetJourney from './GlowingPlanetJourney';

// This game is mechanically similar to AstronautAdventure, so we can reuse it
// with a different name to represent the new game.

const FlyingBalloon: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <GlowingPlanetJourney gameName={gameName} />;
};

export default FlyingBalloon;
