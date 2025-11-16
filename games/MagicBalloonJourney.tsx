import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BALLOON_WIDTH = 50;

const MagicBalloonJourney: React.FC<GameProps> = ({ gameName }) => {
    const [balloonX, setBalloonX] = useState(GAME_WIDTH / 2 - BALLOON_WIDTH / 2);
    const [obstacles, setObstacles] = useState<{ id: number, x: number, y: number, speed: number }[]>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
    const gameAreaRef = useRef<HTMLDivElement>(null);

    const startGame = () => {
        setBalloonX(GAME_WIDTH / 2 - BALLOON_WIDTH / 2);
        setObstacles([]);
        setScore(0);
        setGameState('playing');
    };

    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;

        let collision = false;
        setObstacles(obs => obs.map(o => ({ ...o, y: o.y + 3, x: o.x + o.speed })).filter(o => {
            // Screen wrap for obstacles
            if (o.x > GAME_WIDTH) o.x = -30;
            if (o.x < -30) o.x = GAME_WIDTH;

            if (o.y > GAME_HEIGHT - 100 && o.y < GAME_HEIGHT - 50 && Math.abs(o.x - balloonX) < BALLOON_WIDTH) {
                collision = true;
            }
            return o.y < GAME_HEIGHT;
        }));
        
        if (collision) {
            setGameState('over');
            return;
        }

        if (Math.random() < 0.03) {
            setObstacles(obs => [...obs, { id: Date.now(), x: Math.random() * GAME_WIDTH, y: -30, speed: (Math.random() - 0.5) * 4 }]);
        }

        setScore(s => s + 1);
    }, [gameState, balloonX]);

    useEffect(() => {
        const interval = setInterval(gameLoop, 30);
        return () => clearInterval(interval);
    }, [gameLoop]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (gameState !== 'playing' || !gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        setBalloonX(Math.max(0, Math.min(GAME_WIDTH - BALLOON_WIDTH, x)));
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-sky-400">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-sky-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">الارتفاع: {score}</div>
            </div>
            <div
                ref={gameAreaRef}
                onMouseMove={handleMouseMove}
                className="relative mx-auto bg-sky-200 overflow-hidden cursor-pointer border-2"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
                <div className="absolute text-6xl" style={{ left: balloonX, bottom: 20 }}>🎈</div>
                {obstacles.map(o => (
                    <div key={o.id} className="absolute text-4xl" style={{ left: o.x, top: o.y }}>🐦</div>
                ))}
                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">لقد اصطدمت!</h2>}
                        <button onClick={startGame} className="bg-sky-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-sky-600">
                            {gameState === 'idle' ? 'ابدأ الرحلة' : 'حاول مرة أخرى'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MagicBalloonJourney;