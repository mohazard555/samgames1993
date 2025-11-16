import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ITEMS = [
    { image: '🍎', name: 'تفاحة', letter: 'ت' },
    { image: '🐟', name: 'سمكة', letter: 'س' },
    { image: '🔑', name: 'مفتاح', letter: 'م' },
    { image: '🐘', name: 'فيل', letter: 'ف' },
    { image: '🐧', name: 'بطريق', letter: 'ب' },
];

const ALL_LETTERS = ['ت', 'س', 'م', 'ف', 'ب', 'ق', 'ن', 'ع'];

const FirstLetter: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentItem, setCurrentItem] = useState(ITEMS[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const correctItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        setCurrentItem(correctItem);

        const wrongOptions = ALL_LETTERS.filter(l => l !== correctItem.letter);
        const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        
        setOptions([correctItem.letter, ...shuffledWrong].sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleOptionClick = (selectedLetter: string) => {
        if (feedback) return;
        if (selectedLetter === currentItem.letter) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-red-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-red-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <h2 className="text-3xl font-bold text-gray-700 mb-4">بأي حرف تبدأ كلمة "{currentItem.name}"؟</h2>
            <div className="text-9xl mb-8">{currentItem.image}</div>

            <div className="flex justify-center gap-4">
                {options.map(option => (
                    <button key={option} onClick={() => handleOptionClick(option)} className="bg-red-400 text-white font-bold text-6xl w-32 h-32 rounded-2xl flex justify-center items-center hover:bg-red-500 transition-transform transform hover:scale-105">
                        {option}
                    </button>
                ))}
            </div>
            
            {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 أحسنت! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 خطأ! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default FirstLetter;