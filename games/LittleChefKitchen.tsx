import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const RECIPE = ['🥚', '🥛', ' farine ', '🍫'];
const LittleChefKitchen: React.FC<GameProps> = ({ gameName }) => {
    const [added, setAdded] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    const addIngredient = (ingredient: string) => {
        if (isComplete || added.length >= RECIPE.length) return;
        if (RECIPE[added.length] === ingredient) {
            const newAdded = [...added, ingredient];
            setAdded(newAdded);
            if (newAdded.length === RECIPE.length) {
                setIsComplete(true);
            }
        } else {
            alert('مكون خاطئ! حاول مرة أخرى.');
            setAdded([]);
        }
    };
    
    const resetGame = () => {
        setAdded([]);
        setIsComplete(false);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p className="mb-4">اتبع الوصفة لعمل كعكة! الوصفة: بيض، حليب، دقيق، شوكولاتة.</p>
            <div className="flex justify-center gap-4 mb-4">
                {RECIPE.map(ing => (
                    <button key={ing} onClick={() => addIngredient(ing)} className="text-6xl p-4 bg-gray-200 rounded-lg hover:bg-gray-300">
                        {ing}
                    </button>
                ))}
            </div>
            <div className="w-64 h-64 bg-yellow-100 border-4 border-gray-400 rounded-full mx-auto flex items-center justify-center text-4xl">
                {isComplete ? '🎂' : added.join(' ')}
            </div>
             {isComplete && <h2 className="mt-4 text-3xl font-bold text-green-600">🎉 كعكة لذيذة! 🎉</h2>}
        </div>
    );
};

export default LittleChefKitchen;
