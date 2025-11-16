import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ALPHABET_DATA = [
    { letter: 'أ', word: 'أسد', image: '🦁' },
    { letter: 'ب', word: 'بطة', image: '🦆' },
    { letter: 'ت', word: 'تفاحة', image: '🍎' },
    { letter: 'ث', word: 'ثعلب', image: '🦊' },
    { letter: 'ج', word: 'جمل', image: '🐫' },
];

const AlphabetLearning: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentItem, setCurrentItem] = useState(ALPHABET_DATA[0]);
    const [options, setOptions] = useState<typeof ALPHABET_DATA[0][]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const correctItem = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
        setCurrentItem(correctItem);

        const wrongOptions = ALPHABET_DATA.filter(item => item.letter !== correctItem.letter);
        const shuffledWrong = shuffleArray(wrongOptions).slice(0, 2);
        
        setOptions(shuffleArray([correctItem, ...shuffledWrong]));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleOptionClick = (selectedItem: typeof ALPHABET_DATA[0]) => {
        if (feedback) return;
        if (selectedItem.letter === currentItem.letter) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-200">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-blue-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-700">أي صورة تبدأ بحرف؟</h2>
                <p className="text-9xl font-extrabold text-blue-600 animate-pulse">{currentItem.letter}</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {options.map(option => (
                    <button key={option.letter} onClick={() => handleOptionClick(option)} className="bg-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
                        <span className="text-8xl">{option.image}</span>
                        <span className="text-2xl font-bold mt-2">{option.word}</span>
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

export default AlphabetLearning;
