import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const FLAGS = [
    { country: 'اليابان', flag: '🇯🇵', options: ['اليابان', 'الصين', 'كوريا'] },
    { country: 'كندا', flag: '🇨🇦', options: ['أمريكا', 'كندا', 'المكسيك'] },
    { country: 'إيطاليا', flag: '🇮🇹', options: ['فرنسا', 'إيطاليا', 'ألمانيا'] },
    { country: 'البرازيل', flag: '🇧🇷', options: ['البرازيل', 'الأرجنتين', 'البرتغال'] },
];

const WorldFlags: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentFlag, setCurrentFlag] = useState(FLAGS[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const newFlag = FLAGS[Math.floor(Math.random() * FLAGS.length)];
        newFlag.options.sort(() => Math.random() - 0.5);
        setCurrentFlag(newFlag);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleAnswer = (option: string) => {
        if (feedback) return;
        if (option === currentFlag.country) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-500">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-blue-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-blue-50 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">علم أي دولة هذا؟</h2>
                <div className="text-9xl mb-8 border-2 border-gray-400 inline-block p-2 bg-white">{currentFlag.flag}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentFlag.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-blue-600 text-white font-bold text-3xl p-6 rounded-2xl hover:bg-blue-700">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة. 😞</p>}
                </div>
            )}
        </div>
    );
};

export default WorldFlags;
