import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const PAIRS = [
    { word: 'كبير', opposite: 'صغير' },
    { word: 'سريع', opposite: 'بطيء' },
    { word: 'حار', opposite: 'بارد' },
    { word: 'فوق', opposite: 'تحت' },
    { word: 'سعيد', opposite: 'حزين' },
];

const ALL_WORDS = PAIRS.flatMap(p => [p.word, p.opposite]);

const WordOpposites: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentPair, setCurrentPair] = useState(PAIRS[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const correctPair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
        setCurrentPair(correctPair);

        const wrongOptions = ALL_WORDS.filter(w => w !== correctPair.word && w !== correctPair.opposite);
        const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        
        setOptions([correctPair.opposite, ...shuffledWrong].sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleOptionClick = (selectedWord: string) => {
        if (feedback) return;
        if (selectedWord === currentPair.opposite) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-amber-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-amber-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <h2 className="text-3xl font-bold text-gray-700 mb-4">ما هو عكس كلمة؟</h2>
            <div className="text-7xl font-bold text-amber-600 mb-8">{currentPair.word}</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => (
                    <button key={option} onClick={() => handleOptionClick(option)} className="bg-amber-400 text-white font-bold text-4xl p-6 rounded-2xl hover:bg-amber-500 transition-transform transform hover:scale-105">
                        {option}
                    </button>
                ))}
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

export default WordOpposites;