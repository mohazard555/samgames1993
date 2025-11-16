import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }
const GRID_SIZE = 5;

const MysteriousDesertTreasure: React.FC<GameProps> = ({ gameName }) => {
    const treasurePos = useMemo(() => Math.floor(Math.random() * GRID_SIZE * GRID_SIZE), []);
    const [revealed, setRevealed] = useState<boolean[]>(new Array(GRID_SIZE * GRID_SIZE).fill(false));
    const [found, setFound] = useState(false);

    const dig = (index: number) => {
        if (found) return;
        const newRevealed = [...revealed];
        newRevealed[index] = true;
        setRevealed(newRevealed);
        if (index === treasurePos) {
            setFound(true);
        }
    };
    
    const resetGame = () => {
        setRevealed(new Array(GRID_SIZE * GRID_SIZE).fill(false));
        setFound(false);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p>ابحث عن الكنز المخفي في الصحراء!</p>
            <div className="grid gap-2 p-2 bg-yellow-200 mt-4" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`}}>
                {revealed.map((isRevealed, i) => (
                    <button
                        key={i}
                        onClick={() => dig(i)}
                        className="w-16 h-16 flex items-center justify-center text-3xl bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                        {isRevealed ? (i === treasurePos ? '💎' : '💨') : '❓'}
                    </button>
                ))}
            </div>
            {found && <h2 className="mt-4 text-3xl font-bold text-green-600">🎉 لقد وجدت الكنز! 🎉</h2>}
        </div>
    );
};

export default MysteriousDesertTreasure;
