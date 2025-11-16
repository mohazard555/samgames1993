import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const TicTacToe: React.FC<GameProps> = ({ gameName }) => {
    const [board, setBoard] = useState<(string|null)[]>(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState<string|null>(null);

    const checkWinner = (currentBoard: (string|null)[]) => {
        const lines = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        if (currentBoard.every(cell => cell !== null)) return 'draw';
        return null;
    };
    
    const handlePlayerMove = (index: number) => {
        if (board[index] || !isPlayerTurn || winner) return;
        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);
    };

    useEffect(() => {
        const currentWinner = checkWinner(board);
        if (currentWinner) {
            setWinner(currentWinner);
            return;
        }

        if (!isPlayerTurn) {
            // Simple AI move
            const emptyIndices = board.map((val, idx) => val === null ? idx : -1).filter(val => val !== -1);
            if (emptyIndices.length > 0) {
                 setTimeout(() => {
                    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                    const newBoard = [...board];
                    newBoard[randomIndex] = 'O';
                    setBoard(newBoard);
                    const newWinner = checkWinner(newBoard);
                    if (newWinner) setWinner(newWinner);
                    else setIsPlayerTurn(true);
                }, 500);
            }
        }
    }, [isPlayerTurn, board]);
    
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-yellow-800">{gameName}</h1>
                <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 w-72 h-72 mx-auto bg-yellow-600 p-2">
                {board.map((cell, i) => (
                    <button key={i} onClick={() => handlePlayerMove(i)} className="bg-yellow-200 text-6xl font-bold flex items-center justify-center">
                        {cell}
                    </button>
                ))}
            </div>

            {winner && (
                 <div className="mt-6">
                    <h2 className="text-4xl font-bold text-green-600">
                        {winner === 'draw' ? 'تعادل!' : `🎉 الفائز هو ${winner}! 🎉`}
                    </h2>
                </div>
            )}
        </div>
    );
};

export default TicTacToe;