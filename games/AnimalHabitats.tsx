import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ITEMS = [
    { id: 'camel', emoji: '🐫', habitat: 'الصحراء' },
    { id: 'penguin', emoji: '🐧', habitat: 'القطب' },
    { id: 'monkey', emoji: '🐒', habitat: 'الغابة' },
    { id: 'lion', emoji: '🦁', habitat: 'الغابة' },
    { id: 'polar_bear', emoji: '🐻‍❄️', habitat: 'القطب' },
    { id: 'scorpion', emoji: '🦂', habitat: 'الصحراء' },
];

const HABITATS = [
    { name: 'الصحراء', bg: 'bg-yellow-200' },
    { name: 'القطب', bg: 'bg-blue-200' },
    { name: 'الغابة', bg: 'bg-green-200' }
];

const AnimalHabitats: React.FC<GameProps> = ({ gameName }) => {
    const [unsorted, setUnsorted] = useState(ITEMS);
    const [score, setScore] = useState(0);

    const handleDragStart = (e: React.DragEvent, itemId: string, habitat: string) => {
        e.dataTransfer.setData('itemId', itemId);
        e.dataTransfer.setData('habitat', habitat);
    };

    const handleDrop = (e: React.DragEvent, binHabitat: string) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('itemId');
        const itemHabitat = e.dataTransfer.getData('habitat');

        if (itemHabitat === binHabitat) {
            setUnsorted(u => u.filter(s => s.id !== itemId));
            setScore(s => s + 10);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    
    const isComplete = unsorted.length === 0;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <div className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">اسحب كل حيوان إلى موطنه الصحيح!</h2>

            <div className="h-28 bg-gray-100 p-4 rounded-lg flex justify-center items-center gap-6 mb-8">
                {unsorted.map(item => (
                    <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item.id, item.habitat)} className="text-6xl cursor-grab active:cursor-grabbing">
                        {item.emoji}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
                {HABITATS.map(bin => (
                    <div key={bin.name} onDrop={(e) => handleDrop(e, bin.name)} onDragOver={handleDragOver} className={`p-6 rounded-xl h-40 flex justify-center items-center border-2 border-dashed border-gray-400 ${bin.bg}`}>
                        <h3 className="text-3xl font-bold text-gray-800">{bin.name}</h3>
                    </div>
                ))}
            </div>
            
            {isComplete && <h2 className="mt-6 text-3xl font-bold text-green-600 animate-pulse">🎉 رائع! لقد ساعدت كل الحيوانات! 🎉</h2>}
        </div>
    );
};

export default AnimalHabitats;
