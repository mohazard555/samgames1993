import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

interface Decoration {
    id: number;
    emoji: string;
    x: number;
    y: number;
}
const DECORATIONS = ['🍓', '🥝', '✨', '🎂', '🕯️'];

const BigChocolateCake: React.FC<GameProps> = ({ gameName }) => {
    const [placedItems, setPlacedItems] = useState<Decoration[]>([]);
    const [selectedDecoration, setSelectedDecoration] = useState(DECORATIONS[0]);

    const handleCakeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newDecoration: Decoration = {
            id: Date.now(),
            emoji: selectedDecoration,
            x: x - 16, // center the emoji
            y: y - 16,
        };
        setPlacedItems([...placedItems, newDecoration]);
    };
    
    const resetCake = () => {
        setPlacedItems([]);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-amber-800">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-amber-900">{gameName}</h1>
                <button onClick={resetCake} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            
            <div className="flex flex-col items-center gap-6">
                 <div className="flex justify-center gap-3 p-3 bg-gray-100 rounded-full">
                    <p className="font-bold my-auto">اختر زينة:</p>
                    {DECORATIONS.map(emoji => (
                        <button key={emoji} onClick={() => setSelectedDecoration(emoji)} className={`text-4xl w-16 h-16 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 ${selectedDecoration === emoji ? 'bg-amber-200' : 'bg-white'}`}>
                            {emoji}
                        </button>
                    ))}
                 </div>
                 
                <div
                    onClick={handleCakeClick}
                    className="relative w-[400px] h-[400px] cursor-pointer"
                >
                    {/* Cake layers */}
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-amber-800 rounded-t-lg"></div>
                    <div className="absolute bottom-1/3 left-[5%] w-[90%] h-1/3 bg-amber-700 rounded-t-lg"></div>
                    <div className="absolute bottom-2/3 left-[10%] w-[80%] h-1/3 bg-amber-600 rounded-t-full"></div>
                    <div className="absolute bottom-full left-[15%] w-[70%] h-1/3" style={{transform: 'translateY(100%)'}}></div>

                    {/* Placed items */}
                    {placedItems.map(item => (
                        <div key={item.id} className="absolute text-3xl" style={{ left: item.x, top: item.y }}>{item.emoji}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BigChocolateCake;
