import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const CountTheDots: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [dotCount, setDotCount] = useState(5);
    const [options, setOptions] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const newCount = Math.floor(Math.random() * 8) + 3; // 3 to 10 dots
        setDotCount(newCount);

        const opts = new Set([newCount]);
        while(opts.size < 4) {
            opts.add(Math.floor(Math.random() * 8) + 3);
        }
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const dotPositions = useMemo(() => {
        return Array.from({ length: dotCount }, () => ({
            top: `${Math.random() * 60 + 20}%`,
            left: `${Math.random() * 60 + 20}%`,
        }));
    }, [dotCount]);

    const handleOptionClick = (option: number) => {
        if (feedback) return;
        if (option === dotCount) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-red-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-red-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-700 mb-6">كم عدد النقاط على الدعسوقة؟</h2>

            <div className="relative w-64 h-64 mx-auto mb-8">
                <div className="w-full h-full text-red-600">
                    <svg viewBox="0 0 100 100" fill="currentColor">
                        <circle cx="50" cy="50" r="48" />
                        <path d="M 50 10 L 50 90" stroke="black" strokeWidth="2" />
                    </svg>
                </div>
                {dotPositions.map((pos, i) => (
                    <div key={i} className="absolute w-4 h-4 bg-black rounded-full" style={pos} />
                ))}
            </div>

            <div className="flex justify-center gap-4">
                {options.map(opt => (
                    <button key={opt} onClick={() => handleOptionClick(opt)} className="bg-red-500 text-white font-bold text-4xl w-20 h-20 rounded-full flex items-center justify-center">
                        {opt}
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

export default CountTheDots;
