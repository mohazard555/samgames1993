import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const AmazingTableTennis: React.FC<GameProps> = ({ gameName }) => {
    const [paddleY, setPaddleY] = useState(125);
    const [ball, setBall] = useState({ x: 195, y: 145, vx: -2, vy: 1 });
    const [score, setScore] = useState(0);
    
    useEffect(() => {
        const gameLoop = setInterval(() => {
            setBall(b => {
                let { x, y, vx, vy } = b;
                x += vx;
                y += vy;
                if (y < 0 || y > 290) vy = -vy;
                if (x > 390) vx = -vx;
                if (x < 20 && y > paddleY && y < paddleY + 50) {
                    vx = -vx;
                    setScore(s => s + 1);
                }
                if (x < 0) { // Game over
                    return { x: 195, y: 145, vx: 2, vy: 1 };
                }
                return { x, y, vx, vy };
            });
        }, 16);
        return () => clearInterval(gameLoop);
    }, [paddleY]);
    
    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPaddleY(e.clientY - rect.top - 25);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div onMouseMove={handleMouseMove} className="relative w-[400px] h-[300px] bg-blue-800 mx-auto cursor-none border-2">
                <div className="absolute w-2 h-12 bg-white" style={{ top: paddleY, left: 10 }}></div>
                <div className="absolute w-2 h-12 bg-white" style={{ top: ball.y - 25, right: 10 }}></div>
                <div className="absolute w-2 h-2 rounded-full bg-white" style={{ top: ball.y, left: ball.x }}></div>
            </div>
        </div>
    );
};

export default AmazingTableTennis;
