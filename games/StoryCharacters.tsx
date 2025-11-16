import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const QUESTIONS = [
    { question: "من هي الفتاة التي ارتدت حذاء زجاجياً؟", answer: 'سندريلا', image: '👠', options: ['سندريلا', 'بياض الثلج', 'ليلى'] },
    { question: "من هو الولد الذي لا يريد أن يكبر؟", answer: 'بيتر بان', image: '🧚', options: ['علاء الدين', 'بيتر بان', 'بينوكيو'] },
    { question: "من هي الفتاة التي تبعت الأرنب الأبيض؟", answer: 'أليس', image: '🐇', options: ['دوروثي', 'أليس', 'رابونزيل'] },
    { question: "من أكل التفاحة المسمومة ونام؟", answer: 'بياض الثلج', image: '🍎', options: ['الأميرة النائمة', 'بياض الثلج', 'الجميلة والوحش'] },
];

const StoryCharacters: React.FC<GameProps> = ({ gameName }) => {
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
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-pink-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-pink-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-pink-50 p-8 rounded-2xl">
                <div className="text-8xl mb-4">{currentQuestion.image}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentQuestion.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-pink-400 text-white font-bold text-2xl p-6 rounded-2xl hover:bg-pink-500">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 أحسنت! أنت تعرف كل القصص! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة. 😞</p>}
                </div>
            )}
        </div>
    );
};

export default StoryCharacters;
