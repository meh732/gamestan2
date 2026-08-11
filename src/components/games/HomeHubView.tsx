import React from 'react';
import { GameType } from '../../types/gamestan';
import { Sparkles, Trophy, Users, Shield, Play } from 'lucide-react';

interface GameItem {
  id: GameType;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  category: string;
}

const gamesList: GameItem[] = [
  { id: 'chess', title: 'شطرنج تک‌نفره و آنلاین', subtitle: 'بازی استراتژیک', icon: '♟️', color: 'from-amber-600 to-amber-800', category: 'رقابتی و فکری' },
  { id: 'othello', title: 'اتلو (ریورسی)', subtitle: 'تخته کلاسی‌ک', icon: '●', color: 'from-emerald-600 to-emerald-800', category: 'استراتژیک' },
  { id: 'gardoone', title: 'گردونه شانس', subtitle: 'جوایز روزانه', icon: '🎰', color: 'from-purple-600 to-pink-600', category: 'جایزه‌دار' },
  { id: 'word', title: 'بازی کلمات', subtitle: 'حدس واژه‌ها', icon: '🔤', color: 'from-teal-600 to-cyan-800', category: 'ادبی و تمرکزی' },
  { id: 'sudoku', title: 'سودوکو', subtitle: 'جدول اعداد', icon: '🔢', color: 'from-blue-600 to-indigo-800', category: 'ریاضی و هوش' },
  { id: 'puzzle', title: 'پازل تصویری', subtitle: 'چیدمان خانه', icon: '🧩', color: 'from-violet-600 to-purple-800', category: 'سرگرمی' },
  { id: 'quiz', title: 'کوییز و چیستان', subtitle: 'تست اطلاعات عمومی', icon: '❓', color: 'from-rose-600 to-red-800', category: 'مسابقه تلفنی' },
  { id: 'chat', title: 'چت و دوستان', subtitle: 'اتاق گفتگو', icon: '💬', color: 'from-indigo-600 to-blue-800', category: 'اجتماعی' }
];

interface HomeHubViewProps {
  onSelectGame?: (game: GameType) => void;
  setActiveScreen?: (game: GameType) => void;
}

export const HomeHubView: React.FC<HomeHubViewProps> = ({ onSelectGame, setActiveScreen }) => {
  const handleSelectGame = (game: GameType) => {
    if (onSelectGame) {
      onSelectGame(game);
    } else if (setActiveScreen) {
      setActiveScreen(game);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-3 select-none overflow-y-auto" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 p-3.5 rounded-2xl text-slate-950 font-black shadow-xl mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-950/20 px-2 py-0.5 rounded-md w-fit mb-1 text-amber-950">
            <Sparkles className="w-3.5 h-3.5" />
            سامانه آنلاین گیمستان
          </div>
          <h2 className="text-base font-black">به «گیمستان» خوش آمدید!</h2>
          <p className="text-[10px] font-bold opacity-90">مجموعه کامل بازی‌های آنلاین و فکری</p>
        </div>
        <button
          onClick={() => handleSelectGame('gardoone')}
          className="bg-slate-950 text-amber-300 p-2.5 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition flex flex-col items-center gap-0.5 text-[10px]"
        >
          <span className="text-xl">🎰</span>
          <span>گردونه</span>
        </button>
      </div>

      {/* Games Section */}
      <div className="mb-2">
        <h3 className="font-extrabold text-xs text-slate-300 mb-2 flex items-center gap-1.5">
          <span>🎮</span>
          <span>بازی‌های فعال گیمستان:</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {gamesList.map(game => (
            <button
              key={game.id}
              onClick={() => handleSelectGame(game.id)}
              className={`p-2.5 rounded-xl bg-gradient-to-br ${game.color} border border-white/10 shadow-lg text-right flex flex-col justify-between hover:scale-102 active:scale-98 transition group relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-2xl drop-shadow">{game.icon}</span>
                <div className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition">
                  <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-white drop-shadow">{game.title}</h4>
                <p className="text-[9px] text-white/80 font-bold mt-0.5">{game.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
