import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const PUZZLES = [
    { left: '🐘', right: '🐁', heavier: 'left' },
    { left: '🧱', right: '🎈', heavier: 'left' },
    { left: ' anvil ', right: ' feather ', heavier: 'left'},
    { left: '🚗', right: '🚲', heavier: 'left' },
];

const WeightPuzzle: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentPuzzle, setCurrentPuzzle] = useState(PUZZLES[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        let newPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
        // Randomly swap sides
        if (Math.random() > 0.5) {
            [newPuzzle.left, newPuzzle.right] = [newPuzzle.right, newPuzzle.left];
            newPuzzle.heavier = 'right';
        } else {
             newPuzzle.heavier = 'left';
        }
        setCurrentPuzzle(newPuzzle);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleSideClick = (side: 'left' | 'right') => {
        if (feedback) return;
        if (side === currentPuzzle.heavier) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    const rotation = feedback ? (currentPuzzle.heavier === 'left' ? -15 : 15) : 0;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-600">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-yellow-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-700 mb-8">أي جانب هو الأثقل؟</h2>

            <div className="flex flex-col items-center">
                <div className="relative w-96 h-48">
                    {/* Scale Beam */}
                    <div className="absolute top-1/2 left-0 w-full h-4 bg-gray-400 rounded-full transition-transform duration-500" style={{ transform: `translateY(-50%) rotate(${rotation}deg)` }}>
                         {/* Left Pan */}
                        <button onClick={() => handleSideClick('left')} className="absolute -left-8 -top-16 w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-6xl">
                            {currentPuzzle.left}
                        </button>
                         {/* Right Pan */}
                        <button onClick={() => handleSideClick('right')} className="absolute -right-8 -top-16 w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-6xl">
                            {currentPuzzle.right}
                        </button>
                    </div>
                     {/* Scale Base */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-gray-600" />
                </div>
            </div>

            {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 خطأ! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default WeightPuzzle;
