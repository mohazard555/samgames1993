import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const GentlePrincessDay: React.FC<GameProps> = ({ gameName }) => {
    const [stage, setStage] = useState(0);
    const stages = ["استيقظي يا أميرة!", "اختاري فطورك.", "اختاري فستانك.", "يوم رائع!"];

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <button onClick={() => setStage(0)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <div className="h-64 flex flex-col justify-center items-center">
                <p className="text-3xl mb-4">{stages[stage]}</p>
                <div className="text-8xl mb-4">
                    {stage === 0 && '😴'}
                    {stage === 1 && '🥞'}
                    {stage === 2 && '👗'}
                    {stage === 3 && '👑'}
                </div>
                {stage < stages.length - 1 && (
                    <button onClick={() => setStage(s => s + 1)} className="bg-pink-400 text-white font-bold py-2 px-6 rounded-lg">
                        التالي
                    </button>
                )}
            </div>
        </div>
    );
};

export default GentlePrincessDay;
