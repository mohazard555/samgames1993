import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const SHAPES = [
    { id: 'square', name: 'مربع', emoji: '🟩' },
    { id: 'circle', name: 'دائرة', emoji: '🔴' },
    { id: 'triangle', name: 'مثلث', emoji: '🔺' },
    { id: 'star', name: 'نجمة', emoji: '⭐' },
];

const GeometricShapesPuzzle: React.FC<GameProps> = ({ gameName }) => {
    const [placedShapes, setPlacedShapes] = useState<string[]>([]);
    const shuffledShapes = React.useMemo(() => [...SHAPES].sort(() => Math.random() - 0.5), []);
    
    const handleDragStart = (e: React.DragEvent, shapeId: string) => {
        e.dataTransfer.setData('shapeId', shapeId);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };
    
    const handleDrop = (e: React.DragEvent, targetId: string) => {
        const droppedId = e.dataTransfer.getData('shapeId');
        if (droppedId === targetId && !placedShapes.includes(targetId)) {
            setPlacedShapes([...placedShapes, targetId]);
        }
    };
    
    const resetGame = () => setPlacedShapes([]);

    const isGameComplete = placedShapes.length === SHAPES.length;

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-purple-800">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {SHAPES.map(shape => (
                    <div
                        key={shape.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, shape.id)}
                        className={`w-40 h-40 flex items-center justify-center rounded-lg text-6xl transition-colors ${placedShapes.includes(shape.id) ? 'bg-green-300' : 'bg-gray-200'}`}
                    >
                        {placedShapes.includes(shape.id) ? shape.emoji : '?'}
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-6 p-4 bg-purple-100 rounded-lg">
                {shuffledShapes.map(shape => (
                    !placedShapes.includes(shape.id) && (
                        <div
                            key={shape.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, shape.id)}
                            className="text-7xl cursor-grab active:cursor-grabbing transform hover:scale-110 transition-transform"
                        >
                            {shape.emoji}
                        </div>
                    )
                ))}
            </div>
             {isGameComplete && (
                <div className="mt-6 text-3xl font-bold text-green-600 animate-pulse">
                    🎉 أحسنت! لقد أكملت اللغز! 🎉
                </div>
            )}
        </div>
    );
};

export default GeometricShapesPuzzle;
