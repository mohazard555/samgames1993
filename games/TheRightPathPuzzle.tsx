import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

// 0: empty, 1: horizontal, 2: vertical, 3: corner┘, 4: corner└, 5: corner┐, 6: corner┌
const TILES_MAP = [3, 1, 5, 2, 0, 2, 6, 1, 4];

const TheRightPathPuzzle: React.FC<GameProps> = ({ gameName }) => {
    const [rotations, setRotations] = useState([0, 90, 0, 0, 0, 180, 0, 0, 270]);
    
    const rotateTile = (index: number) => {
        const newRotations = [...rotations];
        newRotations[index] = (newRotations[index] + 90) % 360;
        setRotations(newRotations);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="w-24"></div>
            </div>
            <p>قم بتدوير القطع لتوصيل بداية الطريق بنهايته!</p>
            <div className="grid grid-cols-3 gap-1 p-2 bg-green-200 mt-4">
                {TILES_MAP.map((tileType, i) => (
                    <button key={i} onClick={() => rotateTile(i)} className="w-24 h-24 bg-green-600 flex items-center justify-center transition-transform" style={{transform: `rotate(${rotations[i]}deg)`}}>
                        {tileType === 1 && <div className="w-full h-4 bg-yellow-300"></div>}
                        {tileType === 2 && <div className="w-4 h-full bg-yellow-300"></div>}
                        {tileType >= 3 && <div className="absolute w-12 h-4 bg-yellow-300 top-10 left-10"></div>}
                        {tileType >= 3 && <div className="absolute w-4 h-12 bg-yellow-300 top-10 left-10"></div>}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TheRightPathPuzzle;
