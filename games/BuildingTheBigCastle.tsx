import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const BuildingTheBigCastle: React.FC<GameProps> = ({ gameName }) => {
    const [stack, setStack] = useState<{width: number, x: number}[]>([]);
    const [movingBlock, setMovingBlock] = useState({width: 100, x: 50});
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');

    const startGame = () => {
        setStack([{width: 120, x: 90}]);
        setMovingBlock({width: 120, x: 50});
        setGameState('playing');
    };

    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = setInterval(() => {
            setMovingBlock(b => ({...b, x: (b.x + 2) % 250 }));
        }, 16);
        return () => clearInterval(interval);
    }, [gameState]);
    
    const dropBlock = () => {
        if(gameState !== 'playing') return;
        const lastBlock = stack[stack.length - 1];
        const overlapStart = Math.max(lastBlock.x, movingBlock.x);
        const overlapEnd = Math.min(lastBlock.x + lastBlock.width, movingBlock.x + movingBlock.width);
        const overlapWidth = Math.max(0, overlapEnd - overlapStart);

        if (overlapWidth > 0) {
            const newBlock = { width: overlapWidth, x: overlapStart };
            setStack(s => [...s, newBlock]);
            setMovingBlock({ width: overlapWidth, x: 50 });
        } else {
            setGameState('over');
        }
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">الارتفاع: {stack.length - 1}</div>
            </div>
             <div onClick={dropBlock} className="relative w-[300px] h-[400px] bg-sky-200 mx-auto overflow-hidden border-2">
                 {gameState === 'playing' && <div className="absolute h-5 bg-red-500" style={{width: movingBlock.width, left: movingBlock.x, top: 400 - (stack.length + 1) * 20}}></div>}
                 {stack.map((b, i) => <div key={i} className="absolute h-5 bg-yellow-600" style={{width: b.width, left: b.x, bottom: i * 20}}></div>)}
                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">انتهت اللعبة!</h2>}
                        <button onClick={startGame} className="bg-blue-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-blue-600">
                            {gameState === 'idle' ? 'ابدأ' : 'العب مرة أخرى'}
                        </button>
                    </div>
                )}
             </div>
        </div>
    );
};

export default BuildingTheBigCastle;
