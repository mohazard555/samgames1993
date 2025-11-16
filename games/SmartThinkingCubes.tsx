import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

const SmartThinkingCubes: React.FC<GameProps> = ({ gameName }) => {
    const createEmptyGrid = () => Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
    
    const [grid, setGrid] = useState(createEmptyGrid());
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');

    // For simplicity, we'll use a single block type
    const [block, setBlock] = useState({ x: 4, y: 0 });

    const startGame = () => {
        setGrid(createEmptyGrid());
        setBlock({ x: 4, y: 0 });
        setScore(0);
        setGameState('playing');
    };

    const moveBlock = (dx: number, dy: number) => {
        const newX = block.x + dx;
        const newY = block.y + dy;
        if (newX >= 0 && newX < GRID_WIDTH && newY < GRID_HEIGHT && grid[newY][newX] === 0) {
            setBlock({ x: newX, y: newY });
            return true;
        }
        return false;
    };

    const gameLoop = useCallback(() => {
        if (!moveBlock(0, 1)) {
            // Block has landed
            const newGrid = grid.map(row => [...row]);
            newGrid[block.y][block.x] = 1;

            // Check for line clears
            let linesCleared = 0;
            for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                if (newGrid[y].every(cell => cell === 1)) {
                    linesCleared++;
                    newGrid.splice(y, 1);
                    newGrid.unshift(Array(GRID_WIDTH).fill(0));
                }
            }
            setScore(s => s + linesCleared * 10);
            setGrid(newGrid);

            // New block
            const newBlock = { x: 4, y: 0 };
            if (newGrid[newBlock.y][newBlock.x] === 1) {
                setGameState('over');
            } else {
                setBlock(newBlock);
            }
        }
    }, [block, grid]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = setInterval(gameLoop, 500);
        return () => clearInterval(interval);
    }, [gameState, gameLoop]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;
            if (e.key === 'ArrowLeft') moveBlock(-1, 0);
            if (e.key === 'ArrowRight') moveBlock(1, 0);
            if (e.key === 'ArrowDown') moveBlock(0, 1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, block, grid]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="relative inline-block border-4 border-gray-500 bg-gray-800">
                {grid.map((row, y) => (
                    <div key={y} className="flex">
                        {row.map((cell, x) => (
                            <div key={x} className="w-6 h-6 border border-gray-700" style={{ backgroundColor: cell ? 'cyan' : 'transparent' }}></div>
                        ))}
                    </div>
                ))}
                {gameState === 'playing' && <div className="absolute w-6 h-6 bg-cyan-400" style={{ top: block.y * 24, left: block.x * 24 }}></div>}
                 {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white">
                         {gameState === 'over' && <h2 className="text-2xl font-bold mb-4">انتهت اللعبة!</h2>}
                         <button onClick={startGame} className="bg-blue-500 font-bold py-2 px-6 rounded-lg">{gameState === 'idle' ? 'ابدأ' : 'العب مرة أخرى'}</button>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default SmartThinkingCubes;
