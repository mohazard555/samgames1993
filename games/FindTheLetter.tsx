import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ALL_LETTERS = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ'];
const GRID_SIZE = 6;

const FindTheLetter: React.FC<GameProps> = ({ gameName }) => {
    const [targetLetter, setTargetLetter] = useState('ب');
    const [foundCount, setFoundCount] = useState(0);

    const grid = useMemo(() => {
        const newGrid = [];
        let targetCount = 0;
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const isTarget = Math.random() < 0.2;
            if (isTarget) {
                newGrid.push({ letter: targetLetter, id: i, found: false });
                targetCount++;
            } else {
                const randomLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
                newGrid.push({ letter: randomLetter, id: i, found: false });
            }
        }
        return { grid: newGrid, total: targetCount };
    }, [targetLetter]);

    const [gridState, setGridState] = useState(grid.grid);
    const totalTargets = grid.total;
    
    const handleLetterClick = (letter: string, id: number, found: boolean) => {
        if (found) return;
        if (letter === targetLetter) {
            setFoundCount(c => c + 1);
            setGridState(g => g.map(cell => cell.id === id ? {...cell, found: true} : cell));
        }
    };
    
    const isWon = foundCount === totalTargets;

    const resetGame = () => {
        const newTarget = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
        setTargetLetter(newTarget);
        setFoundCount(0);
        // This will trigger the useMemo to regenerate the grid
    }
    
     useEffect(() => {
        setGridState(grid.grid);
     }, [grid]);


    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-teal-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-teal-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
                    {foundCount} / {totalTargets}
                </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-700 mb-6">ابحث عن كل حروف "{targetLetter}"</h2>

            <div className="grid gap-2 p-2 bg-teal-50" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`}}>
                {gridState.map(({ letter, id, found }) => (
                    <button
                        key={id}
                        onClick={() => handleLetterClick(letter, id, found)}
                        className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg transition-colors ${found ? 'bg-green-400 text-white' : 'bg-teal-200 text-teal-900 hover:bg-teal-300'}`}
                    >
                        {letter}
                    </button>
                ))}
            </div>
            
             {isWon && (
                <div className="mt-6">
                    <h2 className="text-4xl font-bold text-green-600 animate-pulse">🎉 رائع! لقد وجدتها كلها! 🎉</h2>
                    <button onClick={resetGame} className="mt-4 bg-teal-500 text-white font-bold py-2 px-6 rounded-full">المستوى التالي</button>
                </div>
            )}
        </div>
    );
};

export default FindTheLetter;