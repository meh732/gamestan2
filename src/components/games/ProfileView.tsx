import React from 'react';
import { UserProfile } from '../../types/gamestan';
import { Coins, Diamond, ShieldCheck, Trophy, Award, Star, Zap, Settings } from 'lucide-react';

export const ProfileView: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-3 select-none overflow-y-auto" dir="rtl">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-br from-indigo-900/80 via-slate-900 to-slate-900 p-4 rounded-2xl border border-indigo-500/30 shadow-2xl relative mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-lg">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
              سطح {profile.level}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
              <span>{profile.name}</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-amber-400 font-bold mt-0.5">{profile.rank}</p>

            {/* XP Bar */}
            <div className="mt-2 w-full">
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>پیشرفت سطح</span>
                <span>{profile.xp} / {profile.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                  style={{ width: `${(profile.xp / profile.nextLevelXp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Balance Row */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
          <div className="bg-slate-900/90 p-2 rounded-xl border border-amber-500/20 flex items-center justify-between">
            <span className="text-xs text-slate-400">سکه‌ها:</span>
            <div className="flex items-center gap-1 text-amber-400 font-black text-xs">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{profile.coins.toLocaleString('fa-IR')}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-2 rounded-xl border border-cyan-500/20 flex items-center justify-between">
            <span className="text-xs text-slate-400">الماس‌ها:</span>
            <div className="flex items-center gap-1 text-cyan-400 font-black text-xs">
              <Diamond className="w-4 h-4 text-cyan-400" />
              <span>{profile.gems.toLocaleString('fa-IR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* League & Stats Grid */}
      <div className="space-y-3">
        {/* League Card */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 p-3 rounded-2xl border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-xs font-bold text-amber-300">لیگ طلایی گیمستان</p>
              <p className="text-[10px] text-slate-400">رتبه در جدول: ۳۴ام کشوری</p>
            </div>
          </div>
          <div className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-extrabold border border-amber-500/30">
            {profile.leaguePoints} امتیاز
          </div>
        </div>

        {/* Game Stats */}
        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
          <h4 className="font-extrabold text-xs text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            آمار بازی‌های شما
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/60 p-2 rounded-xl flex justify-between">
              <span className="text-slate-400">برد شطرنج:</span>
              <span className="font-bold text-slate-100">{profile.stats.chessWins}</span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl flex justify-between">
              <span className="text-slate-400">برد اتلو:</span>
              <span className="font-bold text-slate-100">{profile.stats.othelloWins}</span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl flex justify-between">
              <span className="text-slate-400">سودوکو حل شده:</span>
              <span className="font-bold text-slate-100">{profile.stats.sudokuSolved}</span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl flex justify-between">
              <span className="text-slate-400">کلمات کشف شده:</span>
              <span className="font-bold text-slate-100">{profile.stats.wordsFound}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
