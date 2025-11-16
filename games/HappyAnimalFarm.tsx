import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ANIMALS = ['🐮', '🐔', '🐷', '🐑'];
const HappyAnimalFarm: React.FC<GameProps> = ({ gameName }) => {
    const [fed, setFed] = useState<string[]>([]);
    
    const feedAnimal = (animal: string) => {
        if (!fed.includes(animal)) {
            setFed(f => [...f, animal]);
        }
    };
    
    const isAllFed = fed.length === ANIMALS.length;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <button onClick={() => setFed([])} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p>أطعم كل الحيوانات لتجعلها سعيدة!</p>
            <div className="flex justify-center gap-8 mt-6">
                {ANIMALS.map(animal => (
                    <div key={animal} className="flex flex-col items-center">
                        <div className="text-8xl">{fed.includes(animal) ? '😋' : animal}</div>
                        <button onClick={() => feedAnimal(animal)} className="text-4xl mt-2">🌾</button>
                    </div>
                ))}
            </div>
            {isAllFed && <h2 className="mt-4 text-3xl font-bold text-green-600">🎉 كل الحيوانات سعيدة! 🎉</h2>}
        </div>
    );
};

export default HappyAnimalFarm;
