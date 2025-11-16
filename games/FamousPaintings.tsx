import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const PAINTINGS = [
    { name: "الموناليزا", artist: "ليوناردو دافنشي", image: 'https://img.icons8.com/fluency/200/mona-lisa.png', options: ["فان جوخ", "ليوناردو دافنشي", "بيكاسو"] },
    { name: "ليلة النجوم", artist: "فان جوخ", image: 'https://img.icons8.com/fluency/200/starry-night.png', options: ["فان جوخ", "دافنشي", "مونيه"] },
    { name: "الصرخة", artist: "إدفارد مونك", image: 'https://img.icons8.com/fluency/200/the-scream.png', options: ["رامبرانت", "مونيه", "إدفارد مونك"] },
];

const FamousPaintings: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentPainting, setCurrentPainting] = useState(PAINTINGS[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const newPainting = PAINTINGS[Math.floor(Math.random() * PAINTINGS.length)];
        newPainting.options.sort(() => Math.random() - 0.5);
        setCurrentPainting(newPainting);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleAnswer = (option: string) => {
        if (feedback) return;
        if (option === currentPainting.artist) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-amber-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-amber-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="bg-amber-50 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">من هو الفنان الذي رسم هذه اللوحة؟</h2>
                <img src={currentPainting.image} alt={currentPainting.name} className="w-48 h-48 mx-auto mb-4 object-contain" />
                <h3 className="text-4xl font-bold text-gray-800 mb-8">{currentPainting.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentPainting.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-amber-500 text-white font-bold text-2xl p-6 rounded-2xl hover:bg-amber-600">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
             {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! أنت فنان حقيقي! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 إجابة خاطئة. 😞</p>}
                </div>
            )}
        </div>
    );
};

export default FamousPaintings;