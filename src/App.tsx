import React, { useState } from 'react';
import { GameType, UserProfile } from './types/gamestan';
import { Header, AppViewMode } from './components/Header';
import { MobileFrame } from './components/MobileFrame';
import { WebAppView } from './components/WebAppView';

const initialProfile: UserProfile = {
  name: 'بازیکن گیمستان',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  coins: 1450,
  gems: 85,
  level: 12,
  xp: 750,
  nextLevelXp: 1000,
  rank: 'استاد لیگ طلایی',
  leaguePoints: 1840,
  stats: {
    chessWins: 24,
    othelloWins: 18,
    sudokuSolved: 32,
    puzzleSolved: 15,
    quizScore: 2100,
    wordsFound: 45
  }
};

export default function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('webapp');
  const [activeScreen, setActiveScreen] = useState<GameType>('home');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <Header viewMode={viewMode} setViewMode={setViewMode} profile={profile} />

      {/* Navigation Sub-Banner */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 py-2 px-4 text-xs" dir="rtl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-amber-400 font-bold">سامانه گیمستان:</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300">نسخه اصلی وب و آنلاین</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveScreen('chess'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${activeScreen === 'chess' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              شطرنج
            </button>
            <button
              onClick={() => { setActiveScreen('othello'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${activeScreen === 'othello' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              اتلو
            </button>
            <button
              onClick={() => { setActiveScreen('sudoku'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${activeScreen === 'sudoku' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              سودوکو
            </button>
            <button
              onClick={() => { setActiveScreen('puzzle'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${activeScreen === 'puzzle' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              پازل
            </button>
            <button
              onClick={() => { setActiveScreen('word'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${activeScreen === 'word' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              کلمات
            </button>
            <button
              onClick={() => { setActiveScreen('quiz'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${activeScreen === 'quiz' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              کوییز
            </button>
            <button
              onClick={() => { setActiveScreen('gardoone'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${activeScreen === 'gardoone' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              گردونه
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 md:p-4 flex flex-col">
        {viewMode === 'webapp' && (
          <WebAppView
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
            profile={profile}
            setProfile={setProfile}
          />
        )}

        {viewMode === 'simulator' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <MobileFrame
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
              profile={profile}
              setProfile={setProfile}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3 px-4 text-center text-xs text-slate-500" dir="rtl">
        <p>پروژه وب‌اپلیکیشن و بازی‌های آنلاین گیمستان • تمامی حقوق محفوظ است</p>
      </footer>
    </div>
  );
}
