import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const PALETTE = [
    { number: 1, color: '#ef4444', name: 'أحمر' },
    { number: 2, color: '#3b82f6', name: 'أزرق' },
    { number: 3, color: '#22c55e', name: 'أخضر' },
    { number: 4, color: '#f59e0b', name: 'برتقالي' },
];

const ColorByNumber: React.FC<GameProps> = ({ gameName }) => {
    const [selectedColor, setSelectedColor] = useState(PALETTE[0].color);
    const [fills, setFills] = useState({ '1': 'white', '2': 'white', '3': 'white', '4': 'white' });

    const handlePathClick = (number: number) => {
        if (selectedColor === PALETTE.find(p => p.number === number)?.color) {
            setFills(f => ({ ...f, [number]: selectedColor }));
        } else {
            // Optional: Add wrong color feedback
        }
    };
    
    const resetColoring = () => {
        setFills({ '1': 'white', '2': 'white', '3': 'white', '4': 'white' });
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-pink-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-pink-800">{gameName}</h1>
                <button onClick={resetColoring} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">اختر لوناً ثم انقر على الرقم المطابق له في الصورة!</h2>

            <div className="flex justify-center gap-4 mb-6">
                {PALETTE.map(p => (
                    <button key={p.number} onClick={() => setSelectedColor(p.color)} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full border-4" style={{ backgroundColor: p.color, borderColor: selectedColor === p.color ? '#ec4899' : 'transparent' }} />
                        <span className="font-bold">{p.number}</span>
                    </button>
                ))}
            </div>

            <svg width="300" height="300" viewBox="0 0 100 100" className="mx-auto bg-gray-100 rounded-lg">
                <g stroke="black" strokeWidth="1">
                    <path d="M 0 100 L 50 0 L 100 100 Z" fill={fills['1']} onClick={() => handlePathClick(1)} className="cursor-pointer" />
                    <circle cx="25" cy="75" r="15" fill={fills['2']} onClick={() => handlePathClick(2)} className="cursor-pointer" />
                    <circle cx="75" cy="75" r="15" fill={fills['3']} onClick={() => handlePathClick(3)} className="cursor-pointer" />
                    <rect x="40" y="80" width="20" height="20" fill={fills['4']} onClick={() => handlePathClick(4)} className="cursor-pointer" />
                </g>
                 <g fontSize="10" textAnchor="middle" fill="black" pointerEvents="none">
                    <text x="50" y="60">1</text>
                    <text x="25" y="75">2</text>
                    <text x="75" y="75">3</text>
                    <text x="50" y="93">4</text>
                </g>
            </svg>
        </div>
    );
};

export default ColorByNumber;
