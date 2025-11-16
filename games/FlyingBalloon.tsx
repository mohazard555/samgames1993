import React from 'react';
import { Link } from 'react-router-dom';
// Fix: Replaced non-functional 'GlowingPlanetJourney' import with a working game component.
// 'AdventurousRabbitJumps' provides suitable vertical scrolling gameplay for a "flying" theme.
import AdventurousRabbitJumps from './AdventurousRabbitJumps';

// This game is mechanically similar to a vertical scroller, so we can reuse one.

const FlyingBalloon: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <AdventurousRabbitJumps gameName={gameName} />;
};

export default FlyingBalloon;