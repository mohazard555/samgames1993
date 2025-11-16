import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const FunFootball: React.FC<GameProps> = ({ gameName }) => {
    const [shotsLeft, setShotsLeft] = useState(5);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'aiming' | 'shot' | 'finished'>('aiming');
    const [aimPosition, setAimPosition] = useState(50); // 0-100%
    const [ballPosition, setBallPosition] = useState({ x: 50, y: 90 });
    const [keeperPosition, setKeeperPosition] = useState(50); // 0-100%
    const aimDirection = useRef(1);

    // Aiming animation
    useEffect(() => {
        if (gameState !== 'aiming') return;
        const interval = setInterval(() => {
            setAimPosition(pos => {
                if (pos >= 95) aimDirection.current = -1;
                if (pos <= 5) aimDirection.current = 1;
                return pos + aimDirection.current * 1.5;
            });
        }, 20);
        return () => clearInterval(interval);
    }, [gameState]);

    const handleShoot = () => {
        if (gameState !== 'aiming') return;
        setGameState('shot');
        
        // Keeper's move
        const keeperTarget = Math.random() * 80 + 10;
        setKeeperPosition(keeperTarget);
        
        // Animate ball
        setBallPosition({ x: aimPosition, y: 20 });
        
        // Calculate result
        const shotResult = Math.abs(aimPosition - keeperTarget) > 15; // 15% margin for a save
        
        setTimeout(() => {
            if (shotResult) {
                setScore(s => s + 1);
            }
            setShotsLeft(s => s - 1);
            if (shotsLeft - 1 > 0) {
                resetShot();
            } else {
                setGameState('finished');
            }
        }, 1500);
    };

    const resetShot = () => {
        setBallPosition({ x: 50, y: 90 });
        setKeeperPosition(50);
        setGameState('aiming');
    };

    const restartGame = () => {
        setShotsLeft(5);
        setScore(0);
        resetShot();
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-400">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <div className="flex gap-4">
                    <div className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">النتيجة: {score}</div>
                    <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">تسديدات: {shotsLeft}</div>
                </div>
            </div>

            <div className="relative w-full max-w-lg mx-auto aspect-video bg-green-200 rounded-lg overflow-hidden border-4 border-gray-500" style={{ background: 'linear-gradient(to bottom, #6abf6a, #3b8c3b)' }}>
                {/* Goal */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-4 border-white z-0"></div>
                {/* Keeper */}
                <div className="absolute top-1/4 text-5xl z-20 transition-all duration-300" style={{ left: `${keeperPosition}%`, transform: 'translateX(-50%)' }}>🧤</div>
                {/* Ball */}
                <div className="absolute text-3xl z-30 transition-all duration-500" style={{ left: `${ballPosition.x}%`, top: `${ballPosition.y}%`, transform: 'translate(-50%, -50%)' }}>⚽</div>
                {/* Aiming arrow */}
                {gameState === 'aiming' && <div className="absolute bottom-4 text-4xl text-red-500" style={{ left: `${aimPosition}%`, transform: 'translateX(-50%)' }}>⬇️</div>}
            </div>

            <div className="mt-6">
                {gameState === 'finished' ? (
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl font-bold mb-4">انتهت اللعبة! نتيجتك: {score} من 5</h2>
                        <button onClick={restartGame} className="bg-green-600 text-white font-bold py-3 px-6 rounded-full text-xl hover:bg-green-700">العب مرة أخرى</button>
                    </div>
                ) : (
                    <button onClick={handleShoot} disabled={gameState !== 'aiming'} className="bg-red-600 text-white font-bold py-4 px-10 rounded-full text-2xl hover:bg-red-700 disabled:bg-gray-400">
                        سدد!
                    </button>
                )}
            </div>
        </div>
    );
};

export default FunFootball;
