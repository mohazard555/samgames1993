import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const BUILDINGS = [
    { name: 'منزل', emoji: '🏠' },
    { name: 'شجرة', emoji: '🌳' },
    { name: 'متجر', emoji: '🏬' },
    { name: 'مكتب', emoji: '🏢' },
    { name: 'طريق', emoji: '➖' },
];
const GRID_SIZE = 10;

const LittleCityBuilder: React.FC<GameProps> = ({ gameName }) => {
    const [grid, setGrid] = useState<(string | null)[]>(new Array(GRID_SIZE * GRID_SIZE).fill(null));
    const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0].emoji);

    const handleCellClick = (index: number) => {
        const newGrid = [...grid];
        newGrid[index] = newGrid[index] === selectedBuilding ? null : selectedBuilding;
        setGrid(newGrid);
    };
    
    const clearCity = () => {
        setGrid(new Array(GRID_SIZE * GRID_SIZE).fill(null));
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-300">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <button onClick={clearCity} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">مسح المدينة</button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                 {/* Building Palette */}
                <div className="flex md:flex-col gap-3 p-4 bg-gray-100 rounded-lg">
                    {BUILDINGS.map(b => (
                        <button
                            key={b.name}
                            onClick={() => setSelectedBuilding(b.emoji)}
                            className={`flex flex-col items-center p-2 rounded-lg text-4xl w-20 h-20 justify-center transition-colors ${selectedBuilding === b.emoji ? 'bg-green-300' : 'bg-white'}`}
                        >
                            {b.emoji}
                            <span className="text-xs">{b.name}</span>
                        </button>
                    ))}
                </div>

                {/* City Grid */}
                <div className="grid border-2 border-gray-400 bg-green-100" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                    {grid.map((cell, index) => (
                        <div
                            key={index}
                            onClick={() => handleCellClick(index)}
                            className="w-10 h-10 border border-gray-300 flex items-center justify-center text-2xl cursor-pointer hover:bg-green-200"
                        >
                            {cell}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LittleCityBuilder;
