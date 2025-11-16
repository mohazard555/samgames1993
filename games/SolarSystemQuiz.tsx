import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const QUESTIONS = [
    { question: "أي كوكب يُعرف بالكوكب الأحمر؟", answer: 'المريخ', image: '🪐', options: ['الأرض', 'المريخ', 'زحل'] },
    { question: "ما هو أكبر كوكب في مجموعتنا الشمسية؟", answer: 'المشتري', image: '🌏', options: ['المشتري', 'الشمس', 'القمر'] },
    { question: "أي كوكب له حلقات جميلة حوله؟", answer: 'زحل', image: '🛰️', options: ['عطارد', 'زحل', 'نبتون'] },
    { question: "ما هو الكوكب الذي نعيش عليه؟", answer: 'الأرض', image: '👨‍🚀', options: ['الزهرة', 'المريخ', 'الأرض'] },
];

const SolarSystemQuiz: React.FC<GameProps> = ({ gameName }) => {
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
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-indigo-500">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-indigo-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-indigo-100 p-8 rounded-2xl">
                <div className="text-8xl mb-4">{currentQuestion.image}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentQuestion.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-indigo-500 text-white font-bold text-2xl p-6 rounded-2xl hover:bg-indigo-600">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! أنت عالم فضاء! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default SolarSystemQuiz;
