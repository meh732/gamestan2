import React, { useState } from 'react';
import { RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';

const initialSudokuGrid = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

export const SudokuView: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(initialSudokuGrid);
  const [selected, setSelected] = useState<[number, number] | null>([0, 2]);

  const handleCellClick = (r: number, c: number) => {
    setSelected([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selected) return;
    const [r, c] = selected;
    if (initialSudokuGrid[r][c] !== 0) return; // Fixed initial cell

    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
  };

  const resetGrid = () => {
    setGrid(initialSudokuGrid);
    setSelected(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-2.5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-800/90 p-2 rounded-xl border border-slate-700/50 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-base">
            🔢
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-100">سودوکو (sudokuMobail)</h3>
            <p className="text-[10px] text-slate-400">سختی: متوسط</p>
          </div>
        </div>

        <button
          onClick={resetGrid}
          className="p-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid */}
      <div className="w-full aspect-square max-w-[320px] mx-auto bg-slate-950 p-1.5 rounded-xl border-2 border-slate-800 grid grid-cols-9 grid-rows-9 gap-[1px]">
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isInitial = initialSudokuGrid[r][c] !== 0;
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const borderRight = c === 2 || c === 5 ? 'border-r-2 border-r-blue-500/50' : '';
            const borderBottom = r === 2 || r === 5 ? 'border-b-2 border-b-blue-500/50' : '';

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`w-full h-full flex items-center justify-center font-bold text-xs md:text-sm transition ${
                  isSelected
                    ? 'bg-blue-600 text-white font-extrabold ring-2 ring-blue-400 z-10'
                    : isInitial
                    ? 'bg-slate-800 text-blue-300'
                    : val !== 0
                    ? 'bg-slate-800/60 text-amber-300'
                    : 'bg-slate-900/80 hover:bg-slate-800'
                } ${borderRight} ${borderBottom}`}
              >
                {val !== 0 ? val : ''}
              </button>
            );
          })
        )}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-5 gap-1.5 mt-3 max-w-[320px] mx-auto w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="py-2 bg-slate-800 hover:bg-blue-600 text-slate-100 font-extrabold text-sm rounded-lg border border-slate-700 transition active:scale-95"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumberInput(0)}
          className="py-2 bg-rose-900/40 hover:bg-rose-800 text-rose-200 font-bold text-xs rounded-lg border border-rose-700 transition active:scale-95 flex items-center justify-center"
        >
          پاک
        </button>
      </div>
    </div>
  );
};
