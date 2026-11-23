import React from 'react';
import { BotRacer } from '../types/testTypes';
import { Flag, Trophy } from 'lucide-react';

interface RaceTrackProps {
  playerProgress: number; // 0 to 100
  playerWpm: number;
  playerRank: number;
  bots: BotRacer[];
  started: boolean;
  difficulty: string;
}

// Crisp stylized SVG Car component with custom colors and glowing headlights
const RaceCar: React.FC<{
  color: string;
  isPlayer?: boolean;
  name: string;
  wpm: number;
  rank?: number;
  isFinished?: boolean;
}> = ({ color, isPlayer, name, wpm, rank, isFinished }) => {
  return (
    <div className="relative flex items-center group">
      {/* Floating Info Tag */}
      <div
        className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-bold shadow-md transition-all flex items-center gap-1 ${
          isPlayer
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white ring-2 ring-purple-300 dark:ring-purple-400 z-20 scale-105'
            : 'bg-gray-800/90 text-gray-200 border border-gray-700 z-10'
        }`}
      >
        {isFinished ? (
          <span className="text-yellow-400">🏁 Done</span>
        ) : (
          <>
            {isPlayer && <span className="text-amber-300">★</span>}
            <span>{name}</span>
            <span className="opacity-80">· {Math.round(wpm)} WPM</span>
            {rank && (
              <span
                className={`ml-0.5 px-1 rounded text-[10px] ${
                  rank === 1
                    ? 'bg-yellow-400 text-black'
                    : rank === 2
                    ? 'bg-slate-300 text-black'
                    : rank === 3
                    ? 'bg-amber-700 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                #{rank}
              </span>
            )}
          </>
        )}
      </div>

      {/* Car SVG Graphic */}
      <div className={`relative transition-transform duration-300 ${isPlayer ? 'scale-110 drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]' : 'drop-shadow-md'}`}>
        <svg
          viewBox="0 0 70 28"
          className="w-14 sm:w-16 h-7 sm:h-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Exhaust glow when moving */}
          {wpm > 0 && (
            <ellipse
              cx="4"
              cy="18"
              rx="4"
              ry="2"
              fill={isPlayer ? '#a855f7' : '#f97316'}
              className="animate-pulse opacity-80"
            />
          )}

          {/* Car Body Base */}
          <path
            d="M 6 18 Q 8 13 14 13 L 26 13 Q 32 8 40 8 L 52 8 Q 62 9 66 16 L 68 18 Q 68 21 64 21 L 10 21 Q 6 21 6 18 Z"
            fill={color}
          />

          {/* Windshield & Cabin */}
          <path
            d="M 28 13 L 38 9 L 50 9 L 52 13 Z"
            fill="#1e293b"
            stroke="#94a3b8"
            strokeWidth="0.8"
          />

          {/* Roof spoiler for sports feel */}
          <path d="M 8 14 L 14 10 L 16 10 L 10 14 Z" fill="#0f172a" />

          {/* Headlights */}
          <ellipse cx="66" cy="16" rx="2" ry="1.5" fill="#fef08a" />
          {/* Headlight beam */}
          <path d="M 67 15 L 75 13 L 75 19 L 67 17 Z" fill="#fef08a" opacity="0.3" />

          {/* Wheels */}
          {/* Rear Wheel */}
          <circle cx="18" cy="20" r="5" fill="#0f172a" stroke="#64748b" strokeWidth="1.2" />
          <circle cx="18" cy="20" r="2.5" fill="#e2e8f0" />
          {/* Front Wheel */}
          <circle cx="54" cy="20" r="5" fill="#0f172a" stroke="#64748b" strokeWidth="1.2" />
          <circle cx="54" cy="20" r="2.5" fill="#e2e8f0" />

          {/* Racing Stripe */}
          <path
            d="M 12 16 L 64 16"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity={isPlayer ? 0.9 : 0.6}
          />
        </svg>
      </div>
    </div>
  );
};

