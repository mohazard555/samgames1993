import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const CAR_WIDTH = 40;

const TurboCarRacing: React.FC<GameProps> = ({ gameName }) => {
    const [carX, setCarX] = useState(GAME_WIDTH / 2 - CAR_WIDTH / 2);
    const [obstacles, setObstacles] = useState<{id: number, x: number, y: number}[]>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
    // Fix: Initialize useRef with null to fix "Expected 1 arguments, but got 0" error.
    const gameLoopRef = useRef<number | null>(null);

    const startGame = () => {
        setCarX(GAME_WIDTH / 2 - CAR_WIDTH / 2);
        setObstacles([]);
        setScore(0);
        setGameState('playing');
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(gameState !== 'playing') return;
            if (e.key === 'ArrowLeft') setCarX(x => Math.max(0, x - 15));
            if (e.key === 'ArrowRight') setCarX(x => Math.min(GAME_WIDTH - CAR_WIDTH, x + 15));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    // Game Loop
    useEffect(() => {
        if (gameState !== 'playing') return;
        let frameCount = 0;
        gameLoopRef.current = requestAnimationFrame(function gameLoop() {
            let collision = false;
            const carRect = { x: carX, y: GAME_HEIGHT - 80, width: CAR_WIDTH, height: 60 };
            
            setObstacles(obs => {
                const newObs = obs.map(o => ({ ...o, y: o.y + 5 })).filter(o => {
                    const obsRect = { x: o.x, y: o.y, width: CAR_WIDTH, height: 60 };
                    if (carRect.x < obsRect.x + obsRect.width &&
                        carRect.x + carRect.width > obsRect.x &&
                        carRect.y < obsRect.y + obsRect.height &&
                        carRect.y + carRect.height > obsRect.y) {
                        collision = true;
                    }
                    return o.y < GAME_HEIGHT;
                });
                return newObs;
            });
            
            // Spawn new obstacles
            frameCount++;
            if (frameCount % 60 === 0) {
                 setObstacles(o => [...o, {id: Date.now(), x: Math.random() * (GAME_WIDTH - CAR_WIDTH), y: -60}])
            }

            if (collision) {
                setGameState('over');
            } else {
                setScore(s => s + 1);
                gameLoopRef.current = requestAnimationFrame(gameLoop);
            }
        });
        return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current) };
    }, [gameState, carX]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-gray-500">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-gray-800">{gameName}</h1>
                <div className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <p className="text-sm mb-2">استخدم مفاتيح الأسهم للتحرك!</p>
            <div
                className="relative bg-gray-600 w-full overflow-hidden border-8 border-gray-400"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto' }}
            >
                {/* Car */}
                <div className="absolute text-5xl" style={{ left: carX, bottom: 20 }}>🏎️</div>
                {/* Obstacles */}
                {obstacles.map(o => <div key={o.id} className="absolute text-5xl" style={{left: o.x, top: o.y}}>🚓</div>)}

                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">انتهت اللعبة!</h2>}
                        <button onClick={startGame} className="bg-green-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-green-600">
                            {gameState === 'idle' ? 'ابدأ السباق' : 'حاول مرة أخرى'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TurboCarRacing;