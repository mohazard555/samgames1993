import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const ASTRONAUT_SIZE = 40;
const GRAVITY = 0.3;
const LIFT = -6;

interface Obstacle {
    id: number;
    type: 'asteroid' | 'star';
    x: number;
    y: number;
    width: number;
    height: number;
}

const AstronautAdventure: React.FC<GameProps> = ({ gameName }) => {
    const [astroY, setAstroY] = useState(GAME_HEIGHT / 2);
    const [velocity, setVelocity] = useState(0);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
    const gameLoopRef = useRef<number | null>(null);

    const startGame = () => {
        setAstroY(GAME_HEIGHT / 2);
        setVelocity(0);
        setObstacles([]);
        setScore(0);
        setGameState('playing');
    };
    
    const flyUp = useCallback(() => {
        if (gameState === 'playing') setVelocity(LIFT);
    }, [gameState]);

    // Game Loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        gameLoopRef.current = requestAnimationFrame(function gameLoop() {
            // Astronaut physics
            setVelocity(v => v + GRAVITY);
            setAstroY(y => {
                const newY = y + velocity;
                if (newY > GAME_HEIGHT - ASTRONAUT_SIZE || newY < 0) {
                    setGameState('over');
                    return y;
                }
                return newY;
            });
            
            // Obstacle logic
            let collision = false;
            setObstacles(obs => {
                let scoreToAdd = 0;
                const astroRect = { x: 50, y: astroY, width: ASTRONAUT_SIZE, height: ASTRONAUT_SIZE };
                const newObs = obs.map(o => ({ ...o, x: o.x - 3 })).filter(o => {
                    const obsRect = { x: o.x, y: o.y, width: o.width, height: o.height };
                    if (astroRect.x < obsRect.x + obsRect.width &&
                        astroRect.x + astroRect.width > obsRect.x &&
                        astroRect.y < obsRect.y + obsRect.height &&
                        astroRect.y + astroRect.height > obsRect.y) {
                        if (o.type === 'asteroid') collision = true;
                        else {
                            scoreToAdd += 10;
                            return false; // Remove star on collection
                        }
                    }
                    return o.x > -o.width;
                });
                if (scoreToAdd > 0) setScore(s => s + scoreToAdd);
                return newObs;
            });

            if (collision) {
                setGameState('over');
            } else {
                gameLoopRef.current = requestAnimationFrame(gameLoop);
            }
        });
        
        return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current) };
    }, [gameState, velocity, astroY]);

    // Obstacle spawner
    useEffect(() => {
        if (gameState !== 'playing') return;
        const spawnInterval = setInterval(() => {
            const isStar = Math.random() > 0.7;
            const newObstacle: Obstacle = {
                id: Date.now(),
                type: isStar ? 'star' : 'asteroid',
                x: GAME_WIDTH,
                y: Math.random() * (GAME_HEIGHT - 50),
                width: isStar ? 30 : 50,
                height: isStar ? 30 : 50,
            };
            setObstacles(o => [...o, newObstacle]);
        }, 1500);
        return () => clearInterval(spawnInterval);
    }, [gameState]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-slate-900">{gameName}</h1>
                <div className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg">النجوم: {score}</div>
            </div>
            <div
                onClick={flyUp}
                className="relative bg-gray-800 w-full overflow-hidden cursor-pointer border-2 border-gray-500"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto', background: 'linear-gradient(#0c0a1f, #2a2a72)' }}
            >
                {/* Astronaut */}
                <div className="absolute text-4xl" style={{ left: 50, top: astroY }}>🧑‍🚀</div>
                {/* Obstacles */}
                {obstacles.map(o => (
                    <div key={o.id} className="absolute text-4xl" style={{ left: o.x, top: o.y }}>
                        {o.type === 'asteroid' ? '☄️' : '⭐'}
                    </div>
                ))}

                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">انتهت اللعبة!</h2>}
                        <button onClick={startGame} className="bg-blue-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-blue-600">
                            {gameState === 'idle' ? 'ابدأ الرحلة' : 'حاول مرة أخرى'}
                        </button>
                        <p className="mt-2">انقر للطيران!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AstronautAdventure;