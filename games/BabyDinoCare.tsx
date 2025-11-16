import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const MAX_STAT = 100;

const BabyDinoCare: React.FC<GameProps> = ({ gameName }) => {
    const [happiness, setHappiness] = useState(MAX_STAT);
    const [hunger, setHunger] = useState(MAX_STAT);
    const [cleanliness, setCleanliness] = useState(MAX_STAT);
    const [dinoEmotion, setDinoEmotion] = useState('😊');

    useEffect(() => {
        const interval = setInterval(() => {
            setHappiness(h => Math.max(0, h - 2));
            setHunger(h => Math.max(0, h - 3));
            setCleanliness(c => Math.max(0, c - 1));
        }, 1200);
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if (hunger < 30) setDinoEmotion('😢');
        else if (cleanliness < 40) setDinoEmotion('🤢');
        else if (happiness < 30) setDinoEmotion('😞');
        else if (happiness > 80 && hunger > 80) setDinoEmotion('😍');
        else setDinoEmotion('😊');
    }, [happiness, hunger, cleanliness]);
    
    const feed = () => setHunger(h => Math.min(MAX_STAT, h + 30));
    const play = () => setHappiness(h => Math.min(MAX_STAT, h + 25));
    const clean = () => setCleanliness(c => Math.min(MAX_STAT, c + 40));

    const isGameOver = happiness <= 0 || hunger <= 0 || cleanliness <= 0;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>

            <div className="flex flex-col items-center">
                 <div className="text-9xl mb-4 transition-transform transform hover:scale-110">{isGameOver ? '😭' : `🦖${dinoEmotion}`}</div>
                 
                 {isGameOver ? (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-red-600">أوه لا! الديناصور الصغير ليس سعيدًا.</h2>
                        <button onClick={() => { setHappiness(MAX_STAT); setHunger(MAX_STAT); setCleanliness(MAX_STAT); }} className="mt-4 bg-green-500 text-white font-bold py-2 px-6 rounded-full">العب مرة أخرى</button>
                    </div>
                 ) : (
                    <>
                        <div className="w-full max-w-sm space-y-3 mb-6">
                            <div>
                                <label className="font-bold">السعادة 😄</label>
                                <div className="w-full bg-gray-200 rounded-full h-6"><div className="bg-yellow-400 h-6 rounded-full" style={{width: `${happiness}%`}}></div></div>
                            </div>
                            <div>
                                <label className="font-bold">الشبع 🍗</label>
                                <div className="w-full bg-gray-200 rounded-full h-6"><div className="bg-red-500 h-6 rounded-full" style={{width: `${hunger}%`}}></div></div>
                            </div>
                             <div>
                                <label className="font-bold">النظافة 🧼</label>
                                <div className="w-full bg-gray-200 rounded-full h-6"><div className="bg-blue-400 h-6 rounded-full" style={{width: `${cleanliness}%`}}></div></div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={feed} className="bg-red-500 text-white font-bold py-3 px-6 rounded-full text-xl hover:bg-red-600">إطعام</button>
                            <button onClick={play} className="bg-yellow-400 text-white font-bold py-3 px-6 rounded-full text-xl hover:bg-yellow-500">لعب</button>
                            <button onClick={clean} className="bg-blue-400 text-white font-bold py-3 px-6 rounded-full text-xl hover:bg-blue-500">تنظيف</button>
                        </div>
                    </>
                 )}
            </div>
        </div>
    );
};

export default BabyDinoCare;