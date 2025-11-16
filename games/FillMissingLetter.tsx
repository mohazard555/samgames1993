import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const WORDS = [
    { image: '🍎', word: 'تفاحة', missing: 'تفا_ة' },
    { image: '🐟', word: 'سمكة', missing: 'سم_ة' },
    { image: '🔑', word: 'مفتاح', missing: 'مفتا_' },
    { image: '🐘', word: 'فيل', missing: '_يل' },
];

const ALL_LETTERS = ['ح', 'ك', 'ح', 'ف', 'ب', 'ق', 'ن', 'ع', 'ل'];

const FillMissingLetter: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentItem, setCurrentItem] = useState(WORDS[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const correctItem = WORDS[Math.floor(Math.random() * WORDS.length)];
        setCurrentItem(correctItem);
        
        const correctLetter = correctItem.word.split('').find(l => !correctItem.missing.includes(l)) || '';

        const wrongOptions = ALL_LETTERS.filter(l => l !== correctLetter);
        const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        
        setOptions([correctLetter, ...shuffledWrong].sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleOptionClick = (selectedLetter: string) => {
        if (feedback) return;
        const correctLetter = currentItem.word.split('').find(l => !currentItem.missing.includes(l)) || '';

        if (selectedLetter === correctLetter) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-lime-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-lime-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <h2 className="text-3xl font-bold text-gray-700 mb-4">اختر الحرف الصحيح لإكمال الكلمة:</h2>
            <div className="text-9xl mb-4">{currentItem.image}</div>
            <div className="bg-gray-100 p-4 rounded-lg text-6xl font-bold tracking-[0.2em] mb-8">{currentItem.missing}</div>

            <div className="flex justify-center gap-4">
                {options.map(option => (
                    <button key={option} onClick={() => handleOptionClick(option)} className="bg-lime-500 text-white font-bold text-5xl w-24 h-24 rounded-2xl flex justify-center items-center hover:bg-lime-600">
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

export default FillMissingLetter;
