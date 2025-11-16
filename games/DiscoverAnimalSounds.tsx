import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ANIMALS = [
    { name: 'بقرة', emoji: '🐮', sound: 'موو' },
    { name: 'كلب', emoji: '🐶', sound: 'نباح' },
    { name: 'قطة', emoji: '🐱', sound: 'مواء' },
    { name: 'خروف', emoji: '🐑', sound: 'ثغاء' },
    { name: 'أسد', emoji: '🦁', sound: 'زئير' },
    { name: 'ديك', emoji: '🐔', sound: 'صياح' },
];

const DiscoverAnimalSounds: React.FC<GameProps> = ({ gameName }) => {
    const [currentSound, setCurrentSound] = useState<string | null>(null);

    const playSound = (sound: string) => {
        setCurrentSound(sound);
        // We'll just display the text, as we can't play actual audio easily.
        setTimeout(() => setCurrentSound(null), 1500);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-200">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-yellow-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>

            <p className="text-xl text-gray-600 mb-6">انقر على الحيوان لسماع صوته!</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {ANIMALS.map(animal => (
                    <button 
                        key={animal.name} 
                        onClick={() => playSound(animal.sound)}
                        className="bg-yellow-100 p-6 rounded-2xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform"
                    >
                        <span className="text-8xl">{animal.emoji}</span>
                        <span className="text-2xl font-bold mt-2">{animal.name}</span>
                    </button>
                ))}
            </div>
            
            {currentSound && (
                <div className="mt-8 p-4 bg-green-200 rounded-lg">
                    <p className="text-5xl font-bold text-green-800 animate-pulse">{currentSound}!</p>
                </div>
            )}
        </div>
    );
};

export default DiscoverAnimalSounds;
