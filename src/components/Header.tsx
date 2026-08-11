import React from 'react';
import { Gamepad2, Globe, Coins, Diamond } from 'lucide-react';
import { UserProfile } from '../types/gamestan';

export type AppViewMode = 'webapp' | 'simulator';

interface HeaderProps {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  profile: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode, profile }) => {
  return (
    <header className="w-full bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md px-4 py-3" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
            🎮
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg text-white tracking-wide">گیمســتان</h1>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30">
                سامانه بازی‌های آنلاین
              </span>
            </div>
            <p className="text-[11px] text-slate-400">وب‌اپلیکیشن و شبیه‌ساز اختصاصی بازی‌ها</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setViewMode('webapp')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'webapp'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            وب‌اپلیکیشن (Web App)
          </button>

          <button
            onClick={() => setViewMode('simulator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'simulator'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            شبیه‌ساز موبایل (Mobile App)
          </button>
        </div>

        {/* Balance Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{profile.coins.toLocaleString('fa-IR')}</span>
          </div>

          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/20 flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <Diamond className="w-4 h-4 text-cyan-400" />
            <span>{profile.gems.toLocaleString('fa-IR')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
