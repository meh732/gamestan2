import React, { useEffect } from 'react';
import { GameType, UserProfile } from '../types/gamestan';
import { ChessView } from './games/ChessView';
import { OthelloView } from './games/OthelloView';
import { SudokuView } from './games/SudokuView';
import { PuzzleView } from './games/PuzzleView';
import { WordView } from './games/WordView';
import { QuizView } from './games/QuizView';
import { GardooneView } from './games/GardooneView';
import { ProfileView } from './games/ProfileView';
import { ChatFriendsView } from './games/ChatFriendsView';
import { HomeHubView } from './games/HomeHubView';
import { webOnlineManager } from '../services/webOnlineManager';
import { Gamepad2, Award, Users, Sparkles, MessageCircle, Trophy, Zap, Shield, ChevronLeft } from 'lucide-react';

interface WebAppViewProps {
  activeScreen: GameType;
  setActiveScreen: (screen: GameType) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const WebAppView: React.FC<WebAppViewProps> = ({
  activeScreen,
  setActiveScreen,
  profile,
  setProfile
}) => {
  useEffect(() => {
    // 1. پاکسازی کش‌های قدیمی و به‌روزرسانی سرویس ورکر
    webOnlineManager.initCacheBusting();
    // 2. همگام‌سازی استایل و تم زنده آنلاین
    webOnlineManager.syncLatestTheme();
  }, []);
  const gameItems = [
    { id: 'home', title: 'صفحه اصلی هاب', icon: '🏠', badge: 'اصلی' },
    { id: 'chess', title: 'بازی شطرنج آنلاین', icon: '♟️', badge: 'داغ' },
    { id: 'othello', title: 'اتلو (ریورسی)', icon: '⚪', badge: 'جدید' },
    { id: 'gardoone', title: 'گردونه شانس', icon: '🎡', badge: 'جایزه' },
    { id: 'sudoku', title: 'جدول سودوکو', icon: '🔢', badge: 'فکری' },
    { id: 'puzzle', title: 'پازل تصویری', icon: '🧩', badge: 'سرگرمی' },
    { id: 'word', title: 'کلمات فارسی', icon: '🔤', badge: 'ادبی' },
    { id: 'quiz', title: 'کوییز و اطلاعات عمومی', icon: '❓', badge: 'رقابتی' },
    { id: 'profile', title: 'پروفایل و آمار', icon: '👤', badge: 'حساب' },
    { id: 'chat', title: 'چت روم و دوستان', icon: '💬', badge: 'اجتماعی' },
  ];

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row gap-4 bg-slate-950 text-slate-100 rounded-2xl p-2 md:p-4 border border-slate-800 shadow-2xl" dir="rtl">
      {/* Sidebar Game Selector */}
      <div className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <span className="font-extrabold text-sm text-amber-400">وب‌اپلیکیشن گیمستان</span>
          </div>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
            نسخه وب
          </span>
        </div>

        {/* User Mini Card */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
          <img src={profile.avatar} alt={profile.name} className="w-10 h-10 rounded-full object-cover border-2 border-amber-500" />
          <div className="flex-1 overflow-hidden">
            <h4 className="font-extrabold text-xs text-white truncate">{profile.name}</h4>
            <p className="text-[11px] text-amber-400 font-bold">{profile.rank}</p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 space-y-1 overflow-y-auto max-h-[500px]">
          {gameItems.map(item => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id as GameType)}
                className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-between group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400 group-hover:text-amber-300'
                }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-[11px] space-y-1.5 text-slate-400">
          <div className="flex justify-between items-center">
            <span>سطح حساب:</span>
            <span className="text-amber-400 font-extrabold">{profile.level}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>امتیاز لیگ:</span>
            <span className="text-cyan-400 font-extrabold">{profile.leaguePoints}</span>
          </div>
        </div>
      </div>

      {/* Game Content View Area */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto flex flex-col justify-start">
        {activeScreen === 'home' && <HomeHubView onSelectGame={setActiveScreen} setActiveScreen={setActiveScreen} />}
        {activeScreen === 'chess' && <ChessView />}
        {activeScreen === 'othello' && <OthelloView />}
        {activeScreen === 'sudoku' && <SudokuView />}
        {activeScreen === 'puzzle' && <PuzzleView />}
        {activeScreen === 'word' && <WordView />}
        {activeScreen === 'quiz' && <QuizView />}
        {activeScreen === 'gardoone' && <GardooneView />}
        {activeScreen === 'profile' && <ProfileView profile={profile} />}
        {activeScreen === 'chat' && <ChatFriendsView />}
        {activeScreen === 'friends' && <ChatFriendsView />}
      </div>
    </div>
  );
};
