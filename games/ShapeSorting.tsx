import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const SHAPES = [
    { id: 'c1', type: 'circle', emoji: '🔴' },
    { id: 's1', type: 'square', emoji: '🟩' },
    { id: 't1', type: 'triangle', emoji: '🔺' },
    { id: 'c2', type: 'circle', emoji: '🔵' },
    { id: 's2', type: 'square', emoji: '🟨' },
    { id: 't2', type: 'triangle', emoji: '⚠️' },
];
const BINS = ['circle', 'square', 'triangle'];

const ShapeSorting: React.FC<GameProps> = ({ gameName }) => {
    const [unsorted, setUnsorted] = useState(SHAPES);
    const [score, setScore] = useState(0);

    const handleDragStart = (e: React.DragEvent, shapeId: string, shapeType: string) => {
        e.dataTransfer.setData('shapeId', shapeId);
        e.dataTransfer.setData('shapeType', shapeType);
    };

    const handleDrop = (e: React.DragEvent, binType: string) => {
        e.preventDefault();
        const shapeId = e.dataTransfer.getData('shapeId');
        const shapeType = e.dataTransfer.getData('shapeType');

        if (shapeType === binType) {
            setUnsorted(u => u.filter(s => s.id !== shapeId));
            setScore(s => s + 10);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    
    const isComplete = unsorted.length === 0;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <div className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">اسحب كل شكل إلى الصندوق المطابق له!</h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
                {BINS.map(bin => (
                    <div key={bin} onDrop={(e) => handleDrop(e, bin)} onDragOver={handleDragOver} className="bg-green-100 p-6 rounded-xl h-32 flex justify-center items-center border-2 border-dashed border-green-400">
                        <span className="text-2xl font-bold">{bin === 'circle' ? 'دوائر' : bin === 'square' ? 'مربعات' : 'مثلثات'}</span>
                    </div>
                ))}
            </div>

            <div className="h-24 bg-gray-100 p-4 rounded-lg flex justify-center items-center gap-6">
                {unsorted.map(shape => (
                    <div key={shape.id} draggable onDragStart={(e) => handleDragStart(e, shape.id, shape.type)} className="text-6xl cursor-grab active:cursor-grabbing">
                        {shape.emoji}
                    </div>
                ))}
            </div>
            
            {isComplete && <h2 className="mt-6 text-3xl font-bold text-green-600 animate-pulse">🎉 أحسنت! لقد فرزت كل الأشكال! 🎉</h2>}
        </div>
    );
};

export default ShapeSorting;