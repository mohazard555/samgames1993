import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const QUESTIONS = [
    { question: "ما هو هذا الجزء من الجسم؟", image: '👁️', answer: 'عين', options: ['عين', 'أذن', 'أنف'] },
    { question: "ما هو هذا الجزء من الجسم؟", image: '👂', answer: 'أذن', options: ['فم', 'أذن', 'يد'] },
    { question: "ما هو هذا الجزء من الجسم؟", image: '👃', answer: 'أنف', options: ['أنف', 'عين', 'فم'] },
    { question: "ما هو هذا الجزء من الجسم؟", image: '👄', answer: 'فم', options: ['يد', 'قدم', 'فم'] },
    { question: "ما هو هذا الجزء من الجسم؟", image: '🖐️', answer: 'يد', options: ['رأس', 'يد', 'رجل'] },
];

const BodyPartsQuiz: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const newQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        newQuestion.options.sort(() => Math.random() - 0.5);
        setCurrentQuestion(newQuestion);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleAnswer = (option: string) => {
        if (feedback) return;
        if (option === currentQuestion.answer) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-red-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-red-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-red-50 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentQuestion.question}</h2>
                <div className="text-9xl mb-8">{currentQuestion.image}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentQuestion.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-red-500 text-white font-bold text-3xl p-6 rounded-2xl hover:bg-red-600">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default BodyPartsQuiz;
