import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

// 0: empty, 1: ─, 2: │, 3: └, 4: ┌, 5: ┐, 6: ┘
const INITIAL_GRID = [
    1, 4, 2, 0,
    3, 5, 2, 0,
    0, 6, 1, 5,
    0, 0, 3, 6,
];
const GRID_SIZE = 4;

const PipePuzzle: React.FC<GameProps> = ({ gameName }) => {
    const [rotations, setRotations] = useState(Array(GRID_SIZE * GRID_SIZE).fill(0).map(() => Math.floor(Math.random() * 4) * 90));

    const rotateTile = (index: number) => {
        const newRotations = [...rotations];
        newRotations[index] = (newRotations[index] + 90) % 360;
        setRotations(newRotations);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-blue-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>
            <p className="text-xl text-gray-700 mb-6">دوّر القطع لتوصيل الأنابيب!</p>

            <div className="inline-grid gap-1 p-2 bg-blue-200" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                {INITIAL_GRID.map((tileType, i) => (
                    <button
                        key={i}
                        onClick={() => rotateTile(i)}
                        className="w-20 h-20 bg-blue-300 flex items-center justify-center transition-transform relative overflow-hidden"
                        style={{ transform: `rotate(${rotations[i]}deg)` }}
                    >
                        {tileType === 1 && <div className="w-full h-4 bg-blue-600"></div>}
                        {tileType === 2 && <div className="w-4 h-full bg-blue-600"></div>}
                        {tileType >= 3 && <div className="absolute w-12 h-4 bg-blue-600 top-8 left-8"></div>}
                        {tileType >= 3 && <div className="absolute w-4 h-12 bg-blue-600 top-8 left-8"></div>}
                    </button>
                ))}
            </div>
            {/* Note: Win condition check is complex and omitted for this simpler version */}
        </div>
    );
};

export default PipePuzzle;