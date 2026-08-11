import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: 'در بازی شطرنج کدام مهره می‌تواند از روی بقیه مهره‌ها بپرد؟',
    options: ['رخ', 'اسب', 'فیل', 'وزیر'],
    correct: 1
  },
  {
    id: 2,
    question: 'بازی اتلو (Othello) به چه اسم دیگری شناخته می‌شود؟',
    options: ['ریورسی (Reversi)', 'چکرز', 'دوز', 'تخته نرد'],
    correct: 0
  },
  {
    id: 3,
    question: 'تعداد خانه‌های جدول سودوکو استاندارد چند خانه است؟',
    options: ['۶۴ خانه', '۸۱ خانه', '۱۰۰ خانه', '۴۹ خانه'],
    correct: 1
  }
];

export const QuizView: React.FC = () => {
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const currentQ = quizQuestions[qIndex];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQ.correct) {
      setScore(s => s + 100);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setQIndex((qIndex + 1) % quizQuestions.length);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none justify-between" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-base">
            ❓
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-100">کوییز گیمستان (QuizMobail)</h3>
            <p className="text-[10px] text-slate-400">سوال {qIndex + 1} از {quizQuestions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 text-amber-300 font-bold text-xs">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{score} امتیاز</span>
        </div>
      </div>

      {/* Question Box */}
      <div className="my-auto space-y-4">
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-xl text-center">
          <p className="font-extrabold text-sm text-slate-100 leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';

            if (selectedOption !== null) {
              if (idx === currentQ.correct) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-extrabold';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-600 text-white border-rose-400';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold border transition flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {selectedOption !== null && idx === currentQ.correct && (
                  <CheckCircle className="w-4 h-4 text-emerald-200" />
                )}
                {selectedOption !== null && idx === selectedOption && idx !== currentQ.correct && (
                  <XCircle className="w-4 h-4 text-rose-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <button
        onClick={handleNext}
        disabled={selectedOption === null}
        className={`w-full py-3 rounded-xl font-bold text-xs transition ${
          selectedOption !== null
            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        سوال بعدی ➔
      </button>
    </div>
  );
};
