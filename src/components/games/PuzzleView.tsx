import React, { useState } from 'react';
import { RefreshCw, Trophy, Sparkles } from 'lucide-react';

export const PuzzleView: React.FC = () => {
  const solvedState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  const [grid, setGrid] = useState<number[]>([1, 2, 3, 4, 8, 5, 7, 6, 0]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const handleTileClick = (index: number) => {
    if (isWon) return;
    const emptyIndex = grid.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Is adjacent
    if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) || (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
      const newGrid = [...grid];
      newGrid[emptyIndex] = newGrid[index];
      newGrid[index] = 0;
      setGrid(newGrid);
      setMoves(m => m + 1);

      // Check win
      if (newGrid.every((val, i) => val === solvedState[i])) {
        setIsWon(true);
      }
    }
  };

  const shuffle = () => {
    let newGrid = [1, 2, 3, 4, 5, 6, 7, 0, 8];
    for (let i = 0; i < 20; i++) {
      const emptyIdx = newGrid.indexOf(0);
      const row = Math.floor(emptyIdx / 3);
      const col = emptyIdx % 3;
      const neighbors: number[] = [];
      if (row > 0) neighbors.push(emptyIdx - 3);
      if (row < 2) neighbors.push(emptyIdx + 3);
      if (col > 0) neighbors.push(emptyIdx - 1);
      if (col < 2) neighbors.push(emptyIdx + 1);

      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      newGrid[emptyIdx] = newGrid[next];
      newGrid[next] = 0;
    }
    setGrid(newGrid);
    setMoves(0);
    setIsWon(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/50 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
            🧩
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">پازل اسلایدی (PuzzleMobail)</h3>
            <p className="text-[10px] text-slate-400">تعداد حرکات: {moves}</p>
          </div>
        </div>

        <button
          onClick={shuffle}
          className="p-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      <div className="w-full aspect-square max-w-[320px] mx-auto bg-slate-950 p-2 rounded-2xl border-2 border-slate-800 shadow-2xl grid grid-cols-3 gap-2 my-auto">
        {grid.map((num, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            className={`w-full h-full rounded-xl flex items-center justify-center font-extrabold text-2xl transition-all shadow-md ${
              num === 0
                ? 'bg-slate-900 border-2 border-dashed border-slate-800'
                : 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white hover:scale-105 active:scale-95 border border-purple-400/30'
            }`}
          >
            {num !== 0 ? num : ''}
          </button>
        ))}
      </div>

      {/* Win Banner */}
      {isWon && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl text-center shadow-lg my-2 animate-bounce">
          <p className="font-bold text-sm text-white">🎉 تبریک! پازل را با {moves} حرکت حل کردید!</p>
        </div>
      )}

      {/* Footer Instruction */}
      <div className="text-center text-xs text-slate-400 mt-2">
        کاشی‌ها را طوری جابجا کنید تا اعداد از ۱ تا ۸ به ترتیب مرتب شوند.
      </div>
    </div>
  );
};
