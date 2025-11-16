import React from 'react';
import { Link } from 'react-router-dom';
import PrincessDressUp from './PrincessDressUp';

// This game is mechanically identical to PrincessDressUp, so we can reuse it.

const DreamDressDesign: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <PrincessDressUp gameName={gameName} />;
};

export default DreamDressDesign;
