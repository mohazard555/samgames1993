import React from 'react';
import { Link } from 'react-router-dom';
import TurboCarRacing from './TurboCarRacing';

// This game is mechanically identical to TurboCarRacing, we can reuse it.

const FastHeroBikes: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <TurboCarRacing gameName={gameName} />;
};

export default FastHeroBikes;
