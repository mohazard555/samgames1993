import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GAME_WIDTH = 600;
const GAME_HEIGHT = 300;
const HERO_SIZE = 40;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_SPEED = 4;

const LittleHeroAdventure: React.FC<GameProps> = ({ gameName }) => {
    const [heroY, setHeroY] = useState(GAME_HEIGHT - HERO_SIZE);
    const [heroVelocity, setHeroVelocity] = useState(0);
    const [obstacles, setObstacles] = useState<{x: number, height: number}[]>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
    // Fix: Initialize useRef with null to fix "Expected 1 arguments, but got 0" error.
    const gameLoopRef = useRef<number | null>(null);
    const obstacleTimeoutRef = useRef<number | null>(null);

    const startGame = () => {
        setHeroY(GAME_HEIGHT - HERO_SIZE);
        setHeroVelocity(0);
        setObstacles([{ x: GAME_WIDTH, height: Math.random() * 80 + 40 }]);
        setScore(0);
        setGameState('playing');
    };

    const jump = useCallback(() => {
        if (gameState === 'playing' && heroY >= GAME_HEIGHT - HERO_SIZE - 5) {
            setHeroVelocity(JUMP_FORCE);
        }
    }, [gameState, heroY]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') jump();
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [jump]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        gameLoopRef.current = requestAnimationFrame(function gameLoop() {
            // Hero physics
            setHeroVelocity(v => v + GRAVITY);
            setHeroY(y => Math.min(GAME_HEIGHT - HERO_SIZE, y + heroVelocity));

            // Obstacle movement
            let collision = false;
            setObstacles(obs => {
                const newObstacles = obs.map(o => ({ ...o, x: o.x - OBSTACLE_SPEED }));
                
                // Collision detection
                const heroRect = { x: 50, y: heroY, width: HERO_SIZE, height: HERO_SIZE };
                for (const o of newObstacles) {
                    const obstacleRect = { x: o.x, y: GAME_HEIGHT - o.height, width: OBSTACLE_WIDTH, height: o.height };
                    if (heroRect.x < obstacleRect.x + obstacleRect.width &&
                        heroRect.x + heroRect.width > obstacleRect.x &&
                        heroRect.y < obstacleRect.y + obstacleRect.height &&
                        heroRect.y + heroRect.height > obstacleRect.y) {
                        collision = true;
                    }
                }
                
                return newObstacles.filter(o => o.x > -OBSTACLE_WIDTH);
            });
            
            if (collision) {
                setGameState('over');
            } else {
                setScore(s => s + 1);
                gameLoopRef.current = requestAnimationFrame(gameLoop);
            }
        });
        
        obstacleTimeoutRef.current = window.setInterval(() => {
            setObstacles(obs => [...obs, { x: GAME_WIDTH, height: Math.random() * 80 + 40 }]);
        }, 1800);

        return () => {
            if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            if(obstacleTimeoutRef.current) clearInterval(obstacleTimeoutRef.current);
        };
    }, [gameState, heroVelocity]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-emerald-300">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">→ العودة</Link>
                <h1 className="text-2xl font-bold text-emerald-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {Math.floor(score / 10)}</div>
            </div>
            <div
                onClick={jump}
                className="relative bg-sky-200 w-full overflow-hidden cursor-pointer border-2 border-gray-400"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto' }}
            >
                {/* Ground */}
                <div className="absolute bottom-0 left-0 w-full h-5 bg-green-600"></div>
                {/* Hero */}
                <div className="absolute text-4xl" style={{ left: 50, bottom: (GAME_HEIGHT - heroY - HERO_SIZE), width: HERO_SIZE, height: HERO_SIZE }}>🦸</div>
                {/* Obstacles */}
                {obstacles.map((obs, i) => (
                    <div key={i} className="absolute bottom-0 bg-yellow-800" style={{ left: obs.x, width: OBSTACLE_WIDTH, height: obs.height }}></div>
                ))}

                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                        {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">انتهت اللعبة!</h2>}
                        <button onClick={startGame} className="bg-emerald-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-emerald-600">
                            {gameState === 'idle' ? 'ابدأ المغامرة' : 'العب مرة أخرى'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LittleHeroAdventure;