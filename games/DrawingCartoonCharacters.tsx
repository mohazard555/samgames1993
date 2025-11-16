import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const PANDA_BACKGROUND_URL = 'https://img.icons8.com/pastel-glyph/256/panda-panda.png';
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

const DrawingCartoonCharacters: React.FC<GameProps> = ({ gameName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Draw background image
        const img = new Image();
        img.src = PANDA_BACKGROUND_URL;
        img.onload = () => {
            ctx.globalAlpha = 0.2; // Make it faint
            ctx.drawImage(img, canvas.width / 2 - 128, canvas.height / 2 - 128, 256, 256);
            ctx.globalAlpha = 1.0;
        };
    }, []);

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw background
        const img = new Image();
        img.src = PANDA_BACKGROUND_URL;
        img.onload = () => {
             ctx.globalAlpha = 0.2;
             ctx.drawImage(img, canvas.width / 2 - 128, canvas.height / 2 - 128, 256, 256);
             ctx.globalAlpha = 1.0;
        };
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-slate-300">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-slate-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-16 h-12"/>
                    <button onClick={clearCanvas} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">مسح</button>
                </div>
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="border-2 border-gray-400 bg-white rounded-lg cursor-crosshair"
                />
            </div>
        </div>
    );
};

export default DrawingCartoonCharacters;
