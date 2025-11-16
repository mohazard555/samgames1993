import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ClockPuzzle: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const { hour, minute, timeString, options } = useMemo(() => {
        const h = Math.floor(Math.random() * 12) + 1;
        const m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        const tStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        
        const opts = new Set([tStr]);
        while (opts.size < 3) {
            const wrongH = Math.floor(Math.random() * 12) + 1;
            const wrongM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
            opts.add(`${wrongH.toString().padStart(2, '0')}:${wrongM.toString().padStart(2, '0')}`);
        }

        return {
            hour: h,
            minute: m,
            timeString: tStr,
            options: Array.from(opts).sort(() => Math.random() - 0.5),
        };
    }, [feedback]); // Reroll on new round

    const handleOptionClick = (option: string) => {
        if (feedback) return;
        if (option === timeString) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(() => setFeedback(null), 1500); // This will trigger a re-render and useMemo will generate a new puzzle
    };
    
    const hourAngle = (hour % 12 + minute / 60) * 30;
    const minuteAngle = minute * 6;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-sky-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-sky-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-700 mb-6">ما هو الوقت الذي تشير إليه الساعة؟</h2>
            
            <div className="w-64 h-64 bg-white border-8 border-gray-700 rounded-full mx-auto relative mb-8">
                <div className="absolute w-2 h-16 bg-black top-1/2 left-1/2 -translate-x-1/2 origin-top" style={{ transform: `rotate(${minuteAngle}deg) translateX(-50%)` }} />
                <div className="absolute w-2 h-12 bg-black top-1/2 left-1/2 -translate-x-1/2 origin-top" style={{ transform: `rotate(${hourAngle}deg) translateX(-50%)` }}/>
                <div className="absolute w-4 h-4 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="flex justify-center gap-4">
                {options.map(opt => (
                    <button key={opt} onClick={() => handleOptionClick(opt)} className="bg-sky-500 text-white font-bold text-3xl p-4 rounded-lg hover:bg-sky-600">
                        {opt}
                    </button>
                ))}
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

export default ClockPuzzle;
