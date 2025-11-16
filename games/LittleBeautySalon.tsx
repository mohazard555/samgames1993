import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const COLORS = ['#E11D48', '#2563EB', '#16A34A', '#FBBF24', '#000000'];

const LittleBeautySalon: React.FC<GameProps> = ({ gameName }) => {
    const [lipstickColor, setLipstickColor] = useState('transparent');
    const [eyeshadowColor, setEyeshadowColor] = useState('transparent');
    const [activeTool, setActiveTool] = useState<'lipstick' | 'eyeshadow' | null>(null);

    const applyColor = (color: string) => {
        if (activeTool === 'lipstick') setLipstickColor(color);
        if (activeTool === 'eyeshadow') setEyeshadowColor(color);
    };

    const resetLook = () => {
        setLipstickColor('transparent');
        setEyeshadowColor('transparent');
        setActiveTool(null);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-rose-300">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-rose-800">{gameName}</h1>
                <button onClick={resetLook} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                {/* Tools */}
                <div className="flex flex-col gap-4 p-4 bg-rose-50 rounded-lg">
                    <h3 className="font-bold text-lg">الأدوات</h3>
                    <button onClick={() => setActiveTool('lipstick')} className={`text-4xl p-3 rounded-lg ${activeTool === 'lipstick' ? 'bg-rose-300' : 'bg-white'}`}>💄</button>
                    <button onClick={() => setActiveTool('eyeshadow')} className={`text-4xl p-3 rounded-lg ${activeTool === 'eyeshadow' ? 'bg-rose-300' : 'bg-white'}`}>👁️</button>
                    <h3 className="font-bold text-lg mt-4">الألوان</h3>
                    <div className="flex flex-col gap-2">
                        {COLORS.map(color => (
                            <button key={color} onClick={() => applyColor(color)} style={{backgroundColor: color}} className="w-12 h-12 rounded-full border-2 border-gray-300"></button>
                        ))}
                    </div>
                </div>

                {/* Face */}
                <div className="relative w-80 h-80">
                    <div className="w-full h-full bg-rose-100 rounded-full border-4 border-black flex flex-col items-center">
                        {/* Eyeshadows */}
                        <div className="absolute top-1/4 left-1/4 w-12 h-6 rounded-full transition-colors" style={{backgroundColor: eyeshadowColor, opacity: 0.6}}></div>
                        <div className="absolute top-1/4 right-1/4 w-12 h-6 rounded-full transition-colors" style={{backgroundColor: eyeshadowColor, opacity: 0.6}}></div>
                        {/* Eyes */}
                        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-white rounded-full flex items-center justify-center"><div className="w-4 h-4 bg-black rounded-full"></div></div>
                        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-white rounded-full flex items-center justify-center"><div className="w-4 h-4 bg-black rounded-full"></div></div>
                        {/* Mouth */}
                        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white rounded-b-full transition-colors" style={{backgroundColor: lipstickColor}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LittleBeautySalon;
