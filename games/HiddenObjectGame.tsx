import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const OBJECTS_TO_FIND = [
    { id: 'ball', name: 'كرة', emoji: '⚽', pos: { top: '70%', left: '80%' } },
    { id: 'book', name: 'كتاب', emoji: '📚', pos: { top: '55%', left: '15%' } },
    { id: 'car', name: 'سيارة', emoji: '🚗', pos: { top: '75%', left: '10%' } },
    { id: 'sock', name: 'جورب', emoji: '🧦', pos: { top: '40%', left: '45%' } },
];

const HiddenObjectGame: React.FC<GameProps> = ({ gameName }) => {
    const [found, setFound] = useState<string[]>([]);
    const isWon = found.length === OBJECTS_TO_FIND.length;
    
    const findObject = (id: string) => {
        if (!found.includes(id)) {
            setFound(f => [...f, id]);
        }
    }
    
    const resetGame = () => setFound([]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-teal-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-teal-800">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p className="text-xl text-gray-700 mb-4">ابحث عن الأشياء التالية في الغرفة:</p>

            <div className="flex justify-center gap-4 mb-4">
                {OBJECTS_TO_FIND.map(obj => (
                    <div key={obj.id} className={`p-2 rounded-lg text-4xl ${found.includes(obj.id) ? 'bg-green-300' : 'bg-gray-200'}`}>
                        {obj.emoji}
                    </div>
                ))}
            </div>

            <div className="relative w-full max-w-2xl mx-auto aspect-video bg-blue-100 rounded-lg border-4 border-teal-500">
                {/* Background items */}
                <div className="absolute text-9xl top-1/2 left-1/4 -translate-y-1/2">🛌</div>
                <div className="absolute text-7xl top-1/2 left-10 -translate-y-1/2">🧸</div>
                <div className="absolute text-8xl top-1/4 left-3/4">🖼️</div>
                {/* Clickable Items */}
                {OBJECTS_TO_FIND.map(obj => (
                    <button key={obj.id} onClick={() => findObject(obj.id)} className="absolute text-5xl" style={obj.pos}>
                        {obj.emoji}
                    </button>
                ))}
            </div>

            {isWon && <h2 className="mt-4 text-3xl font-bold text-green-600 animate-pulse">🎉 رائع! لقد وجدت كل شيء! 🎉</h2>}
        </div>
    );
};

export default HiddenObjectGame;