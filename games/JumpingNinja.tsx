import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const JumpingNinja: React.FC<GameProps> = ({ gameName }) => {
    const [y, setY] = useState(150);
    const [x, setX] = useState(50);
    const [vy, setVy] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');

    const startGame = () => {
        setY(150);
        setX(50);
        setVy(0);
        setScore(0);
        setGameState('playing');
    };
    
    const jump = useCallback(() => {
        if (gameState !== 'playing') return;
        setVy(-8);
        setX(x => x === 50 ? 230 : 50);
        setScore(s => s + 1);
    }, [gameState]);

    useEffect(() => {
        if(gameState !== 'playing') return;
        const gameLoop = setInterval(() => {
            setVy(v => v + 0.5);
            setY(y => y + vy);
            if (y > 280 || y < 0) {
                setGameState('over');
            }
        }, 30);
        return () => clearInterval(gameLoop);
    }, [gameState, vy]);
    
    useEffect(() => {
        window.addEventListener('keydown', jump);
        return () => window.removeEventListener('keydown', jump);
    }, [jump]);


    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div onClick={jump} className="relative w-[300px] h-[300px] bg-sky-200 mx-auto border-2 border-gray-400 overflow-hidden cursor-pointer">
                <div className="absolute w-2 h-full bg-gray-600 left-0"></div>
                <div className="absolute w-2 h-full bg-gray-600 right-0"></div>
                <div className="absolute text-3xl" style={{ top: y, left: x }}>🥷</div>
                 {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">انتهت اللعبة!</h2>}
                        <button onClick={startGame} className="bg-blue-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-blue-600">
                            {gameState === 'idle' ? 'ابدأ' : 'العب مرة أخرى'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JumpingNinja;
