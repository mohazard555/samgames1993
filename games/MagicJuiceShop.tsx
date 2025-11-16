import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const FRUITS = ['🍓', '🍌', '🍎', '🍊'];

const MagicJuiceShop: React.FC<GameProps> = ({ gameName }) => {
    const [juice, setJuice] = useState<string[]>([]);

    const handleDragStart = (e: React.DragEvent, fruit: string) => {
        e.dataTransfer.setData('fruit', fruit);
    };
    const handleDrop = (e: React.DragEvent) => {
        const fruit = e.dataTransfer.getData('fruit');
        setJuice(j => [...j, fruit]);
    };
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <button onClick={() => setJuice([])} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p>اسحب الفواكه إلى الخلاط لصنع عصير!</p>
            <div className="flex justify-center gap-6 mt-4">
                {FRUITS.map(f => <div key={f} draggable onDragStart={e => handleDragStart(e, f)} className="text-6xl cursor-grab">{f}</div>)}
            </div>
            <div onDrop={handleDrop} onDragOver={handleDragOver} className="w-48 h-64 border-4 border-gray-500 rounded-lg bg-gray-200 mx-auto mt-4 flex items-center justify-center text-3xl flex-wrap">
                {juice}
            </div>
        </div>
    );
};

export default MagicJuiceShop;
