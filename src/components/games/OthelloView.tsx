import React, { useState } from 'react';
import { RefreshCw, Cpu, User } from 'lucide-react';

export const OthelloView: React.FC = () => {
  const [board, setBoard] = useState<(number | null)[][]>(() => {
    const b = Array(8).fill(null).map(() => Array(8).fill(null));
    b[3][3] = 2; // White
    b[3][4] = 1; // Black
    b[4][3] = 1; // Black
    b[4][4] = 2; // White
    return b;
  });

  const [currentPlayer, setCurrentPlayer] = useState<number>(1); // 1 = Black, 2 = White
  const [vsAi, setVsAi] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  const getFlips = (r: number, c: number, player: number, currentBoard: (number | null)[][]) => {
    if (currentBoard[r][c] !== null) return [];
    const opponent = player === 1 ? 2 : 1;
    let totalFlips: [number, number][] = [];

    directions.forEach(([dr, dc]) => {
      let flips: [number, number][] = [];
      let nr = r + dr;
      let nc = c + dc;

      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && currentBoard[nr][nc] === opponent) {
        flips.push([nr, nc]);
        nr += dr;
        nc += dc;
      }

      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && currentBoard[nr][nc] === player && flips.length > 0) {
        totalFlips = [...totalFlips, ...flips];
      }
    });

    return totalFlips;
  };

  const handleCellClick = (r: number, c: number) => {
    if (winner) return;
    const flips = getFlips(r, c, currentPlayer, board);
    if (flips.length === 0) return;

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = currentPlayer;
    flips.forEach(([fr, fc]) => {
      newBoard[fr][fc] = currentPlayer;
    });

    setBoard(newBoard);
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);

    checkGameOver(newBoard);

    if (vsAi && nextPlayer === 2) {
      setTimeout(() => aiMove(newBoard), 500);
    }
  };

  const aiMove = (currentBoard: (number | null)[][]) => {
    const validMoves: { r: number; c: number; flips: [number, number][] }[] = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const flips = getFlips(r, c, 2, currentBoard);
        if (flips.length > 0) {
          validMoves.push({ r, c, flips });
        }
      }
    }

    if (validMoves.length === 0) {
      setCurrentPlayer(1);
      return;
    }

    // Pick move with maximum flips
    validMoves.sort((a, b) => b.flips.length - a.flips.length);
    const bestMove = validMoves[0];

    const newBoard = currentBoard.map(row => [...row]);
    newBoard[bestMove.r][bestMove.c] = 2;
    bestMove.flips.forEach(([fr, fc]) => {
      newBoard[fr][fc] = 2;
    });

    setBoard(newBoard);
    setCurrentPlayer(1);
    checkGameOver(newBoard);
  };

  const checkGameOver = (currentBoard: (number | null)[][]) => {
    let blackCount = 0;
    let whiteCount = 0;
    let emptyCount = 0;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (currentBoard[r][c] === 1) blackCount++;
        else if (currentBoard[r][c] === 2) whiteCount++;
        else emptyCount++;
      }
    }

    if (emptyCount === 0 || blackCount === 0 || whiteCount === 0) {
      if (blackCount > whiteCount) setWinner(`سیاه برنده شد! (${blackCount} به ${whiteCount})`);
      else if (whiteCount > blackCount) setWinner(`سفید برنده شد! (${whiteCount} به ${blackCount})`);
      else setWinner('بازی مساوی شد!');
    }
  };

  const resetGame = () => {
    const b = Array(8).fill(null).map(() => Array(8).fill(null));
    b[3][3] = 2;
    b[3][4] = 1;
    b[4][3] = 1;
    b[4][4] = 2;
    setBoard(b);
    setCurrentPlayer(1);
    setWinner(null);
  };

  // Calculate scores
  let blackScore = 0;
  let whiteScore = 0;
  board.forEach(row => row.forEach(val => {
    if (val === 1) blackScore++;
    if (val === 2) whiteScore++;
  }));

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/50 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            ●
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">اتلو موبایل (OthelloMobail)</h3>
            <p className="text-[10px] text-slate-400">نوبت: {currentPlayer === 1 ? 'مشکی (شما)' : 'سفید (حریف)'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setVsAi(!vsAi)}
            className={`px-2 py-1 text-xs rounded-lg flex items-center gap-1 transition ${
              vsAi ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {vsAi ? <Cpu className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            {vsAi ? 'ربات' : 'دو نفره'}
          </button>
          <button
            onClick={resetGame}
            className="p-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scores Bar */}
      <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-2.5 mb-3 border border-slate-700/30">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-slate-950 border-2 border-slate-600 shadow" />
          <span className="text-xs text-slate-300">مشکی:</span>
          <span className="font-bold text-emerald-400">{blackScore}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-400">{whiteScore}</span>
          <span className="text-xs text-slate-300">:سفید</span>
          <div className="w-5 h-5 rounded-full bg-slate-100 border-2 border-slate-300 shadow" />
        </div>
      </div>

      {/* Board */}
      <div className="w-full aspect-square max-w-[340px] mx-auto bg-emerald-900 p-2 rounded-2xl border-4 border-emerald-950 shadow-2xl">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full gap-1 bg-emerald-950 p-1 rounded-xl">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const flips = getFlips(r, c, currentPlayer, board);
              const isValid = flips.length > 0 && !winner;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className="w-full h-full bg-emerald-800/90 rounded-md flex items-center justify-center relative hover:bg-emerald-700/80 transition-all"
                >
                  {cell === 1 && (
                    <div className="w-4/5 h-4/5 rounded-full bg-gradient-to-br from-slate-800 to-black shadow-md border border-slate-700 transform transition-transform duration-300 scale-100" />
                  )}
                  {cell === 2 && (
                    <div className="w-4/5 h-4/5 rounded-full bg-gradient-to-br from-white to-slate-200 shadow-md border border-slate-300 transform transition-transform duration-300 scale-100" />
                  )}
                  {isValid && (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60 animate-pulse" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Winner banner */}
      {winner && (
        <div className="mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-xl text-center font-bold text-sm shadow-lg animate-bounce">
          🏆 {winner}
        </div>
      )}
    </div>
  );
};
