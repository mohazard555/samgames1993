import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ShapeComposition: React.FC<GameProps> = ({ gameName }) => {
    const [trianglePlaced, setTrianglePlaced] = useState(false);
    const [squarePlaced, setSquarePlaced] = useState(false);

    const handleDrop = (e: React.DragEvent, shape: 'triangle' | 'square') => {
        e.preventDefault();
        const droppedShape = e.dataTransfer.getData('shape');
        if (droppedShape === shape) {
            if (shape === 'triangle') setTrianglePlaced(true);
            if (shape === 'square') setSquarePlaced(true);
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDragStart = (e: React.DragEvent, shape: 'triangle' | 'square') => {
        e.dataTransfer.setData('shape', shape);
    };
    
    const resetGame = () => {
        setTrianglePlaced(false);
        setSquarePlaced(false);
    }
    
    const isComplete = trianglePlaced && squarePlaced;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-cyan-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-cyan-800">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p className="text-xl text-gray-700 mb-6">اسحب الأشكال الصحيحة لبناء المنزل!</p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                {/* Building Area */}
                <div className="relative w-48 h-64">
                    <div onDrop={(e) => handleDrop(e, 'triangle')} onDragOver={handleDragOver} className="absolute top-0 left-0 w-48 h-24 border-2 border-dashed border-gray-400">
                        {trianglePlaced && <div className="w-0 h-0 border-l-[95px] border-l-transparent border-r-[95px] border-r-transparent border-b-[95px] border-b-red-500" />}
                    </div>
                     <div onDrop={(e) => handleDrop(e, 'square')} onDragOver={handleDragOver} className="absolute bottom-0 left-0 w-48 h-40 border-2 border-dashed border-gray-400">
                        {squarePlaced && <div className="w-full h-full bg-yellow-400" />}
                    </div>
                </div>

                {/* Shapes Palette */}
                <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg">
                    {!trianglePlaced && <div draggable onDragStart={(e) => handleDragStart(e, 'triangle')} className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-red-500 cursor-grab"></div>}
                    {!squarePlaced && <div draggable onDragStart={(e) => handleDragStart(e, 'square')} className="w-32 h-32 bg-yellow-400 cursor-grab"></div>}
                    <div className="w-32 h-32 bg-blue-500 rounded-full"></div>
                </div>
            </div>

            {isComplete && <h2 className="mt-6 text-3xl font-bold text-green-600 animate-pulse">🎉 أحسنت! لقد بنيت المنزل! 🎉</h2>}
        </div>
    );
};

export default ShapeComposition;