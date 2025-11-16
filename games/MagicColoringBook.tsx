import React from 'react';
import { Link } from 'react-router-dom';
import AnimalColoring from './AnimalColoring';

// This game is mechanically identical to AnimalColoring, we can reuse it.

const MagicColoringBook: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <AnimalColoring gameName={gameName} />;
};

export default MagicColoringBook;
