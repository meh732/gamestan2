import React, { useState } from 'react';
import { RefreshCw, Trophy, User, Cpu } from 'lucide-react';

type Piece = 'r' | 'n' | 'b' | 'q' | 'k' | 'p' | 'R' | 'N' | 'B' | 'Q' | 'K' | 'P' | null;

const initialBoard: Piece[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const pieceSymbols: Record<string, string> = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

export const ChessView: React.FC<{ onWin?: () => void }> = ({ onWin }) => {
  const [board, setBoard] = useState<Piece[][]>(initialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [vsAi, setVsAi] = useState(true);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);

  const handleSquareClick = (r: number, c: number) => {
    const piece = board[r][c];

    if (selected) {
      const [sr, sc] = selected;
      if (sr === r && sc === c) {
        setSelected(null);
        return;
      }

      // Move piece
      const sourcePiece = board[sr][sc];
      const targetPiece = board[r][c];

      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = sourcePiece;
      newBoard[sr][sc] = null;

      if (targetPiece) {
        if (targetPiece === targetPiece.toUpperCase()) {
          setCapturedWhite(prev => [...prev, pieceSymbols[targetPiece]]);
        } else {
          setCapturedBlack(prev => [...prev, pieceSymbols[targetPiece]]);
        }
      }

      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const moveNotation = `${pieceSymbols[sourcePiece || ''] || ''}${files[sc]}${8 - sr} ➔ ${files[c]}${8 - r}`;
      setMoveHistory(prev => [moveNotation, ...prev.slice(0, 7)]);

      setBoard(newBoard);
      setSelected(null);
      const nextTurn = turn === 'white' ? 'black' : 'white';
      setTurn(nextTurn);

      // AI move if vsAi
      if (vsAi && nextTurn === 'black') {
        setTimeout(() => makeAiMove(newBoard), 600);
      }
    } else {
      if (!piece) return;
      const isWhite = piece === piece.toUpperCase();
      if ((turn === 'white' && isWhite) || (turn === 'black' && !isWhite)) {
        setSelected([r, c]);
      }
    }
  };

  const makeAiMove = (currentBoard: Piece[][]) => {
    const blackPieces: [number, number][] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p && p === p.toLowerCase()) {
          blackPieces.push([r, c]);
        }
      }
    }
    if (blackPieces.length === 0) return;

    const [sr, sc] = blackPieces[Math.floor(Math.random() * blackPieces.length)];
    // Find valid forward or sideways moves
    const moves: [number, number][] = [
      [sr + 1, sc],
      [sr + 1, sc - 1],
      [sr + 1, sc + 1],
      [sr, sc + 1],
      [sr, sc - 1]
    ];
    const candidateMoves = moves.filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);

    if (candidateMoves.length > 0) {
      const [tr, tc] = candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
      const sourcePiece = currentBoard[sr][sc];
      const targetPiece = currentBoard[tr][tc];

      const newBoard = currentBoard.map(row => [...row]);
      newBoard[tr][tc] = sourcePiece;
      newBoard[sr][sc] = null;

      if (targetPiece && targetPiece === targetPiece.toUpperCase()) {
        setCapturedWhite(prev => [...prev, pieceSymbols[targetPiece]]);
      }

      setBoard(newBoard);
      setTurn('white');
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setSelected(null);
    setTurn('white');
    setMoveHistory([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/50 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
            ♟
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">شطرنج موبایل (ChessMobail)</h3>
            <p className="text-[10px] text-slate-400">نوبت: {turn === 'white' ? 'سفید (شما)' : 'سیاه (حریف)'}</p>
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
            {vsAi ? 'هوش مصنوعی' : 'دو نفره'}
          </button>
          <button
            onClick={resetGame}
            className="p-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="شروع مجدد"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Captured items bar */}
      <div className="flex justify-between items-center px-1 text-xs text-slate-400 mb-1">
        <div className="flex gap-1 h-5 items-center">
          <span>مهره‌های گرفته‌شده:</span>
          <span className="text-amber-200">{capturedBlack.join('')}</span>
        </div>
        <div className="flex gap-1 h-5 items-center">
          <span className="text-slate-300">{capturedWhite.join('')}</span>
        </div>
      </div>

      {/* Chess Board Grid */}
      <div className="w-full aspect-square max-w-[340px] mx-auto bg-amber-950 p-1.5 rounded-xl border-2 border-amber-800 shadow-2xl">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-lg overflow-hidden border border-amber-900">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isDark = (r + c) % 2 === 1;
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const isWhitePiece = piece && piece === piece.toUpperCase();

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`w-full h-full flex items-center justify-center text-xl md:text-2xl transition-all relative ${
                    isDark ? 'bg-amber-800/90' : 'bg-amber-100/90'
                  } ${isSelected ? 'ring-4 ring-cyan-400 z-10 scale-105 shadow-lg' : ''}`}
                >
                  {piece && (
                    <span
                      className={`select-none font-bold transform transition-transform ${
                        isWhitePiece
                          ? 'text-slate-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
                          : 'text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]'
                      }`}
                    >
                      {pieceSymbols[piece]}
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Move History */}
      <div className="mt-3 bg-slate-800/60 rounded-xl p-2 border border-slate-700/50 flex-1 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-1 text-[11px] text-slate-400 px-1">
          <span>آخرین حرکت‌ها:</span>
          <span className="text-amber-400 font-mono">{moveHistory.length} حرکت</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 text-xs text-slate-300 pr-1">
          {moveHistory.length === 0 ? (
            <p className="text-center text-slate-500 py-2 text-xs">برای شروع بازی، یکی از مهره‌ها را لمس کنید.</p>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {moveHistory.map((m, idx) => (
                <div key={idx} className="bg-slate-700/40 px-2 py-0.5 rounded text-[11px] font-mono flex justify-between">
                  <span className="text-slate-400">#{moveHistory.length - idx}</span>
                  <span className="text-amber-300">{m}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
