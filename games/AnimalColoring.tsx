import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const COLORS = ['#FFD700', '#FFA500', '#D2691E', '#8B4513', '#FFC0CB', '#000000', '#FFFFFF', '#808080'];

const INITIAL_COLORS = {
  mane: '#F3F4F6',
  face: '#F3F4F6',
  body: '#F3F4F6',
  tail: '#F3F4F6',
  innerEar: '#F3F4F6',
};

const LionSvg: React.FC<{ colors: typeof INITIAL_COLORS; onPartClick: (part: keyof typeof INITIAL_COLORS) => void }> = ({ colors, onPartClick }) => (
    <svg viewBox="0 0 200 200" className="w-full h-auto max-w-lg cursor-pointer">
        {/* Mane */}
        <path d="M100 10 C 40 10, 10 40, 10 100 C 10 160, 40 190, 100 190 C 160 190, 190 160, 190 100 C 190 40, 160 10, 100 10 Z M100 20 C 150 20, 180 50, 180 100 C 180 150, 150 180, 100 180 C 50 180, 20 150, 20 100 C 20 50, 50 20, 100 20 Z" 
        fill={colors.mane} onClick={() => onPartClick('mane')} stroke="black" strokeWidth="2" />
        {/* Face */}
        <circle cx="100" cy="100" r="60" fill={colors.face} onClick={() => onPartClick('face')} stroke="black" strokeWidth="2" />
        {/* Eyes */}
        <circle cx="80" cy="90" r="5" fill="black" />
        <circle cx="120" cy="90" r="5" fill="black" />
        {/* Nose */}
        <path d="M100 105 L90 115 L110 115 Z" fill="black" />
        {/* Mouth */}
        <path d="M90 125 Q100 135, 110 125" stroke="black" strokeWidth="2" fill="none" />
         {/* Ears */}
        <circle cx="60" cy="60" r="15" fill={colors.body} onClick={() => onPartClick('body')} stroke="black" strokeWidth="2"/>
        <circle cx="140" cy="60" r="15" fill={colors.body} onClick={() => onPartClick('body')} stroke="black" strokeWidth="2"/>
        <circle cx="60" cy="60" r="8" fill={colors.innerEar} onClick={() => onPartClick('innerEar')} stroke="black" strokeWidth="2"/>
        <circle cx="140" cy="60" r="8" fill={colors.innerEar} onClick={() => onPartClick('innerEar')} stroke="black" strokeWidth="2"/>
        {/* Tail tip */}
        <path d="M170 150 Q180 140 185 155 Q180 170 170 160 Z" fill={colors.tail} onClick={() => onPartClick('tail')} stroke="black" strokeWidth="2"/>
    </svg>
);

const AnimalColoring: React.FC<GameProps> = ({ gameName }) => {
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [partColors, setPartColors] = useState(INITIAL_COLORS);

  const handlePartClick = (part: keyof typeof INITIAL_COLORS) => {
    setPartColors(prev => ({ ...prev, [part]: selectedColor }));
  };
  
  const resetColors = () => {
    setPartColors(INITIAL_COLORS);
  }

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-pink-200">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">→ العودة</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-pink-800">{gameName}</h1>
         <button onClick={resetColors} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
            إعادة تعيين
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* Color Palette */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 p-3 bg-gray-100 rounded-full">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-12 h-12 rounded-full cursor-pointer border-4 transition-transform transform hover:scale-110 ${selectedColor === color ? 'border-sky-500 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>

        {/* Drawing Area */}
        <div className="w-full bg-gray-50 p-4 rounded-2xl">
           <LionSvg colors={partColors} onPartClick={handlePartClick} />
        </div>
      </div>
    </div>
  );
};

export default AnimalColoring;
