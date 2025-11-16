import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

interface Enemy {
    id: number;
    position: number;
}

const GentleKnight: React.FC<GameProps> = ({ gameName }) => {
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');

    const startGame = () => {
        setEnemies([]);
        setScore(0);
        setGameState('playing');
    };

    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = setInterval(() => {
            setEnemies(e => e.map(enemy => ({ ...enemy, position: enemy.position - 5 })));
            if (Math.random() < 0.1) {
                setEnemies(e => [...e, { id: Date.now(), position: 500 }]);
            }
            if (enemies.some(e => e.position < 50)) {
                setGameState('over');
            }
        }, 100);
        return () => clearInterval(interval);
    }, [gameState, enemies]);

    const attack = () => {
        if (gameState !== 'playing') return;
        setEnemies(e => {
            const newEnemies = [...e];
            const hitEnemyIndex = newEnemies.findIndex(enemy => enemy.position < 100 && enemy.position > 40);
            if (hitEnemyIndex > -1) {
                newEnemies.splice(hitEnemyIndex, 1);
                setScore(s => s + 1);
            }
            return newEnemies;
        });
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">القتلى: {score}</div>
            </div>
            <div onClick={attack} className="relative w-[500px] h-[300px] bg-green-200 mx-auto border-2 border-gray-400 overflow-hidden cursor-pointer">
                <div className="absolute text-5xl" style={{ left: 20, bottom: 10 }}>🤺</div>
                {enemies.map(e => <div key={e.id} className="absolute text-5xl" style={{ left: e.position, bottom: 10 }}>👻</div>)}
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

export default GentleKnight;
