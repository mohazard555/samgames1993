import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
}
const GAME_TIME = 30;

const FastBubbles: React.FC<GameProps> = ({ gameName }) => {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_TIME);
        setBubbles([]);
        setGameState('playing');
    };

    // Game loop for moving bubbles
    useEffect(() => {
        if (gameState !== 'playing') return;
        const moveInterval = setInterval(() => {
            setBubbles(b => b
                .map(bubble => ({ ...bubble, y: bubble.y - 1 }))
                .filter(bubble => bubble.y > -bubble.size)
            );
        }, 50);
        return () => clearInterval(moveInterval);
    }, [gameState]);
    
    // Bubble spawner
    useEffect(() => {
        if (gameState !== 'playing') return;
        const spawnInterval = setInterval(() => {
            const newBubble: Bubble = {
                id: Date.now(),
                x: Math.random() * 90 + 5,
                y: 110,
                size: Math.random() * 40 + 20,
                color: `hsl(${Math.random() * 360}, 70%, 80%)`,
            };
            setBubbles(b => [...b, newBubble]);
        }, 500);
        return () => clearInterval(spawnInterval);
    }, [gameState]);

    // Game Timer
    useEffect(() => {
        if (gameState !== 'playing' || timeLeft <= 0) {
            if (timeLeft <= 0) setGameState('finished');
            return;
        };
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [gameState, timeLeft]);

    const popBubble = (id: number) => {
        setBubbles(b => b.filter(bubble => bubble.id !== id));
        setScore(s => s + 1);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-cyan-300">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-cyan-800">{gameName}</h1>
                <div className="flex gap-4">
                    <div className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
                    <div className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">الوقت: {timeLeft}</div>
                </div>
            </div>
            <div className="relative w-full h-[500px] bg-cyan-50 rounded-lg overflow-hidden border-2 border-cyan-200">
                {gameState === 'playing' ? (
                    bubbles.map(bubble => (
                        <button
                            key={bubble.id}
                            onClick={() => popBubble(bubble.id)}
                            className="absolute rounded-full transform transition-all duration-500 ease-out"
                            style={{
                                left: `${bubble.x}%`,
                                top: `${bubble.y}%`,
                                width: bubble.size,
                                height: bubble.size,
                                backgroundColor: bubble.color,
                                transform: 'translate(-50%, -50%)',
                                border: '2px solid rgba(255, 255, 255, 0.7)',
                            }}
                        />
                    ))
                ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                         {gameState === 'finished' && <h2 className="text-3xl font-bold mb-4">انتهت اللعبة! نتيجتك: {score}</h2>}
                         <button onClick={startGame} className="bg-cyan-500 text-white font-bold py-4 px-8 rounded-full text-2xl hover:bg-cyan-600">
                             {gameState === 'idle' ? 'ابدأ اللعب' : 'العب مرة أخرى'}
                         </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FastBubbles;
