import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const HEADS = ['👽', '🤖', '🎃', '🤡', '👻'];
const BODIES = ['👕', '👘', '🧥', '🎽', '🥋'];
const LEGS = ['🦵', '👖', '🩳', '👢', '👣'];

const FunnyMonsterMaker: React.FC<GameProps> = ({ gameName }) => {
    const [headIndex, setHeadIndex] = useState(0);
    const [bodyIndex, setBodyIndex] = useState(0);
    const [legsIndex, setLegsIndex] = useState(0);
    
    const nextPart = (part: 'head' | 'body' | 'legs') => {
        if(part === 'head') setHeadIndex(i => (i + 1) % HEADS.length);
        if(part === 'body') setBodyIndex(i => (i + 1) % BODIES.length);
        if(part === 'legs') setLegsIndex(i => (i + 1) % LEGS.length);
    }
    
    const randomize = () => {
        setHeadIndex(Math.floor(Math.random() * HEADS.length));
        setBodyIndex(Math.floor(Math.random() * BODIES.length));
        setLegsIndex(Math.floor(Math.random() * LEGS.length));
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-purple-800">{gameName}</h1>
                <button onClick={randomize} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">عشوائي</button>
            </div>
            <p className="text-xl text-gray-700 mb-6">اجمع الأجزاء لصنع وحشك المضحك!</p>
            
            <div className="flex justify-center items-center gap-8">
                {/* Controls */}
                <div className="flex flex-col gap-4">
                    <button onClick={() => nextPart('head')} className="bg-purple-200 text-4xl p-4 rounded-full">⬆️</button>
                    <button onClick={() => nextPart('body')} className="bg-purple-200 text-4xl p-4 rounded-full">⬆️</button>
                    <button onClick={() => nextPart('legs')} className="bg-purple-200 text-4xl p-4 rounded-full">⬆️</button>
                </div>

                {/* Monster Display */}
                <div className="w-64 h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-around">
                    <div className="text-8xl">{HEADS[headIndex]}</div>
                    <div className="text-8xl">{BODIES[bodyIndex]}</div>
                    <div className="text-8xl">{LEGS[legsIndex]}</div>
                </div>
            </div>
        </div>
    );
};

export default FunnyMonsterMaker;