import React from 'react';
import { Link } from 'react-router-dom';
import MagicColorPuzzle from './MagicColorPuzzle';

// This game is mechanically identical to MagicColorPuzzle, so we can reuse it.

const PressTheCorrectColor: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <MagicColorPuzzle gameName={gameName} />;
};

export default PressTheCorrectColor;
