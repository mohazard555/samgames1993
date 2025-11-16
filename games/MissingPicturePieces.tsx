import React from 'react';
import { Link } from 'react-router-dom';
import AnimalPuzzle from './AnimalPuzzle';

// This game is mechanically identical to AnimalPuzzle, so we can reuse it.

const MissingPicturePieces: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <AnimalPuzzle gameName={gameName} />;
};

export default MissingPicturePieces;
