import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ANIMALS = ['🐰', '🦊', '🐻', '🐼'];
const RACE_END = 90; // percentage

const CuteAnimalRace: React.FC<GameProps> = ({ gameName }) => {
    const [positions, setPositions] = useState<number[]>(new Array(ANIMALS.length).fill(0));
    const [gameState, setGameState] = useState<'idle' | 'racing' | 'finished'>('idle');
    const [winner, setWinner] = useState<number | null>(null);

    const raceInterval = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (gameState !== 'racing') return;
        
        raceInterval.current = window.setInterval(() => {
            let raceFinished = false;
            let currentWinner = -1;

            setPositions(currentPositions => {
                const newPositions = currentPositions.map((pos, i) => {
                    if (i === 0) return pos; // Player controlled separately
                    const newPos = Math.min(RACE_END, pos + Math.random() * 0.5);
                    if (newPos >= RACE_END && currentWinner === -1) {
                         raceFinished = true;
                         currentWinner = i;
                    }
                    return newPos;
                });
                return newPositions;
            });
            
            if (raceFinished) {
                setGameState('finished');
                setWinner(currentWinner);
            }

        }, 100);

        return () => clearInterval(raceInterval.current);
    }, [gameState]);

    const startGame = () => {
        setPositions(new Array(ANIMALS.length).fill(0));
        setWinner(null);
        setGameState('racing');
    };

    const handlePlayerMove = () => {
        if (gameState !== 'racing') return;
        setPositions(current => {
            const newPositions = [...current];
            const newPlayerPos = Math.min(RACE_END, newPositions[0] + 1.5);
             if (newPlayerPos >= RACE_END) {
                setGameState('finished');
                setWinner(0);
            }
            newPositions[0] = newPlayerPos;
            return newPositions;
        });
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-yellow-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>

            <div className="bg-green-200 p-4 rounded-lg space-y-4">
                {ANIMALS.map((animal, i) => (
                    <div key={i} className="relative w-full h-12 bg-green-300 rounded-full">
                         <div className="absolute text-4xl" style={{ left: `${positions[i]}%`, transition: 'left 0.1s linear' }}>{animal}</div>
                         <div className="absolute right-2 top-1 text-3xl">🏁</div>
                    </div>
                ))}
            </div>

             <div className="mt-6 h-32 flex items-center justify-center">
                {gameState === 'idle' && (
                    <button onClick={startGame} className="bg-green-500 text-white font-bold py-4 px-8 rounded-full text-3xl hover:bg-green-600 transition-transform transform hover:scale-105">
                        ابدأ السباق
                    </button>
                )}
                {gameState === 'racing' && (
                     <button onClick={handlePlayerMove} className="bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-3xl hover:bg-blue-600 active:scale-95">
                        انقر للسرعة! (أنت 🐰)
                    </button>
                )}
                {gameState === 'finished' && (
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-4">{winner === 0 ? '🎉 لقد فزت! 🎉' : `😞 ${ANIMALS[winner ?? 1]} فاز! 😞`}</h2>
                        <button onClick={startGame} className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-full text-2xl hover:bg-yellow-600">
                            سباق آخر
                        </button>
                    </div>
                )}
             </div>
        </div>
    );
};

export default CuteAnimalRace;