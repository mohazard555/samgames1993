import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const MAX_STAT = 100;

const CaringForLittleCat: React.FC<GameProps> = ({ gameName }) => {
    const [happiness, setHappiness] = useState(MAX_STAT);
    const [hunger, setHunger] = useState(MAX_STAT);
    const [catEmotion, setCatEmotion] = useState('😊');

    useEffect(() => {
        const interval = setInterval(() => {
            setHappiness(h => Math.max(0, h - 2));
            setHunger(h => Math.max(0, h - 3));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if(happiness < 30 || hunger < 30) setCatEmotion('😢');
        else if (happiness > 80 && hunger > 80) setCatEmotion('😍');
        else setCatEmotion('😊');
    }, [happiness, hunger]);
    
    const feed = () => setHunger(h => Math.min(MAX_STAT, h + 25));
    const play = () => setHappiness(h => Math.min(MAX_STAT, h + 20));

    const isGameOver = happiness <= 0 || hunger <= 0;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-teal-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-teal-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>

            <div className="flex flex-col items-center">
                 <div className="text-9xl mb-4 transition-transform transform hover:scale-110">{isGameOver ? '😭' : catEmotion}</div>
                 
                 {isGameOver ? (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-red-600">أوه لا! القطة حزينة جدا.</h2>
                        <button onClick={() => { setHappiness(MAX_STAT); setHunger(MAX_STAT); }} className="mt-4 bg-teal-500 text-white font-bold py-2 px-6 rounded-full">العب مرة أخرى</button>
                    </div>
                 ) : (
                    <>
                        {/* Stats */}
                        <div className="w-full max-w-sm space-y-3 mb-6">
                            <div>
                                <label className="font-bold">السعادة 😄</label>
                                <div className="w-full bg-gray-200 rounded-full h-6"><div className="bg-yellow-400 h-6 rounded-full" style={{width: `${happiness}%`}}></div></div>
                            </div>
                            <div>
                                <label className="font-bold">الشبع 🍗</label>
                                <div className="w-full bg-gray-200 rounded-full h-6"><div className="bg-green-500 h-6 rounded-full" style={{width: `${hunger}%`}}></div></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button onClick={feed} className="bg-green-500 text-white font-bold py-4 px-8 rounded-full text-2xl hover:bg-green-600">إطعام</button>
                            <button onClick={play} className="bg-yellow-400 text-white font-bold py-4 px-8 rounded-full text-2xl hover:bg-yellow-500">لعب</button>
                        </div>
                    </>
                 )}
            </div>
        </div>
    );
};

export default CaringForLittleCat;
