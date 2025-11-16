import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const PAIRS = [
    { singular: 'كتاب', plural: 'كتب' },
    { singular: 'قلم', plural: 'أقلام' },
    { singular: 'ولد', plural: 'أولاد' },
    { singular: 'شجرة', plural: 'أشجار' },
    { singular: 'باب', plural: 'أبواب' },
];

const ALL_WORDS = PAIRS.flatMap(p => [p.singular, p.plural]);

const SingularPlural: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
        const askForPlural = Math.random() > 0.5;

        setQuestion(askForPlural ? `ما هو جمع كلمة "${pair.singular}"؟` : `ما هو مفرد كلمة "${pair.plural}"؟`);
        setAnswer(askForPlural ? pair.plural : pair.singular);

        const wrongOptions = ALL_WORDS.filter(w => w !== pair.singular && w !== pair.plural);
        const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        
        setOptions([askForPlural ? pair.plural : pair.singular, ...shuffledWrong].sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleOptionClick = (selectedWord: string) => {
        if (feedback) return;
        if (selectedWord === answer) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-purple-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <h2 className="text-4xl font-bold text-gray-700 mb-8">{question}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => (
                    <button key={option} onClick={() => handleOptionClick(option)} className="bg-purple-500 text-white font-bold text-4xl p-6 rounded-2xl hover:bg-purple-600 transition-transform transform hover:scale-105">
                        {option}
                    </button>
                ))}
            </div>
            
            {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 ممتاز! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة غير صحيحة. 😞</p>}
                </div>
            )}
        </div>
    );
};

export default SingularPlural;