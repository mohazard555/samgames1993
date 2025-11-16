import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const QUESTIONS = [
    { question: "في أي قارة تقع مصر؟", answer: 'أفريقيا', options: ['آسيا', 'أفريقيا', 'أوروبا'] },
    { question: "في أي قارة تقع البرازيل؟", answer: 'أمريكا الجنوبية', options: ['أمريكا الشمالية', 'أستراليا', 'أمريكا الجنوبية'] },
    { question: "في أي قارة تقع اليابان؟", answer: 'آسيا', options: ['آسيا', 'أفريقيا', 'أوروبا'] },
    { question: "في أي قارة يقع الكنغر؟", answer: 'أستراليا', options: ['أمريكا الجنوبية', 'أستراليا', 'آسيا'] },
];

const ContinentsQuiz: React.FC<GameProps> = ({ gameName }) => {
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
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <div className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-green-50 p-8 rounded-2xl min-h-[300px]">
                <h2 className="text-4xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentQuestion.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-green-500 text-white font-bold text-2xl p-6 rounded-2xl hover:bg-green-600">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! أنت رائع في الجغرافيا! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة. 😞</p>}
                </div>
            )}
        </div>
    );
};

export default ContinentsQuiz;
