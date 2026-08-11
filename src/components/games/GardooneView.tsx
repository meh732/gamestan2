import React, { useState } from 'react';
import { Sparkles, Trophy, Coins, Diamond } from 'lucide-react';

interface Prize {
  id: number;
  label: string;
  color: string;
  icon: string;
  type: 'coin' | 'gem' | 'empty';
  amount: number;
}

const prizes: Prize[] = [
  { id: 1, label: '۵۰ سکه', color: 'from-amber-500 to-yellow-600', icon: '🪙', type: 'coin', amount: 50 },
  { id: 2, label: '۱۰ الماس', color: 'from-cyan-500 to-blue-600', icon: '💎', type: 'gem', amount: 10 },
  { id: 3, label: '۱۰۰ سکه', color: 'from-amber-600 to-yellow-500', icon: '🪙', type: 'coin', amount: 100 },
  { id: 4, label: 'پوچ!', color: 'from-slate-600 to-slate-700', icon: '💨', type: 'empty', amount: 0 },
  { id: 5, label: '۲۵۰ سکه', color: 'from-amber-500 to-orange-600', icon: '🪙', type: 'coin', amount: 250 },
  { id: 6, label: '۵ الماس', color: 'from-indigo-500 to-cyan-600', icon: '💎', type: 'gem', amount: 5 },
  { id: 7, label: '۵۰۰ سکه', color: 'from-purple-600 to-pink-600', icon: '💰', type: 'coin', amount: 500 },
  { id: 8, label: '۵۰ الماس!', color: 'from-rose-500 to-red-600', icon: '👑', type: 'gem', amount: 50 }
];

export const GardooneView: React.FC<{ onReward?: (coins: number, gems: number) => void }> = ({ onReward }) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    // Random turns + random angle
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + 1800 + extraDegrees; // 5 full turns + offset
    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualAngle = (360 - (totalRotation % 360)) % 360;
      const index = Math.floor(actualAngle / (360 / prizes.length));
      const prize = prizes[index];
      setWonPrize(prize);

      if (prize.amount > 0 && onReward) {
        if (prize.type === 'coin') onReward(prize.amount, 0);
        if (prize.type === 'gem') onReward(0, prize.amount);
      }
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-3 items-center justify-between select-none" dir="rtl">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-amber-600/30 via-purple-600/30 to-amber-600/30 p-3 rounded-2xl border border-amber-500/30 text-center shadow-lg">
        <h2 className="font-extrabold text-base text-amber-300 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          گردونه شانس گیمستان (gardoone)
        </h2>
        <p className="text-xs text-slate-300 mt-1">هر روز شانس خود را امتحان کنید و سکه و الماس برنده شوید!</p>
      </div>

      {/* Spinning Wheel Container */}
      <div className="relative my-auto flex items-center justify-center w-64 h-64 my-4">
        {/* Pointer indicator */}
        <div className="absolute -top-3 z-20 text-3xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] animate-bounce">
          🔻
        </div>

        {/* Wheel SVG */}
        <div
          className="w-full h-full rounded-full border-4 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] overflow-hidden relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1.05)' : 'none'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {prizes.map((p, i) => {
              const angle = 360 / prizes.length;
              const startAngle = i * angle;
              const endAngle = (i + 1) * angle;

              const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

              return (
                <path
                  key={p.id}
                  d={pathData}
                  fill={i % 2 === 0 ? '#1e293b' : '#0f172a'}
                  stroke="#f59e0b"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>

          {/* Labels layer */}
          {prizes.map((p, i) => {
            const angle = i * 45 + 22.5;
            return (
              <div
                key={p.id}
                className="absolute w-full h-full top-0 left-0 flex items-center justify-center text-xs font-bold pointer-events-none"
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <div className="translate-x-16 -rotate-90 flex items-center gap-1 text-[11px] font-extrabold text-amber-200 drop-shadow">
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`absolute z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-sm shadow-2xl border-4 border-slate-900 flex items-center justify-center transition hover:scale-110 active:scale-95 ${
            isSpinning ? 'opacity-75 cursor-not-allowed' : 'animate-pulse'
          }`}
        >
          {isSpinning ? '...' : 'چرخش'}
        </button>
      </div>

      {/* Prize Modal Banner */}
      {wonPrize && (
        <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-xl text-center shadow-xl border border-emerald-400/50 animate-fade-in">
          <p className="text-xs text-emerald-100">نتیجه گردونه شانس:</p>
          <p className="font-extrabold text-lg text-white mt-0.5 flex items-center justify-center gap-2">
            <span>{wonPrize.icon}</span>
            <span>{wonPrize.label}</span>
          </p>
        </div>
      )}

      {/* Spin Button Footer */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-sm shadow-xl transition active:scale-98 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5 text-slate-950" />
        {isSpinning ? 'در حال چرخش گردونه...' : 'چرخش رایگان روزانه'}
      </button>
    </div>
  );
};
