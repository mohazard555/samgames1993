import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PLAYER_CAR_WIDTH = 40;
const PLAYER_CAR_HEIGHT = 60;

const FastCarRacing: React.FC<GameProps> = ({ gameName }) => {
    const [playerY, setPlayerY] = useState(GAME_HEIGHT - 80);
    const [obstacles, setObstacles] = useState<{ id: number, x: number, y: number }[]>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
    const gameAreaRef = useRef<HTMLDivElement>(null);

    const startGame = () => {
        setPlayerY(GAME_HEIGHT - 80);
        setObstacles([]);
        setScore(0);
        setGameState('playing');
    };

    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;

        // Move obstacles and check for collision
        let collision = false;
        const playerX = GAME_WIDTH / 2; // Player is centered
        setObstacles(obs => obs.map(o => ({ ...o, y: o.y + 5 })).filter(o => {
            if (o.y > playerY && o.y < playerY + PLAYER_CAR_HEIGHT && Math.abs(o.x - playerX) < PLAYER_CAR_WIDTH) {
                collision = true;
            }
            return o.y < GAME_HEIGHT;
        }));
        
        if (collision) {
            setGameState('over');
            return;
        }

        // Add new obstacles
        if (Math.random() < 0.05) {
            setObstacles(obs => [...obs, { id: Date.now(), x: Math.random() * (GAME_WIDTH - 40), y: -60 }]);
        }

        setScore(s => s + 1);
    }, [gameState, playerY]);

    useEffect(() => {
        const interval = setInterval(gameLoop, 30);
        return () => clearInterval(interval);
    }, [gameLoop]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (gameState !== 'playing' || !gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        setPlayerY(Math.max(0, Math.min(GAME_HEIGHT - PLAYER_CAR_HEIGHT, y)));
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-gray-500">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-gray-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div
                ref={gameAreaRef}
                onMouseMove={handleMouseMove}
                className="relative mx-auto bg-gray-400 overflow-hidden cursor-pointer border-4 border-gray-600"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
                {/* Player Car */}
                <div className="absolute text-5xl" style={{ left: '50%', transform: 'translateX(-50%)', top: playerY }}>🏎️</div>
                {/* Obstacle Cars */}
                {obstacles.map(o => (
                    <div key={o.id} className="absolute text-5xl" style={{ left: o.x, top: o.y, transform: 'rotate(180deg)' }}>🚓</div>
                ))}
                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">انتهت اللعبة!</h2>}
                        <button onClick={startGame} className="bg-red-600 font-bold py-3 px-6 rounded-full text-xl hover:bg-red-700">
                            {gameState === 'idle' ? 'ابدأ السباق' : 'العب مرة أخرى'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FastCarRacing;