import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const MagicBasketballShots: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [shots, setShots] = useState(5);
    const [gameState, setGameState] = useState<'aiming' | 'shot' | 'result'>('aiming');
    const [power, setPower] = useState(50);
    const [ballPos, setBallPos] = useState({ x: 10, y: 70 });
    const powerDirection = useRef(1);

    // Power meter animation
    useEffect(() => {
        if (gameState !== 'aiming') return;
        const interval = setInterval(() => {
            setPower(p => {
                if (p > 95) powerDirection.current = -1;
                if (p < 5) powerDirection.current = 1;
                return p + powerDirection.current * 2;
            });
        }, 20);
        return () => clearInterval(interval);
    }, [gameState]);

    const shoot = () => {
        if (gameState !== 'aiming' || shots <= 0) return;
        setGameState('shot');

        // Simple trajectory check
        const isGoal = power > 60 && power < 85;
        
        // Animate ball
        setBallPos({ x: 80, y: isGoal ? 30 : 40 });

        setTimeout(() => {
            if (isGoal) setScore(s => s + 1);
            setShots(s => s - 1);
            setGameState('result');

            setTimeout(() => {
                setBallPos({ x: 10, y: 70 });
                if (shots - 1 > 0) {
                     setGameState('aiming');
                }
            }, 1000);
        }, 500);
    };

    const restartGame = () => {
        setScore(0);
        setShots(5);
        setGameState('aiming');
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-orange-400">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-orange-800">{gameName}</h1>
                <div className="flex gap-4">
                    <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
                    <div className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">الرميات: {shots}</div>
                </div>
            </div>

            <div className="relative w-full max-w-lg mx-auto aspect-video bg-sky-100 rounded-lg overflow-hidden border-2 border-gray-300">
                 {/* Hoop */}
                 <div className="absolute w-16 h-1 bg-red-600" style={{ right: '10%', top: '40%' }}></div>
                 <div className="absolute w-1 h-8 bg-gray-600" style={{ right: '20%', top: '42%' }}></div>
                 {/* Ball */}
                 <div className="absolute text-4xl transition-all duration-500" style={{left: `${ballPos.x}%`, top: `${ballPos.y}%`}}>🏀</div>
            </div>
            
            <div className="mt-4">
                {/* Power Bar */}
                <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden relative">
                    <div className="h-full bg-green-500" style={{ width: `${power}%` }}></div>
                    <div className="absolute top-0 h-full w-1 bg-red-600" style={{left: '60%'}}></div>
                    <div className="absolute top-0 h-full w-1 bg-red-600" style={{left: '85%'}}></div>
                </div>
                 <p className="text-sm text-gray-500">حاول إيقاف المؤشر في المنطقة الحمراء!</p>
            </div>

            <div className="mt-6">
                {shots > 0 ? (
                    <button onClick={shoot} disabled={gameState !== 'aiming'} className="bg-orange-500 text-white font-bold py-4 px-10 rounded-full text-2xl hover:bg-orange-600 disabled:bg-gray-400">
                        ارمي الكرة
                    </button>
                ) : (
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl font-bold mb-4">انتهت اللعبة! نتيجتك: {score} من 5</h2>
                        <button onClick={restartGame} className="bg-orange-600 text-white font-bold py-3 px-6 rounded-full text-xl hover:bg-orange-700">العب مرة أخرى</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MagicBasketballShots;
