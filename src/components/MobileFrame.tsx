import React from 'react';
import { GameType, UserProfile } from '../types/gamestan';
import { Home, Gamepad2, Sparkles, User, ArrowRight, Battery, Wifi, Signal } from 'lucide-react';
import { ChessView } from './games/ChessView';
import { OthelloView } from './games/OthelloView';
import { GardooneView } from './games/GardooneView';
import { PuzzleView } from './games/PuzzleView';
import { SudokuView } from './games/SudokuView';
import { WordView } from './games/WordView';
import { QuizView } from './games/QuizView';
import { ProfileView } from './games/ProfileView';
import { ChatFriendsView } from './games/ChatFriendsView';
import { HomeHubView } from './games/HomeHubView';

interface MobileFrameProps {
  activeScreen: GameType;
  setActiveScreen: (screen: GameType) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  activeScreen,
  setActiveScreen,
  profile,
  setProfile
}) => {
  const handleReward = (coins: number, gems: number) => {
    setProfile(prev => ({
      ...prev,
      coins: prev.coins + coins,
      gems: prev.gems + gems
    }));
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'chess':
        return <ChessView />;
      case 'othello':
        return <OthelloView />;
      case 'gardoone':
        return <GardooneView onReward={handleReward} />;
      case 'puzzle':
        return <PuzzleView />;
      case 'sudoku':
        return <SudokuView />;
      case 'word':
        return <WordView />;
      case 'quiz':
        return <QuizView />;
      case 'profile':
        return <ProfileView profile={profile} />;
      case 'chat':
        return <ChatFriendsView />;
      case 'home':
      default:
        return <HomeHubView onSelectGame={setActiveScreen} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Phone Outer Shell */}
      <div className="w-[360px] h-[720px] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-4 border-slate-800 relative flex flex-col overflow-hidden">
        {/* Speaker & Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center gap-2">
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
        </div>

        {/* Top Android Status Bar */}
        <div className="w-full pt-1 px-4 pb-1 text-slate-400 text-[10px] font-mono flex items-center justify-between z-20 select-none bg-slate-950">
          <span>14:30</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-slate-300 fill-slate-300" />
          </div>
        </div>

        {/* Navigation Bar Top (If inside a game, show back button) */}
        {activeScreen !== 'home' && (
          <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between border-b border-slate-800 text-xs font-bold text-white z-20" dir="rtl">
            <button
              onClick={() => setActiveScreen('home')}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت به خانه
            </button>
            <span className="text-slate-400 font-mono text-[11px]">صفحه {activeScreen}</span>
          </div>
        )}

        {/* Screen Content Container */}
        <div className="flex-1 w-full bg-slate-950 overflow-hidden relative">
          {renderScreen()}
        </div>

        {/* Bottom AppShell TabBar */}
        <div className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 p-1.5 flex items-center justify-around z-20 select-none" dir="rtl">
          <button
            onClick={() => setActiveScreen('home')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              activeScreen === 'home' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-bold">اصلی</span>
          </button>

          <button
            onClick={() => setActiveScreen('chess')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              activeScreen === 'chess' || activeScreen === 'othello' || activeScreen === 'sudoku'
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="text-[10px] font-bold">بازی‌ها</span>
          </button>

          <button
            onClick={() => setActiveScreen('gardoone')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              activeScreen === 'gardoone' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold">گردونه</span>
          </button>

          <button
            onClick={() => setActiveScreen('profile')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              activeScreen === 'profile' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px] font-bold">پروفایل</span>
          </button>
        </div>

        {/* Android Navigation Indicator Bar */}
        <div className="w-full py-1 bg-slate-950 flex items-center justify-center">
          <div className="w-28 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
