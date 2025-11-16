import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PLAYER_SIZE = 30;
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const MOVE_SPEED = 4;

const PLATFORMS = [
  { x: 0, y: 380, width: 150 },
  { x: 200, y: 340, width: 100 },
  { x: 350, y: 300, width: 120 },
  { x: 150, y: 250, width: 80 },
  { x: 450, y: 220, width: 100 },
  { x: 300, y: 180, width: 100 },
  { x: 100, y: 130, width: 80 },
  { x: 550, y: 100, width: 50 },
];

const STARS = [
  { x: 230, y: 300 },
  { x: 160, y: 210 },
  { x: 480, y: 180 },
  { x: 120, y: 90 },
];

const GlowingPlanetJourney: React.FC<GameProps> = ({ gameName }) => {
    const [player, setPlayer] = useState({ x: 50, y: 350, vx: 0, vy: 0, onGround: false });
    const [collectedStars, setCollectedStars] = useState<boolean[]>(new Array(STARS.length).fill(false));
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
    const keysRef = useRef<{ [key: string]: boolean }>({});

    const startGame = () => {
        setPlayer({ x: 50, y: 350, vx: 0, vy: 0, onGround: false });
        setCollectedStars(new Array(STARS.length).fill(false));
        setGameState('playing');
    };

    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;

        setPlayer(p => {
            let { x, y, vx, vy, onGround } = p;
            
            // Horizontal movement
            vx = 0;
            if (keysRef.current.ArrowLeft) vx = -MOVE_SPEED;
            if (keysRef.current.ArrowRight) vx = MOVE_SPEED;
            x += vx;

            // Vertical movement (gravity)
            vy += GRAVITY;
            y += vy;
            
            onGround = false;

            // Collision with platforms
            PLATFORMS.forEach(plat => {
                if (x + PLAYER_SIZE > plat.x && x < plat.x + plat.width && y + PLAYER_SIZE > plat.y && y + PLAYER_SIZE < plat.y + 20 && vy > 0) {
                    vy = 0;
                    y = plat.y - PLAYER_SIZE;
                    onGround = true;
                }
            });

            // Boundaries
            if (x < 0) x = 0;
            if (x > GAME_WIDTH - PLAYER_SIZE) x = GAME_WIDTH - PLAYER_SIZE;
            if (y > GAME_HEIGHT) startGame(); // Fell off

            return { x, y, vx, vy, onGround };
        });

        // Collect stars
        setCollectedStars(currentStars => {
            const newStars = [...currentStars];
            STARS.forEach((star, i) => {
                if (!newStars[i]) {
                    const dx = player.x - star.x;
                    const dy = player.y - star.y;
                    if (Math.sqrt(dx*dx + dy*dy) < PLAYER_SIZE) {
                        newStars[i] = true;
                    }
                }
            });
            return newStars;
        });

        // Win condition
        if (player.x > 550 && player.y < 100) {
            setGameState('won');
        }

    }, [gameState, player.x, player.y]);
    
    useEffect(() => {
        if (gameState === 'playing') {
            const handleKeyDown = (e: KeyboardEvent) => {
                keysRef.current[e.key] = true;
                if (e.key === ' ' && player.onGround) {
                    setPlayer(p => ({ ...p, vy: JUMP_FORCE }));
                }
            };
            const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            
            const interval = setInterval(gameLoop, 16);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
                clearInterval(interval);
            };
        }
    }, [gameState, gameLoop, player.onGround]);
    
    const score = collectedStars.filter(Boolean).length;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-400">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-purple-800">{gameName}</h1>
                <div className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg">النجوم: {score} / {STARS.length}</div>
            </div>
            <p className="text-sm mb-2">استخدم الأسهم للحركة والمسافة للقفز. اجمع النجوم واوصل للنهاية!</p>

            <div className="relative mx-auto" style={{ width: GAME_WIDTH, height: GAME_HEIGHT, background: '#1a202c' }}>
                {PLATFORMS.map((p, i) => <div key={i} className="absolute bg-purple-400" style={{ left: p.x, top: p.y, width: p.width, height: 20 }} />)}
                {STARS.map((s, i) => !collectedStars[i] && <div key={i} className="absolute text-2xl" style={{ left: s.x, top: s.y }}>⭐</div>)}
                <div className="absolute bg-green-400 text-center" style={{ left: 550, top: 100, width: 50, height: 20 }}>النهاية</div>
                <div className="absolute text-3xl" style={{ left: player.x, top: player.y }}>🧑‍🚀</div>
                
                {gameState !== 'playing' && (
                     <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        {gameState === 'won' && <h2 className="text-4xl font-bold mb-4">🎉 لقد فزت! 🎉</h2>}
                        <button onClick={startGame} className="bg-purple-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-purple-600">
                            {gameState === 'idle' ? 'ابدأ الرحلة' : 'العب مرة أخرى'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlowingPlanetJourney;