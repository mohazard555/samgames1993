import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6'];

const MagicKidsPiano: React.FC<GameProps> = ({ gameName }) => {
    const [activeNote, setActiveNote] = useState<string | null>(null);

    const playNote = (note: string) => {
        setActiveNote(note);
        // In a real app, you'd use a library like Tone.js to play sounds.
        // For this simple version, we'll just show a visual effect.
        setTimeout(() => setActiveNote(null), 200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-purple-800">{gameName}</h1>
                <div className="w-24"></div>
            </div>

            <p className="text-xl text-gray-600 mb-6">انقر على المفاتيح للعزف!</p>

            <div className="flex justify-center h-80 bg-gray-800 p-4 rounded-lg">
                {NOTES.map((note, index) => (
                    <button
                        key={note}
                        onClick={() => playNote(note)}
                        className="h-full w-1/7 border-2 border-gray-900 rounded-b-lg flex items-end justify-center pb-4 text-3xl font-bold text-white transition-all duration-100"
                        style={{
                            backgroundColor: COLORS[index],
                            transform: activeNote === note ? 'scaleY(0.95)' : 'scaleY(1)',
                            flex: 1,
                        }}
                    >
                        {note}
                    </button>
                ))}
            </div>
             {activeNote && (
                <div className="mt-4 text-6xl font-bold" style={{ color: COLORS[NOTES.indexOf(activeNote)] }}>
                    ♪
                </div>
            )}
        </div>
    );
};

export default MagicKidsPiano;
