import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const RABBIT_WIDTH = 40;
const RABBIT_HEIGHT = 40;
const GRAVITY = 0.3;
const JUMP_FORCE = -10;

interface Platform {
  x: number;
  y: number;
  width: number;
}

const AdventurousRabbitJumps: React.FC<GameProps> = ({ gameName }) => {
    const [rabbit, setRabbit] = useState({ x: GAME_WIDTH / 2 - 20, y: GAME_HEIGHT - 50, vy: 0 });
    const [platforms, setPlatforms] = useState<Platform[]>([{ x: GAME_WIDTH / 2 - 50, y: GAME_HEIGHT - 20, width: 100 }]);
    const [cameraY, setCameraY] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
    const keysRef = useRef<{ [key: string]: boolean }>({});

    const startGame = useCallback(() => {
        setRabbit({ x: GAME_WIDTH / 2 - 20, y: GAME_HEIGHT - 50, vy: JUMP_FORCE });
        setPlatforms([{ x: GAME_WIDTH / 2 - 50, y: GAME_HEIGHT - 20, width: 100 }]);
        setCameraY(0);
        setScore(0);
        setGameState('playing');
    }, []);

    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;

        // Rabbit movement
        setRabbit(r => {
            let { x, y, vy } = r;
            // Horizontal
            if (keysRef.current.ArrowLeft) x -= 5;
            if (keysRef.current.ArrowRight) x += 5;
            if (x > GAME_WIDTH) x = -RABBIT_WIDTH; // Screen wrap
            if (x < -RABBIT_WIDTH) x = GAME_WIDTH;

            // Vertical
            vy += GRAVITY;
            y += vy;

            return { x, y, vy };
        });

        // Camera and platform generation
        if (rabbit.y < cameraY + GAME_HEIGHT / 2) {
            setCameraY(rabbit.y - GAME_HEIGHT / 2);
        }

        setPlatforms(plats => {
            // Check for jump
            plats.forEach(p => {
                if (rabbit.vy > 0 && rabbit.x + RABBIT_WIDTH > p.x && rabbit.x < p.x + p.width && rabbit.y + RABBIT_HEIGHT > p.y && rabbit.y + RABBIT_HEIGHT < p.y + 20) {
                    setRabbit(r => ({ ...r, vy: JUMP_FORCE }));
                }
            });

            // Remove old platforms
            let newPlats = plats.filter(p => p.y > cameraY - 20);
            
            // Add new platforms
            let topPlatformY = newPlats.reduce((min, p) => Math.min(min, p.y), GAME_HEIGHT);
            while (topPlatformY > cameraY) {
                topPlatformY -= Math.random() * 60 + 40;
                newPlats.push({
                    x: Math.random() * (GAME_WIDTH - 100),
                    y: topPlatformY,
                    width: Math.random() * 50 + 50,
                });
            }
            return newPlats;
        });
        
        // Score
        setScore(Math.floor(-cameraY));

        // Game over
        if (rabbit.y > cameraY + GAME_HEIGHT) {
            setGameState('over');
        }

    }, [gameState, rabbit.y, rabbit.vy, rabbit.x, cameraY]);
    
    useEffect(() => {
        if (gameState !== 'playing') return;

        const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        const interval = setInterval(gameLoop, 16);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(interval);
        };
    }, [gameState, gameLoop]);
    
    // Auto-start for simplicity
    useEffect(() => {
        if (gameState === 'idle') {
            startGame();
        }
    }, [gameState, startGame]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-400">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <div className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg">الارتفاع: {score}</div>
            </div>
            <p className="text-sm mb-2">استخدم الأسهم للتحرك والقفز لأعلى!</p>

            <div className="relative mx-auto" style={{ width: GAME_WIDTH, height: GAME_HEIGHT, background: '#87CEEB', overflow: 'hidden' }}>
                <div style={{ transform: `translateY(${-cameraY}px)` }}>
                    {platforms.map((p, i) => <div key={i} className="absolute bg-green-500" style={{ left: p.x, top: p.y, width: p.width, height: 20 }}/>)}
                    <div className="absolute text-4xl" style={{ left: rabbit.x, top: rabbit.y }}>🐰</div>
                </div>
                
                {gameState === 'over' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        <h2 className="text-4xl font-bold mb-2">انتهت اللعبة!</h2>
                        <h3 className="text-2xl font-bold mb-4">النتيجة: {score}</h3>
                        <button onClick={startGame} className="bg-green-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-green-600">
                           العب مرة أخرى
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdventurousRabbitJumps;