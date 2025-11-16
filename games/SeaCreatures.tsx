import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const CREATURES = [
    { name: "أخطبوط", image: '🐙', options: ['أخطبوط', 'نجم البحر', 'قرش'] },
    { name: "سمكة", image: '🐠', options: ['حوت', 'سمكة', 'سلطعون'] },
    { name: "حوت", image: '🐳', options: ['حوت', 'دولفين', 'حصان البحر'] },
    { name: "سلطعون", image: '🦀', options: ['جمبري', 'سلطعون', 'محار'] },
];

const SeaCreatures: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentCreature, setCurrentCreature] = useState(CREATURES[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const newCreature = CREATURES[Math.floor(Math.random() * CREATURES.length)];
        newCreature.options.sort(() => Math.random() - 0.5);
        setCurrentCreature(newCreature);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleAnswer = (option: string) => {
        if (feedback) return;
        if (option === currentCreature.name) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-blue-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-blue-100 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">ما اسم هذا المخلوق البحري؟</h2>
                <div className="text-9xl mb-8">{currentCreature.image}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentCreature.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-blue-500 text-white font-bold text-3xl p-6 rounded-2xl hover:bg-blue-600">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 إجابة رائعة! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default SeaCreatures;
