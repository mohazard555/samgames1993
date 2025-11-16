import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const HATS = ['🎩', '🎓', '👑', '⛑️', '🧢'];
const SHIRTS = ['👕', '👘', '👚', '🎽', '🥋'];
const PANTS = ['👖', '🩳', '🩲'];

const BearDressUp: React.FC<GameProps> = ({ gameName }) => {
    const [hatIndex, setHatIndex] = useState(0);
    const [shirtIndex, setShirtIndex] = useState(0);
    const [pantsIndex, setPantsIndex] = useState(0);

    const nextItem = (category: 'hat' | 'shirt' | 'pants') => {
        if(category === 'hat') setHatIndex(i => (i + 1) % HATS.length);
        if(category === 'shirt') setShirtIndex(i => (i + 1) % SHIRTS.length);
        if(category === 'pants') setPantsIndex(i => (i + 1) % PANTS.length);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-rose-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-rose-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>
            <p className="text-xl text-gray-700 mb-6">اختر الملابس لتلبيس الدب!</p>
            
            <div className="flex justify-center items-center gap-8">
                {/* Bear Display */}
                <div className="relative w-64 h-80 flex flex-col items-center justify-center">
                    <div className="absolute text-8xl" style={{top: -20}}>{HATS[hatIndex]}</div>
                    <div className="absolute text-9xl">{SHIRTS[shirtIndex]}</div>
                    <div className="text-[12rem]">🐻</div>
                     <div className="absolute text-8xl" style={{bottom: 0}}>{PANTS[pantsIndex]}</div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4">
                    <button onClick={() => nextItem('hat')} className="bg-rose-200 text-2xl p-4 rounded-lg w-40">قبعة</button>
                    <button onClick={() => nextItem('shirt')} className="bg-rose-200 text-2xl p-4 rounded-lg w-40">قميص</button>
                    <button onClick={() => nextItem('pants')} className="bg-rose-200 text-2xl p-4 rounded-lg w-40">بنطال</button>
                </div>
            </div>
        </div>
    );
};

export default BearDressUp;