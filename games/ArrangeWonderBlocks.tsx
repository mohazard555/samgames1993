import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GRID_SIZE = 3;

const ArrangeWonderBlocks: React.FC<GameProps> = ({ gameName }) => {
    const createSolvedTiles = () => Array.from({ length: GRID_SIZE * GRID_SIZE - 1 }, (_, i) => i + 1).concat(0);
    const [tiles, setTiles] = useState(() => createSolvedTiles().sort(() => Math.random() - 0.5));
    const [isWon, setIsWon] = useState(false);

    const moveTile = (index: number) => {
        const emptyIndex = tiles.indexOf(0);
        const [row, col] = [Math.floor(index / GRID_SIZE), index % GRID_SIZE];
        const [emptyRow, emptyCol] = [Math.floor(emptyIndex / GRID_SIZE), emptyIndex % GRID_SIZE];

        if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
        }
    };
    
    useEffect(() => {
        const solved = tiles.every((t, i) => t === (i + 1) % (GRID_SIZE * GRID_SIZE));
        if (solved) setIsWon(true);
    }, [tiles]);
    
    const resetGame = () => {
        setTiles(createSolvedTiles().sort(() => Math.random() - 0.5));
        setIsWon(false);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p>رتب الأرقام بالتسلسل!</p>
            <div className="grid gap-1 p-2 bg-gray-400 mt-4" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`}}>
                {tiles.map((tile, i) => (
                    <button
                        key={i}
                        onClick={() => moveTile(i)}
                        className="w-24 h-24 flex items-center justify-center text-3xl font-bold text-white bg-blue-500 rounded"
                        style={{ visibility: tile === 0 ? 'hidden' : 'visible' }}
                    >
                        {tile}
                    </button>
                ))}
            </div>
            {isWon && <h2 className="mt-4 text-3xl font-bold text-green-600">🎉 لقد فزت! 🎉</h2>}
        </div>
    );
};

export default ArrangeWonderBlocks;
