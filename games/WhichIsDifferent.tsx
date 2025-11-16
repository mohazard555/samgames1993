import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const PUZZLES = [
    { items: ['🍎', '🍎', '🍌', '🍎'], different: '🍌' },
    { items: ['🚗', '✈️', '🚗', '🚗'], different: '✈️' },
    { items: ['🐶', '🐶', '🐶', '🐱'], different: '🐱' },
    { items: ['🟥', '🟥', '🟥', '🟦'], different: '🟦' },
];

const WhichIsDifferent: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentPuzzle, setCurrentPuzzle] = useState(PUZZLES[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const newPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
        // Shuffle the items for variety
        newPuzzle.items.sort(() => Math.random() - 0.5);
        setCurrentPuzzle(newPuzzle);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleItemClick = (item: string) => {
        if (feedback) return;
        if (item === currentPuzzle.different) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-indigo-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-indigo-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <h2 className="text-3xl font-bold text-gray-700 mb-8">اختر الشكل المختلف:</h2>

            <div className="flex justify-center items-center gap-6">
                {currentPuzzle.items.map((item, index) => (
                    <button key={index} onClick={() => handleItemClick(item)} className="bg-indigo-100 p-6 rounded-2xl hover:bg-indigo-200 transition-transform transform hover:scale-110">
                        <span className="text-8xl">{item}</span>
                    </button>
                ))}
            </div>

            {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! أنت ذكي! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 ليس هذا! حاول مرة أخرى! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default WhichIsDifferent;
