import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const INSTRUMENTS = [
    { name: 'جيتار', image: '🎸', options: ['جيتار', 'بيانو', 'طبل'] },
    { name: 'بيانو', image: '🎹', options: ['كمان', 'بيانو', 'ساكسفون'] },
    { name: 'طبل', image: '🥁', options: ['بوق', 'جيتار', 'طبل'] },
    { name: 'كمان', image: '🎻', options: ['كمان', 'طبل', 'بيانو'] },
];

const MusicalInstruments: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentInstrument, setCurrentInstrument] = useState(INSTRUMENTS[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const newInstrument = INSTRUMENTS[Math.floor(Math.random() * INSTRUMENTS.length)];
        newInstrument.options.sort(() => Math.random() - 0.5);
        setCurrentInstrument(newInstrument);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleAnswer = (option: string) => {
        if (feedback) return;
        if (option === currentInstrument.name) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-pink-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-pink-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-pink-50 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">ما اسم هذه الآلة الموسيقية؟</h2>
                <div className="text-9xl mb-8">{currentInstrument.image}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentInstrument.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-pink-500 text-white font-bold text-3xl p-6 rounded-2xl hover:bg-pink-600">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 نغمة صحيحة! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة. 😞</p>}
                </div>
            )}
        </div>
    );
};

export default MusicalInstruments;
