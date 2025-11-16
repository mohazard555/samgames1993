import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const SimpleNumbersChallenge: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState('');
    const [answer, setAnswer] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateProblem = useCallback(() => {
        setFeedback(null);
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const isAddition = Math.random() > 0.5;

        if (isAddition) {
            setProblem(`${num1} + ${num2}`);
            const correctAnswer = num1 + num2;
            setAnswer(correctAnswer);
            generateOptions(correctAnswer);
        } else {
            // Ensure result is not negative
            const bigger = Math.max(num1, num2);
            const smaller = Math.min(num1, num2);
            setProblem(`${bigger} - ${smaller}`);
            const correctAnswer = bigger - smaller;
            setAnswer(correctAnswer);
            generateOptions(correctAnswer);
        }
    }, []);
    
    const generateOptions = (correctAnswer: number) => {
        const opts = new Set<number>();
        opts.add(correctAnswer);
        while(opts.size < 4) {
            const wrongAnswer = correctAnswer + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
            if (wrongAnswer >= 0) opts.add(wrongAnswer);
        }
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    }

    useEffect(() => {
        generateProblem();
    }, [generateProblem]);

    const handleAnswerClick = (selectedAnswer: number) => {
        if(feedback) return;
        if (selectedAnswer === answer) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateProblem, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-blue-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="my-8">
                <div className="bg-blue-100 p-8 rounded-full w-64 h-64 mx-auto flex items-center justify-center">
                    <p className="text-6xl font-bold text-blue-900">{problem} = ?</p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswerClick(opt)} className="bg-blue-500 text-white font-bold text-4xl p-8 rounded-2xl hover:bg-blue-600 transition-transform transform hover:scale-105">
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

export default SimpleNumbersChallenge;
