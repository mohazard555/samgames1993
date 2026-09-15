import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playClickSound, playWinFanfare, playErrorSound, playSuccessSound } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

const TicTacToe: React.FC<GameProps> = ({ gameName }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (currentBoard: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    if (currentBoard.every((cell) => cell !== null)) return 'draw';
    return null;
  };

  const handlePlayerMove = (index: number) => {
    if (board[index] || !isPlayerTurn || winner) return;
    playClickSound();
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    const currentWinner = checkWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
      if (currentWinner === 'X') {
        playWinFanfare();
      } else if (currentWinner === 'O') {
        playErrorSound();
      } else {
        playSuccessSound();
      }
      return;
    }

    if (!isPlayerTurn && !winner) {
      const emptyIndices = board.map((val, idx) => (val === null ? idx : -1)).filter((val) => val !== -1);
      if (emptyIndices.length > 0) {
        setTimeout(() => {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[randomIndex] = 'O';
          playClickSound();
          setBoard(newBoard);
          const w = checkWinner(newBoard);
          if (w) {
            setWinner(w);
            if (w === 'O') playErrorSound();
            else if (w === 'X') playWinFanfare();
            else playSuccessSound();
          } else {
            setIsPlayerTurn(true);
          }
        }, 400);
      }
    }
  }, [isPlayerTurn, board, winner]);

  const resetGame = () => {
    playClickSound();
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-amber-400">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-amber-100">
        <h1 className="text-xl sm:text-2xl font-black text-amber-900 flex items-center gap-2">
          <span>⭕❌</span>
          <span>{gameName}</span>
        </h1>
        <button
          onClick={resetGame}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-xl shadow transition-transform active:scale-95 cursor-pointer"
        >
          🔄 إعادة اللعب
        </button>
      </div>

      <div className="bg-amber-100 p-4 sm:p-6 rounded-3xl max-w-xs mx-auto border-4 border-amber-300 shadow-inner">
        <div className="grid grid-cols-3 gap-3 w-64 h-64 mx-auto">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handlePlayerMove(i)}
              className={`rounded-2xl text-5xl font-black flex items-center justify-center transition-all shadow-md active:scale-95 border-2 ${
                cell === 'X'
                  ? 'bg-sky-500 text-white border-sky-600'
                  : cell === 'O'
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-white hover:bg-amber-50 border-amber-200'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {winner && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
            {winner === 'draw'
              ? '🤝 تعادل رائع! حاول الفوز مجدداً!'
              : winner === 'X'
              ? '🎉 مبروك يا بطل! لقد فزت! 🏆'
              : '🤖 فاز الكمبيوتر هذه المرة! حاول مجدداً!'}
          </h2>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
