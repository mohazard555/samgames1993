import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const INGREDIENTS = ['🍞', '🥬', '🍅', '🧀', '🥩', '🍞'];
const FunChefSandwich: React.FC<GameProps> = ({ gameName }) => {
    const [stack, setStack] = useState<string[]>([]);
    const addLayer = (ingredient: string) => setStack(s => [...s, ingredient]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <button onClick={() => setStack([])} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p>انقر على المكونات لبناء سندويتش لذيذ!</p>
            <div className="flex justify-center gap-4 mt-4">
                {INGREDIENTS.map((ing, i) => (
                    <button key={i} onClick={() => addLayer(ing)} className="text-5xl p-3 bg-gray-200 rounded-lg hover:bg-gray-300">{ing}</button>
                ))}
            </div>
            <div className="mt-6 flex flex-col-reverse items-center">
                {stack.map((item, i) => <div key={i} className="text-7xl -my-5">{item}</div>)}
            </div>
        </div>
    );
};

export default FunChefSandwich;
