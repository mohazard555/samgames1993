import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const PAIRS = [
    { healthy: '🥦', unhealthy: '🍫' },
    { healthy: '🍎', unhealthy: '🍩' },
    { healthy: '🥕', unhealthy: '🍟' },
    { healthy: '🥛', unhealthy: '🥤' },
];

const HealthyFood: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentPair, setCurrentPair] = useState(PAIRS[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const newPair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
        setCurrentPair(newPair);
        setOptions([newPair.healthy, newPair.unhealthy].sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleGuess = (guess: string) => {
        if (feedback) return;
        if (guess === currentPair.healthy) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-lime-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-lime-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <h2 className="text-4xl font-bold text-gray-700 mb-8">اختر الطعام الصحي:</h2>

            <div className="flex justify-center items-center gap-8">
                {options.map((item) => (
                    <button key={item} onClick={() => handleGuess(item)} className="bg-lime-100 p-8 rounded-3xl hover:bg-lime-200 transform transition-transform hover:scale-105">
                        <span className="text-9xl">{item}</span>
                    </button>
                ))}
            </div>

            {feedback && (
                <div className="mt-8 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 اختيار ممتاز وصحي! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 حاول اختيار الطعام الأفضل لصحتك! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default HealthyFood;
