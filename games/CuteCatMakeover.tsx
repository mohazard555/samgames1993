import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const CuteCatMakeover: React.FC<GameProps> = ({ gameName }) => {
    const [isClean, setIsClean] = useState(false);
    const [hasBow, setHasBow] = useState(false);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <button onClick={() => { setIsClean(false); setHasBow(false); }} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p>اعتني بالقطة اللطيفة!</p>
            <div className="flex justify-center items-center gap-8 mt-4">
                <div className="flex flex-col gap-4">
                    <button onClick={() => setIsClean(true)} className="text-5xl p-4 bg-blue-200 rounded-lg">🧼</button>
                    <button onClick={() => setHasBow(true)} className="text-5xl p-4 bg-pink-200 rounded-lg">🎀</button>
                </div>
                <div className="relative text-9xl">
                    {isClean ? '🐱' : '😿'}
                    {hasBow && <div className="absolute -top-4 right-0 text-5xl">🎀</div>}
                    {!isClean && <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-50">💩</div>}
                </div>
            </div>
        </div>
    );
};

export default CuteCatMakeover;
