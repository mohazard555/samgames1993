import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ITEMS = [
    { name: 'تفاحة', emoji: '🍎', category: 'فاكهة' },
    { name: 'سيارة', emoji: '🚗', category: 'مركبة' },
    { name: 'كلب', emoji: '🐶', category: 'حيوان' },
    { name: 'موز', emoji: '🍌', category: 'فاكهة' },
    { name: 'طائرة', emoji: '✈️', category: 'مركبة' },
    { name: 'قطة', emoji: '🐱', category: 'حيوان' },
];

const CATEGORIES = ['فاكهة', 'مركبة', 'حيوان'];

const CategorySort: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentItem, setCurrentItem] = useState(ITEMS[0]);
    const [feedback, setFeedback] = useState<string | null>(null);

    const nextItem = useCallback(() => {
        setFeedback(null);
        setCurrentItem(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
    }, []);
    
    useEffect(nextItem, [nextItem]);

    const handleDrop = (e: React.DragEvent, category: string) => {
        e.preventDefault();
        const droppedItemName = e.dataTransfer.getData('itemName');
        const droppedItem = ITEMS.find(i => i.name === droppedItemName);

        if (droppedItem && droppedItem.category === category) {
            setScore(s => s + 10);
            setFeedback('صحيح!');
        } else {
            setFeedback('خطأ!');
        }
        setTimeout(nextItem, 1000);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDragStart = (e: React.DragEvent, itemName: string) => {
        e.dataTransfer.setData('itemName', itemName);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-orange-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-orange-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-700 mb-8">اسحب العنصر إلى الصندوق الصحيح</h2>

            <div 
                draggable 
                onDragStart={(e) => handleDragStart(e, currentItem.name)}
                className="text-8xl cursor-grab active:cursor-grabbing mb-8 inline-block animate-pulse"
            >
                {currentItem.emoji}
            </div>

            <div className="grid grid-cols-3 gap-4">
                {CATEGORIES.map(cat => (
                    <div 
                        key={cat} 
                        onDrop={(e) => handleDrop(e, cat)} 
                        onDragOver={handleDragOver}
                        className="bg-orange-100 p-8 rounded-2xl h-40 flex justify-center items-center"
                    >
                        <h3 className="text-3xl font-bold text-orange-900">{cat}</h3>
                    </div>
                ))}
            </div>
            {feedback && <p className={`mt-4 text-4xl font-bold ${feedback === 'صحيح!' ? 'text-green-500' : 'text-red-500'}`}>{feedback}</p>}
        </div>
    );
};

export default CategorySort;
