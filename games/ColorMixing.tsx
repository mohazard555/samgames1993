import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const COLORS = {
    red: { name: 'أحمر', hex: '#ef4444' },
    yellow: { name: 'أصفر', hex: '#eab308' },
    blue: { name: 'أزرق', hex: '#3b82f6' },
};

const MIX_RESULTS = {
    'red-yellow': { name: 'برتقالي', hex: '#f97316' },
    'yellow-red': { name: 'برتقالي', hex: '#f97316' },
    'red-blue': { name: 'بنفسجي', hex: '#8b5cf6' },
    'blue-red': { name: 'بنفسجي', hex: '#8b5cf6' },
    'yellow-blue': { name: 'أخضر', hex: '#22c55e' },
    'blue-yellow': { name: 'أخضر', hex: '#22c55e' },
};

const ColorMixing: React.FC<GameProps> = ({ gameName }) => {
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    
    const mixedColor = useMemo(() => {
        if (selectedColors.length < 2) return null;
        const key = `${selectedColors[0]}-${selectedColors[1]}` as keyof typeof MIX_RESULTS;
        return MIX_RESULTS[key] || null;
    }, [selectedColors]);

    const selectColor = (colorId: string) => {
        if (selectedColors.includes(colorId)) return;
        const newSelection = [...selectedColors, colorId];
        if (newSelection.length > 2) {
            setSelectedColors([colorId]);
        } else {
            setSelectedColors(newSelection);
        }
    };
    
    const resetMix = () => setSelectedColors([]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-200">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-purple-800">{gameName}</h1>
                <button onClick={resetMix} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">اختر لونين لمزجهما!</h2>

            <div className="flex justify-center gap-6 mb-8">
                {Object.entries(COLORS).map(([id, color]) => (
                    <button key={id} onClick={() => selectColor(id)} className="w-24 h-24 rounded-full border-4 transition-transform transform hover:scale-110" style={{ backgroundColor: color.hex, borderColor: selectedColors.includes(id) ? '#6d28d9' : 'transparent' }} />
                ))}
            </div>

            <div className="flex justify-center items-center gap-4 text-6xl font-bold mb-8">
                <div className="w-24 h-24 rounded-full" style={{ backgroundColor: selectedColors[0] ? COLORS[selectedColors[0] as keyof typeof COLORS].hex : '#f3f4f6' }} />
                <span>+</span>
                <div className="w-24 h-24 rounded-full" style={{ backgroundColor: selectedColors[1] ? COLORS[selectedColors[1] as keyof typeof COLORS].hex : '#f3f4f6' }} />
                <span>=</span>
                 <div className="w-32 h-32 rounded-full border-4 border-gray-300" style={{ backgroundColor: mixedColor ? mixedColor.hex : '#f3f4f6' }} />
            </div>
            
            {mixedColor && (
                <h3 className="text-5xl font-bold" style={{ color: mixedColor.hex }}>
                    {mixedColor.name}!
                </h3>
            )}
        </div>
    );
};

export default ColorMixing;
