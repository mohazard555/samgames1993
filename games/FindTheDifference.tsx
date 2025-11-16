import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const DIFFERENCES = [
    { id: 1, x: 75, y: 15 }, // Sun color
    { id: 2, x: 30, y: 70 }, // Flower missing
    { id: 3, x: 60, y: 65 }, // Cat tail
];

const Scene: React.FC<{ isOriginal: boolean, onDifferenceClick: (id: number) => void, found: number[] }> = ({ isOriginal, onDifferenceClick, found }) => (
    <div className="relative w-[300px] h-[200px] bg-sky-300 border-2 border-gray-500">
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-1/3 bg-green-500" />
        {/* Sun */}
        <div className={`absolute w-12 h-12 rounded-full ${isOriginal ? 'bg-yellow-400' : 'bg-orange-500'}`} style={{ top: '10%', left: '70%' }} />
        {/* House */}
        <div className="absolute w-20 h-20 bg-red-600 bottom-[33%] left-[10%]" />
        <div className="absolute w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[40px] border-b-gray-800" style={{ bottom: 'calc(33% + 80px)', left: 'calc(10% + 0px)' }}/>
        {/* Flower */}
        {isOriginal && <div className="absolute text-3xl bottom-[30%] left-[30%]">🌷</div>}
        {/* Cat */}
        <div className="absolute text-4xl bottom-[25%] left-[60%]">🐱</div>
        {!isOriginal && <div className="absolute w-2 h-8 bg-gray-700 -rotate-45" style={{ bottom: 'calc(25% + 5px)', left: 'calc(60% + 30px)' }}/>}
        
        {/* Clickable areas for the second image */}
        {!isOriginal && DIFFERENCES.map(diff => (
            !found.includes(diff.id) &&
            <div key={diff.id} onClick={() => onDifferenceClick(diff.id)} className="absolute w-8 h-8 rounded-full border-2 border-transparent hover:border-red-500 cursor-pointer" style={{ top: `${diff.y}%`, left: `${diff.x}%` }} />
        ))}
        {/* Circles for found differences */}
        {found.map(id => {
            const diff = DIFFERENCES.find(d => d.id === id);
            if (!diff) return null;
            return <div key={id} className="absolute w-10 h-10 rounded-full border-4 border-red-500 pointer-events-none" style={{ top: `${diff.y}%`, left: `${diff.x}%`, transform: 'translate(-10%, -10%)' }} />;
        })}
    </div>
);

const FindTheDifference: React.FC<GameProps> = ({ gameName }) => {
    const [found, setFound] = useState<number[]>([]);
    const isWon = found.length === DIFFERENCES.length;

    const handleDifferenceClick = (id: number) => {
        if (!found.includes(id)) {
            setFound(f => [...f, id]);
        }
    };
    
    const resetGame = () => setFound([]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-yellow-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
                    {found.length} / {DIFFERENCES.length}
                </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">ابحث عن {DIFFERENCES.length} اختلافات!</h2>
            <div className="flex justify-center items-center gap-4 flex-wrap">
                <Scene isOriginal={true} onDifferenceClick={() => {}} found={found} />
                <Scene isOriginal={false} onDifferenceClick={handleDifferenceClick} found={found} />
            </div>
             {isWon && (
                <div className="mt-6">
                    <h2 className="text-4xl font-bold text-green-600 animate-pulse">🎉 رائع! لقد وجدت كل الاختلافات! 🎉</h2>
                    <button onClick={resetGame} className="mt-4 bg-yellow-500 text-white font-bold py-2 px-6 rounded-full">العب مرة أخرى</button>
                </div>
            )}
        </div>
    );
};

export default FindTheDifference;
