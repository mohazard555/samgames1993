import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ITEMS = [
    { id: 'apple', emoji: '🍎', color: 'red' },
    { id: 'frog', emoji: '🐸', color: 'green' },
    { id: 'water', emoji: '💧', color: 'blue' },
    { id: 'banana', emoji: '🍌', color: 'yellow' },
    { id: 'heart', emoji: '❤️', color: 'red' },
    { id: 'leaf', emoji: '🍃', color: 'green' },
    { id: 'whale', emoji: '🐳', color: 'blue' },
    { id: 'sun', emoji: '☀️', color: 'yellow' },
];

const BINS = [
    { name: 'أحمر', color: 'red', hex: '#ef4444' },
    { name: 'أخضر', color: 'green', hex: '#22c55e' },
    { name: 'أزرق', color: 'blue', hex: '#3b82f6' },
    { name: 'أصفر', color: 'yellow', hex: '#eab308' },
];

const ColorSorting: React.FC<GameProps> = ({ gameName }) => {
    const [unsortedItems, setUnsortedItems] = useState(ITEMS);
    const [score, setScore] = useState(0);

    const handleDragStart = (e: React.DragEvent, itemId: string, itemColor: string) => {
        e.dataTransfer.setData('itemId', itemId);
        e.dataTransfer.setData('itemColor', itemColor);
    };

    const handleDrop = (e: React.DragEvent, binColor: string) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('itemId');
        const itemColor = e.dataTransfer.getData('itemColor');

        if (itemColor === binColor) {
            setUnsortedItems(items => items.filter(item => item.id !== itemId));
            setScore(s => s + 10);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const isComplete = unsortedItems.length === 0;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-yellow-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">اسحب كل عنصر إلى صندوقه اللوني الصحيح!</h2>
            
            <div className="h-28 bg-gray-100 p-4 rounded-lg flex justify-center items-center gap-6 mb-8">
                {unsortedItems.map(item => (
                    <div key={item.id} draggable onDragStart={e => handleDragStart(e, item.id, item.color)} className="text-6xl cursor-grab active:cursor-grabbing">
                        {item.emoji}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {BINS.map(bin => (
                    <div key={bin.color} onDrop={e => handleDrop(e, bin.color)} onDragOver={handleDragOver} className="p-6 rounded-xl h-32 flex justify-center items-center" style={{ backgroundColor: bin.hex }}>
                        <h3 className="text-3xl font-bold text-white">{bin.name}</h3>
                    </div>
                ))}
            </div>
            
            {isComplete && <h2 className="mt-6 text-3xl font-bold text-green-600 animate-pulse">🎉 أحسنت! لقد فرزت كل الألوان! 🎉</h2>}
        </div>
    );
};

export default ColorSorting;
