import React from 'react';
import { Link } from 'react-router-dom';
import DrawingCartoonCharacters from './DrawingCartoonCharacters';

// This game is mechanically identical to DrawingCartoonCharacters, so we can reuse it.

const CutePandaPainter: React.FC<{ gameName: string }> = ({ gameName }) => {
    return <DrawingCartoonCharacters gameName={gameName} />;
};

export default CutePandaPainter;
