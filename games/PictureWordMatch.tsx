import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ITEMS = [
    { image: '🍎', word: 'تفاحة' },
    { image: '🚗', word: 'سيارة' },
    { image: '🏠', word: 'منزل' },
    { image: '☀️', word: 'شمس' },
    { image: '🌙', word: 'قمر' },
];

const PictureWordMatch: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentItem, setCurrentItem] = useState(ITEMS[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const correctItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        setCurrentItem(correctItem);

        const wrongOptions = ITEMS.filter(item => item.word !== correctItem.word).map(item => item.word);
        const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        
        setOptions([correctItem.word, ...shuffledWrong].sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleOptionClick = (selectedWord: string) => {
        if (feedback) return;
        if (selectedWord === currentItem.word) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-sky-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-sky-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <h2 className="text-3xl font-bold text-gray-700 mb-4">أي كلمة تطابق الصورة؟</h2>
            <div className="text-9xl mb-8">{currentItem.image}</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => (
                    <button key={option} onClick={() => handleOptionClick(option)} className="bg-sky-500 text-white font-bold text-4xl p-6 rounded-2xl hover:bg-sky-600 transition-transform transform hover:scale-105">
                        {option}
                    </button>
                ))}
            </div>
            
            {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 رائع! إجابة صحيحة! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 حاول مرة أخرى! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default PictureWordMatch;