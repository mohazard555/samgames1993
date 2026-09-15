import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { playSuccessSound, playErrorSound } from '../utils/soundEffects';

interface GameProps { gameName: string; }

const QUESTIONS = [
    { question: "ما هو لون الموز؟", image: '🍌', options: ['أحمر', 'أصفر', 'أزرق'], answer: 'أصفر' },
    { question: "أي حيوان يقول 'مواء'؟", image: '🐈', options: ['كلب', 'قطة', 'بقرة'], answer: 'قطة' },
    { question: "أين تسبح السمكة؟", image: '🐠', options: ['في السماء', 'في الماء', 'على الشجرة'], answer: 'في الماء' },
    { question: "ماذا نستخدم لنرى في الليل؟", image: '🌙', options: ['الشمس', 'القمر', 'قوس قزح'], answer: 'القمر' },
];

const SimpleQuiz: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [qIndex, setQIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const currentQuestion = QUESTIONS[qIndex];

    const handleAnswer = (option: string) => {
        if (feedback) return;
        if (option === currentQuestion.answer) {
            setScore(s => s + 10);
            setFeedback('correct');
            playSuccessSound();
        } else {
            setFeedback('incorrect');
            playErrorSound();
        }
        setTimeout(() => {
            setFeedback(null);
            setQIndex(i => (i + 1) % QUESTIONS.length);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-cyan-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-cyan-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <div className="bg-cyan-50 p-8 rounded-2xl">
                <div className="text-8xl mb-4">{currentQuestion.image}</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentQuestion.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-cyan-500 text-white font-bold text-2xl p-6 rounded-2xl hover:bg-cyan-600">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 أحسنت! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default SimpleQuiz;
