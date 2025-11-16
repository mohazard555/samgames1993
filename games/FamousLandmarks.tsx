import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const LANDMARKS = [
    { name: "الأهرامات", country: "مصر", image: 'https://img.icons8.com/officel/160/great-pyramid-of-giza.png', options: ['مصر', 'فرنسا', 'الصين'] },
    { name: "برج إيفل", country: "فرنسا", image: 'https://img.icons8.com/officel/160/eiffel-tower.png', options: ['إيطاليا', 'فرنسا', 'أمريكا'] },
    { name: "سور الصين العظيم", country: "الصين", image: 'https://img.icons8.com/officel/160/great-wall.png', options: ['اليابان', 'الهند', 'الصين'] },
    { name: "برج بيزا المائل", country: "إيطاليا", image: 'https://img.icons8.com/officel/160/tower-of-pisa.png', options: ['إيطاليا', 'إسبانيا', 'اليونان'] },
];

const FamousLandmarks: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentLandmark, setCurrentLandmark] = useState(LANDMARKS[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const newLandmark = LANDMARKS[Math.floor(Math.random() * LANDMARKS.length)];
        // Shuffle options
        newLandmark.options.sort(() => Math.random() - 0.5);
        setCurrentLandmark(newLandmark);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleAnswer = (option: string) => {
        if (feedback) return;
        if (option === currentLandmark.country) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-amber-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-amber-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-amber-50 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">في أي بلد يقع هذا المعلم الشهير؟</h2>
                <img src={currentLandmark.image} alt={currentLandmark.name} className="w-40 h-40 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-8">{currentLandmark.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentLandmark.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-amber-500 text-white font-bold text-2xl p-6 rounded-2xl hover:bg-amber-600">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 أحسنت! معلومة رائعة! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة! البلد الصحيح هو {currentLandmark.country} 😞</p>}
                </div>
            )}
        </div>
    );
};

export default FamousLandmarks;