export const RaceTrack: React.FC<RaceTrackProps> = ({
  playerProgress,
  playerWpm,
  playerRank,
  bots,
  started,
  difficulty,
}) => {
  // Combine player & bots to determine positions
  const allRacers = [
    {
      id: 'player',
      name: 'YOU',
      color: '#8b5cf6', // Electric Purple
      progress: Math.min(100, Math.max(0, playerProgress)),
      wpm: playerWpm,
      isPlayer: true,
      rank: playerRank,
      isFinished: playerProgress >= 100,
    },
    ...bots.map(b => ({
      id: b.id,
      name: b.name,
      color: b.color,
      progress: Math.min(100, Math.max(0, b.progress)),
      wpm: b.wpm,
      isPlayer: false,
      rank: b.rank,
      isFinished: (b.progress >= 100) || (b.finishTime !== null),
    })),
  ];

  return (
    <div className="w-full bg-slate-900 border-b border-purple-500/30 text-white shadow-2xl relative overflow-hidden">
      {/* Top track header with mode and rank status */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${started ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${started ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-bold tracking-wider uppercase text-slate-300">
            {started ? 'Race In Progress' : 'Grid Ready — Start Typing to Race!'}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-purple-400 font-medium capitalize">
            Mode: {difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-slate-300">Your Rank:</span>
            <span className={`font-black ${
              playerRank === 1 ? 'text-yellow-400' : playerRank === 2 ? 'text-slate-300' : 'text-purple-400'
            }`}>
              {playerRank === 1 ? '1st Place 🏆' : playerRank === 2 ? '2nd Place 🥈' : playerRank === 3 ? '3rd Place 🥉' : '4th Place'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <Flag className="w-3.5 h-3.5 text-rose-400" />
            <span>Finish Line: 100%</span>
          </div>
        </div>
      </div>

      {/* The 4-Lane Horizontal Highway Race Track */}
      <div className="relative py-3 px-4 sm:px-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Asphalt road texture & Distance markers */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Start Line Grid */}
        <div className="absolute top-0 bottom-0 left-6 sm:left-14 w-3 border-r-2 border-white/30 flex flex-col justify-around py-1 pointer-events-none">
          <div className="text-[9px] text-slate-500 font-mono -rotate-90 origin-left translate-x-2">START</div>
        </div>

        {/* Finish Line (Checkered pattern) */}
        <div className="absolute top-0 bottom-0 right-4 sm:right-8 w-6 bg-[repeating-conic-gradient(#000_0%_25%,#fff_0%_50%)] [background-size:8px_8px] opacity-80 border-l-2 border-yellow-400 z-10 shadow-lg flex items-center justify-center">
          <span className="text-[10px] font-black bg-black/80 px-1 py-0.5 rounded text-yellow-400 shadow -rotate-90">
            FINISH
          </span>
        </div>

        {/* Lanes Container */}
        <div className="space-y-3 relative z-0 pl-4 sm:pl-10 pr-10 sm:pr-14">
          {allRacers.map((racer, laneIdx) => {
            // Calculate clamped percentage so car stays within the track boundaries smoothly
            const progress = racer.progress;
            // Car width is ~64px, translate appropriately
            return (
              <div
                key={racer.id}
                className={`relative h-11 flex items-center rounded-lg px-2 transition-colors ${
                  racer.isPlayer
                    ? 'bg-purple-950/30 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'bg-slate-950/40 border border-slate-800/80'
                }`}
              >
                {/* Lane number and center dash line */}
                <span className="absolute left-1 text-[10px] font-mono font-bold text-slate-600 select-none">
                  L{laneIdx + 1}
                </span>

                {/* Road dashed centerline */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-b border-dashed border-slate-800/80 pointer-events-none" />

                {/* Car moving along the lane */}
                <div
                  className="absolute transition-all duration-200 ease-out will-change-[left]"
                  style={{
                    left: `calc(1.5rem + ${progress * 0.88}%)`,
                  }}
                >
                  <RaceCar
                    color={racer.color}
                    isPlayer={racer.isPlayer}
                    name={racer.name}
                    wpm={racer.wpm}
                    rank={racer.rank}
                    isFinished={racer.isFinished}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RaceTrack;
