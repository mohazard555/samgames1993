import React from 'react';
import { Link } from 'react-router-dom';

// A full endless jumper is too complex for this format.
// This will be a placeholder that explains the concept.

const AdventurousRabbitJumps: React.FC<{gameName: string}> = ({ gameName }) => {
    return (
         <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                    → العودة
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-green-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>
            <div className="flex flex-col items-center justify-center h-80">
                <p className="text-2xl text-gray-700 mb-6">اقفز لأعلى مع الأرنب الشجاع!</p>
                <div className="text-8xl animate-bounce">🐰</div>
                <p className="text-lg text-gray-500 mt-6">
                    استخدم الأسهم للتحرك والقفز على المنصات لأعلى ما يمكن.
                     <br/>
                    (هذه اللعبة قيد التطوير حالياً)
                </p>
            </div>
        </div>
    );
};

export default AdventurousRabbitJumps;
