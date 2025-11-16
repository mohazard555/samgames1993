import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ITEMS = [
    { id: 'apple', emoji: '🍎', name: 'تفاحة' },
    { id: 'car', emoji: '🚗', name: 'سيارة' },
    { id: 'tree', emoji: '🌳', name: 'شجرة' },
    { id: 'star', emoji: '⭐', name: 'نجمة' },
];

const MatchingShadow: React.FC<GameProps> = ({ gameName }) => {
    const [placed, setPlaced] = useState<string[]>([]);
    
    const shuffledItems = useMemo(() => [...ITEMS].sort(() => Math.random() - 0.5), []);
    const shuffledShadows = useMemo(() => [...ITEMS].sort(() => Math.random() - 0.5), []);

    const handleDragStart = (e: React.DragEvent, itemId: string) => {
        e.dataTransfer.setData('itemId', itemId);
    };

    const handleDrop = (e: React.DragEvent, shadowId: string) => {
        const itemId = e.dataTransfer.getData('itemId');
        if (itemId === shadowId && !placed.includes(itemId)) {
            setPlaced(p => [...p, itemId]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    
    const resetGame = () => setPlaced([]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-gray-600">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-gray-800">{gameName}</h1>
                <button onClick={resetGame} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">اسحب كل شكل إلى ظله الصحيح!</h2>

            <div className="flex justify-center gap-8">
                <div className="flex flex-col gap-4 p-4 bg-gray-200 rounded-lg">
                    {shuffledItems.map(item => (
                        <div key={item.id} draggable={!placed.includes(item.id)} onDragStart={e => handleDragStart(e, item.id)} className={`text-6xl cursor-grab transition-opacity ${placed.includes(item.id) ? 'opacity-20' : ''}`}>
                            {item.emoji}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {shuffledShadows.map(item => (
                        <div key={item.id} onDrop={e => handleDrop(e, item.id)} onDragOver={handleDragOver} className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                            {placed.includes(item.id) ? 
                                <span className="text-6xl">{item.emoji}</span> : 
                                <span className="text-6xl" style={{ filter: 'brightness(0) opacity(0.5)' }}>{item.emoji}</span>
                            }
                        </div>
                    ))}
                </div>
            </div>
            
            {placed.length === ITEMS.length && (
                 <h2 className="mt-6 text-3xl font-bold text-green-600 animate-pulse">🎉 أحسنت! لقد طابقت كل الظلال! 🎉</h2>
            )}
        </div>
    );
};

export default MatchingShadow;
