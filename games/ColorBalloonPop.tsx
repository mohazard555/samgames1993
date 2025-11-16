import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const COLORS = [
    { name: 'أحمر', hex: '#ef4444' },
    { name: 'أزرق', hex: '#3b82f6' },
    { name: 'أخضر', hex: '#22c55e' },
    { name: 'أصفر', hex: '#eab308' },
];

interface Balloon {
    id: number;
    x: number;
    y: number;
    color: typeof COLORS[0];
}

const ColorBalloonPop: React.FC<GameProps> = ({ gameName }) => {
    const [balloons, setBalloons] = useState<Balloon[]>([]);
    const [targetColor, setTargetColor] = useState(COLORS[0]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');

    const changeTargetColor = useCallback(() => {
        setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }, []);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setBalloons([]);
        changeTargetColor();
        setGameState('playing');
    };

    // Game Timer & Color Changer
    useEffect(() => {
        if (gameState !== 'playing') return;
        if (timeLeft <= 0) {
            setGameState('finished');
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(t => t - 1);
            if ((timeLeft - 1) % 5 === 0) changeTargetColor();
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState, timeLeft, changeTargetColor]);

    // Balloon Spawner & Mover
    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = setInterval(() => {
            setBalloons(b => b.map(bal => ({...bal, y: bal.y-1})).filter(bal => bal.y > -20));
            if (Math.random() > 0.6) {
                const newBalloon: Balloon = {
                    id: Date.now(),
                    x: Math.random() * 90,
                    y: 110,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                };
                setBalloons(b => [...b, newBalloon]);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [gameState]);

    const popBalloon = (balloon: Balloon) => {
        if (balloon.color.name === targetColor.name) {
            setScore(s => s + 10);
        } else {
            setScore(s => s - 5);
        }
        setBalloons(b => b.filter(b => b.id !== balloon.id));
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-pink-300">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-pink-800">{gameName}</h1>
                <div className="flex gap-4">
                    <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
                    <div className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">الوقت: {timeLeft}</div>
                </div>
            </div>
            
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: targetColor.hex }}>
                <h2 className="text-3xl font-bold text-white">فرقع البالونات ذات اللون: {targetColor.name}</h2>
            </div>

            <div className="relative w-full h-[500px] bg-sky-100 rounded-lg overflow-hidden border-2 border-sky-200">
                {gameState === 'playing' ? (
                    balloons.map(b => (
                        <div key={b.id} onClick={() => popBalloon(b)} className="absolute text-6xl cursor-pointer" style={{left: `${b.x}%`, top: `${b.y}%`}}>🎈</div>
                    ))
                ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                         {gameState === 'finished' && <h2 className="text-3xl font-bold mb-4">انتهت اللعبة! نتيجتك: {score}</h2>}
                         <button onClick={startGame} className="bg-pink-500 text-white font-bold py-4 px-8 rounded-full text-2xl hover:bg-pink-600">
                             {gameState === 'idle' ? 'ابدأ اللعب' : 'العب مرة أخرى'}
                         </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorBalloonPop;
