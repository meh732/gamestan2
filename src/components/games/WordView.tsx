import React, { useState } from 'react';
import { RefreshCw, CheckCircle, Lightbulb } from 'lucide-react';

interface WordChallenge {
  target: string;
  hint: string;
  letters: string[];
}

const wordChallenges: WordChallenge[] = [
  { target: 'گیمستان', hint: 'نام اپلیکیشن بازی‌های ایران', letters: ['گ', 'ی', 'م', 'س', 'ت', 'ا', 'ن'] },
  { target: 'شطرنج', hint: 'بازی فکری کهن با مهره‌های شاه و وزیر', letters: ['ش', 'ط', 'ر', 'ن', 'ج'] },
  { target: 'گردونه', hint: 'گردونه شانس برای دریافت سکه', letters: ['گ', 'ر', 'د', 'و', 'ن', 'ه'] },
  { target: 'اتلو', hint: 'بازی استراتژیک با مهره‌های سفید و سیاه', letters: ['ا', 'ت', 'ل', 'و'] }
];

export const WordView: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const current = wordChallenges[levelIndex];
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSelectLetter = (letter: string, index: number) => {
    if (selectedLetters.length < current.target.length) {
      const next = [...selectedLetters, letter];
      setSelectedLetters(next);

      if (next.join('') === current.target) {
        setIsSuccess(true);
      }
    }
  };

  const handleClear = () => {
    setSelectedLetters([]);
    setIsSuccess(false);
  };

  const nextLevel = () => {
    setLevelIndex((levelIndex + 1) % wordChallenges.length);
    setSelectedLetters([]);
    setIsSuccess(false);
    setShowHint(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none justify-between" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-base">
            🔤
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-100">بازی کلمات (WordMobail)</h3>
            <p className="text-[10px] text-slate-400">مرحله {levelIndex + 1} از {wordChallenges.length}</p>
          </div>
        </div>

        <button
          onClick={() => setShowHint(!showHint)}
          className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg transition flex items-center gap-1 text-xs"
        >
          <Lightbulb className="w-4 h-4" />
          راهنما
        </button>
      </div>

      {/* Hint Banner */}
      {showHint && (
        <div className="bg-amber-950/80 border border-amber-500/40 p-2 rounded-xl text-center text-xs text-amber-200">
          💡 راهنما: {current.hint}
        </div>
      )}

      {/* Word Slots */}
      <div className="my-auto flex flex-col items-center gap-4">
        <div className="flex gap-2 justify-center flex-wrap">
          {Array.from({ length: current.target.length }).map((_, idx) => (
            <div
              key={idx}
              className={`w-11 h-12 rounded-xl flex items-center justify-center font-black text-xl border-2 transition-all shadow-lg ${
                selectedLetters[idx]
                  ? 'bg-teal-600 border-teal-300 text-white animate-pop'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              {selectedLetters[idx] || ''}
            </div>
          ))}
        </div>

        {/* Success message */}
        {isSuccess && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-xl text-center shadow-lg animate-bounce w-full max-w-xs">
            <p className="font-bold text-sm text-white flex items-center justify-center gap-1">
              <CheckCircle className="w-5 h-5 text-emerald-200" />
              عالی بود! کلمه صحیح است!
            </p>
          </div>
        )}

        {/* Letter Wheel / Buttons */}
        <div className="flex gap-2 flex-wrap justify-center max-w-xs my-4">
          {current.letters.map((letter, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectLetter(letter, idx)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 hover:from-teal-600 hover:to-teal-700 text-white font-black text-lg border-2 border-slate-600 hover:border-teal-300 shadow-md transition active:scale-90"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex gap-2">
        <button
          onClick={handleClear}
          className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs border border-slate-700"
        >
          پاک کردن
        </button>
        <button
          onClick={nextLevel}
          className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black rounded-xl text-xs shadow-lg"
        >
          مرحله بعدی
        </button>
      </div>
    </div>
  );
};
