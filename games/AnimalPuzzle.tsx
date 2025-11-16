import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const PUZZLE_IMAGE_URL = 'https://images.unsplash.com/photo-1555169062-013468b47731?w=400&h=400&fit=crop';
const GRID_SIZE = 3;

const AnimalPuzzle: React.FC<GameProps> = ({ gameName }) => {
    const pieceSize = 400 / GRID_SIZE;

    const correctPieces = useMemo(() => Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
        id: i,
        x: (i % GRID_SIZE) * pieceSize,
        y: Math.floor(i / GRID_SIZE) * pieceSize,
    })), [pieceSize]);
    
    const [shuffledPieces, setShuffledPieces] = useState(() => [...correctPieces].sort(() => Math.random() - 0.5));
    const [placedPieces, setPlacedPieces] = useState<(typeof correctPieces[0] | null)[]>(new Array(GRID_SIZE * GRID_SIZE).fill(null));
    const [isComplete, setIsComplete] = useState(false);

    const handleDragStart = (e: React.DragEvent, piece: typeof correctPieces[0]) => {
        e.dataTransfer.setData('application/json', JSON.stringify(piece));
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    
    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        const piece = JSON.parse(e.dataTransfer.getData('application/json'));
        if (!placedPieces[index]) {
            setPlacedPieces(current => {
                const newPlaced = [...current];
                newPlaced[index] = piece;
                return newPlaced;
            });
            setShuffledPieces(current => current.filter(p => p.id !== piece.id));
        }
    };

    useEffect(() => {
        if (placedPieces.some(p => p === null)) return;
        const isCorrect = placedPieces.every((p, i) => p?.id === i);
        if (isCorrect) {
            setIsComplete(true);
        }
    }, [placedPieces]);

    const resetGame = () => {
        setShuffledPieces([...correctPieces].sort(() => Math.random() - 0.5));
        setPlacedPieces(new Array(GRID_SIZE * GRID_SIZE).fill(null));
        setIsComplete(false);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-indigo-300">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">→ العودة</Link>
                <h1 className="text-2xl font-bold text-indigo-800">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600">إعادة</button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
                {/* Puzzle Board */}
                <div className="grid border-4 border-indigo-400" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                    {placedPieces.map((piece, index) => (
                        <div key={index} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)} className="bg-indigo-100 border border-indigo-200" style={{ width: pieceSize, height: pieceSize }}>
                            {piece && (
                                <div style={{
                                    width: pieceSize, height: pieceSize,
                                    backgroundImage: `url(${PUZZLE_IMAGE_URL})`,
                                    backgroundPosition: `-${piece.x}px -${piece.y}px`,
                                }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Shuffled Pieces */}
                <div className="w-full md:w-48 bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">القطع</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                    {shuffledPieces.map(piece => (
                        <div key={piece.id} draggable onDragStart={(e) => handleDragStart(e, piece)} className="cursor-grab" style={{
                            width: pieceSize / 1.5, height: pieceSize / 1.5,
                            backgroundImage: `url(${PUZZLE_IMAGE_URL})`,
                            backgroundPosition: `-${piece.x / 1.5}px -${piece.y / 1.5}px`,
                            backgroundSize: `${400 / 1.5}px ${400 / 1.5}px`
                        }} />
                    ))}
                    </div>
                </div>
            </div>

            {isComplete && (
                <div className="mt-4 text-3xl font-bold text-green-600 animate-pulse">
                    🎉 أحسنت! لقد أكملت اللغز بنجاح! 🎉
                </div>
            )}
        </div>
    );
};

export default AnimalPuzzle;
