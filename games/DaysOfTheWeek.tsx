import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const DaysOfTheWeek: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const dayIndex = Math.floor(Math.random() * DAYS.length);
        const today = DAYS[dayIndex];
        const tomorrow = DAYS[(dayIndex + 1) % 7];
        
        setQuestion(`ما هو اليوم الذي يأتي بعد يوم ${today}؟`);
        setAnswer(tomorrow);

        const wrongOptions = DAYS.filter(d => d !== today && d !== tomorrow);
        const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        
        setOptions([tomorrow, ...shuffledWrong].sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleAnswer = (option: string) => {
        if (feedback) return;
        if (option === answer) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-purple-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-purple-50 p-8 rounded-2xl min-h-[300px]">
                <h2 className="text-4xl font-bold text-gray-800 mb-8">{question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-purple-500 text-white font-bold text-3xl p-6 rounded-2xl hover:bg-purple-600">
                            {opt}
                        </button>
                    ))}
                </div>
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

export default DaysOfTheWeek;
