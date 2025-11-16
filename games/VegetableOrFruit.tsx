import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ITEMS = [
    { name: 'تفاحة', emoji: '🍎', type: 'فاكهة' },
    { name: 'بروكلي', emoji: '🥦', type: 'خضار' },
    { name: 'موز', emoji: '🍌', type: 'فاكهة' },
    { name: 'جزر', emoji: '🥕', type: 'خضار' },
    { name: 'فراولة', emoji: '🍓', type: 'فاكهة' },
    { name: 'طماطم', emoji: '🍅', type: 'خضار' },
];

const VegetableOrFruit: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentItem, setCurrentItem] = useState(ITEMS[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        setCurrentItem(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleGuess = (guess: 'فاكهة' | 'خضار') => {
        if (feedback) return;
        if (guess === currentItem.type) {
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

            <h2 className="text-3xl font-bold text-gray-700 mb-4">هل هذا فاكهة أم خضار؟</h2>
            <div className="text-9xl mb-8">{currentItem.emoji}</div>

            <div className="flex justify-center items-center gap-6">
                <button onClick={() => handleGuess('فاكهة')} className="bg-red-500 text-white font-bold text-4xl py-6 px-10 rounded-2xl hover:bg-red-600">فاكهة</button>
                <button onClick={() => handleGuess('خضار')} className="bg-green-600 text-white font-bold text-4xl py-6 px-10 rounded-2xl hover:bg-green-700">خضار</button>
            </div>

            {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة غير صحيحة. 😞</p>}
                </div>
            )}
        </div>
    );
};

export default VegetableOrFruit;
