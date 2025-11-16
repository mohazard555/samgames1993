import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const NumberSequence: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [sequence, setSequence] = useState<number[]>([]);
    const [answer, setAnswer] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const start = Math.floor(Math.random() * 10);
        const step = Math.floor(Math.random() * 3) + 1;
        const newSequence = [start, start + step, start + 2 * step];
        const correctAnswer = start + 3 * step;

        setSequence(newSequence);
        setAnswer(correctAnswer);

        const opts = new Set([correctAnswer]);
        while (opts.size < 3) {
            opts.add(correctAnswer + (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1));
        }
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleGuess = (guess: number) => {
        if (feedback) return;
        if (guess === answer) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <div className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-700 mb-8">ما هو الرقم التالي في السلسلة؟</h2>
            <div className="flex justify-center items-center gap-6 p-4 bg-green-50 rounded-lg mb-8">
                {sequence.map((num, i) => (
                    <div key={i} className="text-6xl font-bold text-green-700">{num}</div>
                ))}
                <div className="text-6xl font-bold text-green-700">؟</div>
            </div>
            <div className="flex justify-center items-center gap-6">
                {options.map(opt => (
                    <button key={opt} onClick={() => handleGuess(opt)} className="bg-green-500 text-white font-bold text-5xl w-32 h-32 rounded-2xl flex justify-center items-center hover:bg-green-600">
                        {opt}
                    </button>
                ))}
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 حاول مرة أخرى! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default NumberSequence;
