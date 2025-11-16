import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }
interface CarColors { body: string; windows: string; wheels: string; }

const COLORS = ['#FF0000', '#0000FF', '#FFFF00', '#000000', '#808080', '#FFFFFF'];

const CarSvg: React.FC<{ colors: CarColors, onPartClick: (part: keyof CarColors) => void }> = ({ colors, onPartClick }) => (
    <svg viewBox="0 0 200 100" className="w-full h-auto max-w-lg cursor-pointer">
        <path d="M 10 70 L 30 70 L 40 50 L 160 50 L 170 70 L 190 70 L 190 85 L 175 85 L 175 95 L 165 95 L 165 85 L 55 85 L 55 95 L 45 95 L 45 85 L 10 85 Z" fill={colors.body} onClick={() => onPartClick('body')} stroke="black" strokeWidth="2" />
        <path d="M 50 55 L 80 55 L 90 70 L 40 70 Z" fill={colors.windows} onClick={() => onPartClick('windows')} stroke="black" strokeWidth="1" />
        <path d="M 95 55 L 125 55 L 135 70 L 105 70 Z" fill={colors.windows} onClick={() => onPartClick('windows')} stroke="black" strokeWidth="1" />
        <circle cx="50" cy="85" r="10" fill={colors.wheels} onClick={() => onPartClick('wheels')} stroke="black" strokeWidth="1" />
        <circle cx="170" cy="85" r="10" fill={colors.wheels} onClick={() => onPartClick('wheels')} stroke="black" strokeWidth="1" />
    </svg>
);

const ColoringFastCars: React.FC<GameProps> = ({ gameName }) => {
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [partColors, setPartColors] = useState<CarColors>({ body: '#F3F4F6', windows: '#BFDBFE', wheels: '#374151' });

    const handlePartClick = (part: keyof CarColors) => {
        setPartColors(prev => ({ ...prev, [part]: selectedColor }));
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="w-24"></div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-3 mb-6 p-3 bg-gray-100 rounded-full">
                    {COLORS.map(color => (
                        <button key={color} onClick={() => setSelectedColor(color)} className={`w-12 h-12 rounded-full border-4 ${selectedColor === color ? 'border-sky-500' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                    ))}
                </div>
                <div className="w-full bg-gray-50 p-4 rounded-2xl">
                    <CarSvg colors={partColors} onPartClick={handlePartClick} />
                </div>
            </div>
        </div>
    );
};

export default ColoringFastCars;
