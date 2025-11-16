import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const WonderBubbles: React.FC<GameProps> = ({ gameName }) => {
    // This is a complex game to build from scratch.
    // We'll create a simplified "click to pop" version.
    const [bubbles, setBubbles] = useState(() =>
        Array.from({ length: 50 }, (_, i) => ({
            id: i,
            color: ['red', 'green', 'blue'][Math.floor(Math.random() * 3)],
            popped: false,
        }))
    );
    const [score, setScore] = useState(0);

    const popBubble = (id: number) => {
        const bubbleToPop = bubbles.find(b => b.id === id);
        if (!bubbleToPop || bubbleToPop.popped) return;

        setScore(s => s + 10);
        setBubbles(currentBubbles => currentBubbles.map(b => b.id === id ? { ...b, popped: true } : b));
    };
    
    const isGameWon = bubbles.every(b => b.popped);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <p className="mb-4">فرقع كل الفقاعات!</p>
            {isGameWon ? (
                <div className="h-64 flex justify-center items-center">
                    <h2 className="text-4xl font-bold text-green-600">🎉 لقد فزت! 🎉</h2>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                    {bubbles.map(bubble => (
                        <button
                            key={bubble.id}
                            onClick={() => popBubble(bubble.id)}
                            className="w-12 h-12 rounded-full transition-transform transform hover:scale-110"
                            style={{ 
                                backgroundColor: bubble.color,
                                visibility: bubble.popped ? 'hidden' : 'visible'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WonderBubbles;
