import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ARABIC_LETTERS = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ'];
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

const LetterTracing: React.FC<GameProps> = ({ gameName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color] = useState('#16A34A');
    const [currentLetter, setCurrentLetter] = useState(ARABIC_LETTERS[0]);

    const drawBackgroundLetter = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#E5E7EB';
        ctx.font = '250px Cairo';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentLetter, canvas.width / 2, canvas.height / 2);
    }, [currentLetter]);
    
    useEffect(() => {
        drawBackgroundLetter();
    }, [drawBackgroundLetter]);

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
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };
    
    const nextLetter = () => {
        const currentIndex = ARABIC_LETTERS.indexOf(currentLetter);
        const nextIndex = (currentIndex + 1) % ARABIC_LETTERS.length;
        setCurrentLetter(ARABIC_LETTERS[nextIndex]);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-300">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-green-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>
            <p className="mb-4">تتبع شكل الحرف باستخدام الفأرة!</p>
            <div className="flex flex-col items-center gap-4">
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
                 <div className="flex items-center gap-4">
                    <button onClick={drawBackgroundLetter} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">مسح</button>
                    <button onClick={nextLetter} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">الحرف التالي</button>
                </div>
            </div>
        </div>
    );
};

export default LetterTracing;