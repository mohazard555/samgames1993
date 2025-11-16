import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const SHAPES = ['🍎', '🍌', '🍓', '🍇'];
const INITIAL_GRID = [
    '🍎', '🍌', null, null,
    '🍓', null, '🍎', null,
    null, '🍓', null, '🍌',
    null, null, '🍇', '🍎',
];

const ShapeSudoku: React.FC<GameProps> = ({ gameName }) => {
    const [grid, setGrid] = useState<(string|null)[]>(INITIAL_GRID);
    
    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        const shape = e.dataTransfer.getData('shape');
        const newGrid = [...grid];
        if (newGrid[index] === null) {
            newGrid[index] = shape;
            setGrid(newGrid);
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDragStart = (e: React.DragEvent, shape: string) => {
        e.dataTransfer.setData('shape', shape);
    };
    
    const resetGame = () => setGrid(INITIAL_GRID);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">املأ الشبكة! يجب أن يحتوي كل صف وعمود على كل شكل مرة واحدة.</h2>

            <div className="flex justify-center items-start gap-8">
                <div className="grid grid-cols-4 gap-1 p-2 bg-green-500">
                    {grid.map((cell, i) => (
                        <div key={i} onDrop={e => handleDrop(e, i)} onDragOver={handleDragOver} className="w-20 h-20 bg-green-100 flex items-center justify-center text-5xl">
                            {cell}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg">
                    {SHAPES.map(shape => (
                        <div key={shape} draggable onDragStart={e => handleDragStart(e, shape)} className="text-6xl cursor-grab">
                            {shape}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShapeSudoku;
