import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const DOTS = [
    { x: 150, y: 50 }, { x: 250, y: 50 }, { x: 300, y: 150 }, 
    { x: 200, y: 250 }, { x: 100, y: 150 }, { x: 150, y: 50 }
]; // Simple house shape

const ConnectTheDots: React.FC<GameProps> = ({ gameName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [lastConnected, setLastConnected] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connected lines
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(DOTS[0].x, DOTS[0].y);
        for (let i = 1; i <= lastConnected; i++) {
            ctx.lineTo(DOTS[i].x, DOTS[i].y);
        }
        ctx.stroke();

        // Draw dots
        DOTS.slice(0, -1).forEach((dot, index) => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = index <= lastConnected ? '#2563EB' : '#9CA3AF';
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((index + 1).toString(), dot.x, dot.y);
        });

    }, [lastConnected]);
    
    useEffect(() => {
        draw();
    }, [draw]);

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (isComplete) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nextDotIndex = lastConnected + 1;
        if (nextDotIndex < DOTS.length) {
            const nextDot = DOTS[nextDotIndex];
            const dx = x - nextDot.x;
            const dy = y - nextDot.y;
            if (Math.sqrt(dx * dx + dy * dy) < 15) { // Click radius
                const newLastConnected = lastConnected + 1;
                setLastConnected(newLastConnected);
                if (newLastConnected === DOTS.length - 1) {
                    setIsComplete(true);
                }
            }
        }
    };
    
    const resetGame = () => {
        setLastConnected(0);
        setIsComplete(false);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-300">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-blue-800">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p className="mb-4">انقر على الأرقام بالترتيب لتوصيل النقاط ورسم الشكل!</p>
            <canvas
                ref={canvasRef}
                width="400"
                height="300"
                onClick={handleCanvasClick}
                className="bg-gray-100 rounded-lg cursor-pointer mx-auto"
            />
            {isComplete && <h2 className="mt-4 text-3xl font-bold text-green-600 animate-pulse">🎉 أحسنت! لقد أكملت الشكل! 🎉</h2>}
        </div>
    );
};

export default ConnectTheDots;
