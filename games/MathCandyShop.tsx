import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const MathCandyShop: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState({ num1: 0, num2: 0, answer: 0 });
    const [options, setOptions] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const num1 = Math.floor(Math.random() * 5) + 1;
        const num2 = Math.floor(Math.random() * 5) + 1;
        const answer = num1 + num2;
        setProblem({ num1, num2, answer });

        const opts = new Set<number>([answer]);
        while(opts.size < 3) {
            const wrongAnswer = Math.floor(Math.random() * 10) + 1;
            opts.add(wrongAnswer);
        }
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleAnswer = (guess: number) => {
        if (feedback) return;
        if (guess === problem.answer) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-pink-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-pink-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <h2 className="text-3xl font-bold text-gray-700 mb-6">الزبون يريد {problem.num1} + {problem.num2} قطعة حلوى!</h2>
            <div className="text-8xl mb-6">👨‍👩‍👧</div>

            <div className="flex justify-center gap-4">
                {options.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)} className="bg-pink-400 text-white font-bold text-5xl w-32 h-32 rounded-full flex items-center justify-center hover:bg-pink-500">
                        {opt} 🍬
                    </button>
                ))}
            </div>

            {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! زبون سعيد! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 هذا ليس العدد الصحيح! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default MathCandyShop;