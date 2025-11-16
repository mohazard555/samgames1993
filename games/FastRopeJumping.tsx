import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const FastRopeJumping: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [ropePos, setRopePos] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');

    useEffect(() => {
        if(gameState !== 'playing') return;
        const interval = setInterval(() => {
            setRopePos(p => (p + 5) % 360);
        }, 16);
        return () => clearInterval(interval);
    }, [gameState]);
    
    useEffect(() => {
        const ropeY = Math.sin(ropePos * Math.PI / 180);
        if (ropeY > 0.9 && !isJumping) {
            setGameState('over');
        }
        if (ropeY < -0.9 && isJumping) {
            setScore(s => s + 1);
        }
    }, [ropePos, isJumping]);

    const jump = () => {
        if(gameState !== 'playing') return;
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 300);
    };
    
    const startGame = () => {
        setScore(0);
        setGameState('playing');
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">القفزات: {score}</div>
            </div>
            <div onClick={jump} className="relative w-[300px] h-[300px] bg-sky-100 mx-auto cursor-pointer">
                <div className="absolute text-6xl" style={{ bottom: isJumping ? 40 : 10, left: 120, transition: 'bottom 0.2s' }}>🧍</div>
                <div className="absolute h-1 w-full bg-red-500" style={{ bottom: 150 + Math.sin(ropePos * Math.PI / 180) * 140, transform: `scaleX(${1 + Math.cos(ropePos * Math.PI / 180) * 0.2})` }}></div>
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

export default FastRopeJumping;
