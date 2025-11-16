import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const MAZE = [
  "S## #",
  " #   ",
  " ### ",
  "   #E",
  "#####",
];
const MAZE_WIDTH = MAZE[0].length;
const MAZE_HEIGHT = MAZE.length;

const LittleMaze: React.FC<GameProps> = ({ gameName }) => {
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
    const [isWon, setIsWon] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isWon) return;
            setPlayerPos(p => {
                let { x, y } = p;
                if (e.key === 'ArrowUp') y--;
                if (e.key === 'ArrowDown') y++;
                if (e.key === 'ArrowLeft') x--;
                if (e.key === 'ArrowRight') x++;

                if (x >= 0 && x < MAZE_WIDTH && y >= 0 && y < MAZE_HEIGHT && MAZE[y][x] !== '#') {
                    if (MAZE[y][x] === 'E') setIsWon(true);
                    return { x, y };
                }
                return p;
            });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isWon]);

    const resetGame = () => {
        setPlayerPos({x: 0, y: 0});
        setIsWon(false);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p className="mb-4">استخدم مفاتيح الأسهم للوصول إلى المخرج (E)!</p>
            <div className="inline-block bg-gray-200 border-4 border-gray-400 p-2">
                {MAZE.map((row, y) => (
                    <div key={y} className="flex">
                        {row.split('').map((cell, x) => (
                            <div key={x} className="w-12 h-12 flex items-center justify-center text-2xl" style={{ backgroundColor: cell === '#' ? '#555' : 'transparent' }}>
                                {playerPos.x === x && playerPos.y === y ? '😀' : cell !== '#' ? cell : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {isWon && <h2 className="mt-4 text-3xl font-bold text-green-600">🎉 لقد فزت! 🎉</h2>}
        </div>
    );
};

export default LittleMaze;
