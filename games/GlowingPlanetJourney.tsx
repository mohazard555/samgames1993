import React from 'react';
import { Link } from 'react-router-dom';
import PlaceholderGame from './PlaceholderGame';

// A full platformer is too complex for this format.
// This will be a placeholder that explains the concept.

const GlowingPlanetJourney: React.FC<{gameName: string}> = ({ gameName }) => {
    return (
         <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                    → العودة
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-purple-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>
            <div className="flex flex-col items-center justify-center h-80">
                <p className="text-2xl text-gray-700 mb-6">مرحباً في رحلة الكوكب المضيء!</p>
                <div className="text-8xl animate-bounce">🚀</div>
                <p className="text-lg text-gray-500 mt-6">
                    اقفز بين المنصات واجمع النجوم في هذه المغامرة الفضائية.
                    <br/>
                    (هذه اللعبة قيد التطوير حالياً)
                </p>
            </div>
        </div>
    );
};

export default GlowingPlanetJourney;
