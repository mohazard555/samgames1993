import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GRID_SIZE = 5;

const NumberMaze: React.FC<GameProps> = ({ gameName }) => {
    const [path, setPath] = useState<number[]>([]);
    const [isWon, setIsWon] = useState(false);
    
    const { grid, maxNumber } = useMemo(() => {
        const newGrid = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => Math.floor(Math.random() * 20) + 1);
        // Create a clear path
        newGrid[0] = 1;
        newGrid[1] = 2;
        newGrid[6] = 3;
        newGrid[11] = 4;
        newGrid[12] = 5;
        newGrid[13] = 6;
        newGrid[18] = 7;
        newGrid[23] = 8;
        newGrid[24] = 9;
        return { grid: newGrid, maxNumber: 9 };
    }, []);

    const handleCellClick = (num: number, index: number) => {
        if (isWon) return;
        
        const lastNum = path.length > 0 ? path[path.length-1] : 0;
        if (num === lastNum + 1) {
            const newPath = [...path, num];
            setPath(newPath);
            if (num === maxNumber) {
                setIsWon(true);
            }
        }
    };
    
    const resetGame = () => {
        setPath([]);
        setIsWon(false);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-orange-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-orange-800">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">اتبع الأرقام بالترتيب من 1 إلى {maxNumber}!</h2>

            <div className="grid gap-1 p-2 bg-orange-100" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`}}>
                {grid.map((num, i) => (
                    <button
                        key={i}
                        onClick={() => handleCellClick(num, i)}
                        className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded transition-colors ${path.includes(num) ? 'bg-green-400 text-white' : 'bg-white text-gray-800'}`}
                    >
                        {num}
                    </button>
                ))}
            </div>
            
            {isWon && <h2 className="mt-6 text-3xl font-bold text-green-600 animate-pulse">🎉 أحسنت! لقد وصلت للنهاية! 🎉</h2>}
        </div>
    );
};

export default NumberMaze;
