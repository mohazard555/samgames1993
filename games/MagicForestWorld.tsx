import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const HERO_WIDTH = 50;

interface Item {
    id: number;
    type: 'fruit' | 'bomb';
    emoji: string;
    x: number;
    y: number;
    speed: number;
}

const MagicForestWorld: React.FC<GameProps> = ({ gameName }) => {
    const [heroX, setHeroX] = useState(GAME_WIDTH / 2);
    const [items, setItems] = useState<Item[]>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
    const gameAreaRef = useRef<HTMLDivElement>(null);

    const startGame = () => {
        setScore(0);
        setItems([]);
        setHeroX(GAME_WIDTH / 2);
        setGameState('playing');
    };
    
    // Game Loop
    useEffect(() => {
        if (gameState !== 'playing') return;
        
        const interval = setInterval(() => {
            // Move items down
            let collision = false;
            setItems(currentItems => currentItems.map(item => ({...item, y: item.y + item.speed})).filter(item => {
                 // Check for collision with hero
                 if (item.y > GAME_HEIGHT - 40 && item.y < GAME_HEIGHT && item.x > heroX - HERO_WIDTH/2 && item.x < heroX + HERO_WIDTH/2) {
                     if (item.type === 'fruit') {
                         setScore(s => s + 10);
                     } else {
                         collision = true;
                     }
                     return false; // Remove item
                 }
                 return item.y < GAME_HEIGHT; // Keep item if it's on screen
            }));

            if(collision) setGameState('over');

        }, 50); // ~20fps

        return () => clearInterval(interval);
    }, [gameState, heroX]);

    // Item spawner
    useEffect(() => {
        if (gameState !== 'playing') return;
        const spawnInterval = setInterval(() => {
            const type = Math.random() > 0.2 ? 'fruit' : 'bomb';
            const newItem: Item = {
                id: Date.now(),
                type,
                emoji: type === 'fruit' ? '🍓' : '💣',
                x: Math.random() * (GAME_WIDTH - 20) + 10,
                y: -20,
                speed: Math.random() * 2 + 2,
            };
            setItems(i => [...i, newItem]);
        }, 800);
        return () => clearInterval(spawnInterval);
    }, [gameState]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (gameState !== 'playing' || !gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        setHeroX(Math.max(HERO_WIDTH/2, Math.min(GAME_WIDTH - HERO_WIDTH/2, newX)));
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-lime-400">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-lime-800">{gameName}</h1>
                <div className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div
                ref={gameAreaRef}
                onMouseMove={handleMouseMove}
                className="relative bg-green-100 w-full overflow-hidden cursor-none border-2 border-gray-400"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto', backgroundImage: 'url(https://www.transparenttextures.com/patterns/forest.png)' }}
            >
                {/* Hero */}
                <div className="absolute text-5xl" style={{ left: heroX, bottom: 0, transform: 'translateX(-50%)', width: HERO_WIDTH }}>🦔</div>
                {/* Items */}
                {items.map(item => (
                    <div key={item.id} className="absolute text-3xl" style={{ left: item.x, top: item.y, transform: 'translateX(-50%)' }}>{item.emoji}</div>
                ))}
                
                 {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">انتهت اللعبة! نتيجتك: {score}</h2>}
                        <button onClick={startGame} className="bg-lime-600 font-bold py-3 px-6 rounded-full text-xl hover:bg-lime-700">
                            {gameState === 'idle' ? 'ابدأ المغامرة' : 'العب مرة أخرى'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MagicForestWorld;
