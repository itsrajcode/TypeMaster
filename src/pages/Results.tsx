import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LineChart, Line,
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { Trophy, RotateCcw, Home, Flag, Zap, Target, AlertTriangle, Clock, Flame } from 'lucide-react';
import { TestResult } from '../types/testTypes';

// ── Performance badge ───────────────────────────────────────────────
const getPerformanceBadge = (wpm: number, accuracy: number, rank: number, gaveUp: boolean) => {
  if (gaveUp) {
    return {
      emoji: '🏳️',
      title: 'Practice Lap Incomplete',
      color: 'from-amber-500 to-orange-600',
      desc: 'You exited the race early, but every keystroke counts! Review your progress below.',
    };
  }
  if (rank === 1) {
    return {
      emoji: '🏆',
      title: 'Grand Prix Champion (1st Place)',
      color: 'from-yellow-400 via-amber-500 to-orange-600',
      desc: 'Outstanding speed! You crossed the finish line ahead of every competitor!',
    };
  }
  if (rank === 2) {
    return {
      emoji: '🥈',
      title: 'Podium Finisher (2nd Place)',
      color: 'from-slate-300 via-gray-400 to-zinc-600',
      desc: 'Tremendous race pace! Just shy of the top spot!',
    };
  }
  if (rank === 3) {
    return {
      emoji: '🥉',
      title: 'Bronze Finisher (3rd Place)',
      color: 'from-amber-700 via-orange-800 to-amber-900',
      desc: 'Solid effort on the circuit! Keep pushing your limits!',
    };
  }
  if (wpm >= 60 && accuracy >= 90) {
    return {
      emoji: '⚡',
      title: 'High Velocity Racer',
      color: 'from-purple-500 to-indigo-600',
      desc: 'Great speed and control throughout the course!',
    };
  }
  return {
    emoji: '🏎️',
    title: 'Race Completed',
    color: 'from-blue-500 to-cyan-600',
    desc: 'Good consistency! Practice more to climb the leaderboard rankings.',
  };
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string | number;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium">Second {label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = (location.state as TestResult) || {
    wpm: 0,
    errors: 0,
    totalMistakes: 0,
    accuracy: 0,
    category: 'General',
    difficulty: 'medium',
    timeElapsed: 0,
    charsTyped: 0,
    totalChars: 0,
    completionPercent: 0,
    gaveUp: false,
    timeline: [],
    segmentAccuracies: [],
    maxStreak: 0,
    playerRank: 4,
    bots: [],
  };

  const {
    wpm,
    errors,
    totalMistakes,
    accuracy,
    category,
    difficulty,
    timeElapsed,
    charsTyped,
    totalChars,
    completionPercent,
    gaveUp,
    timeline,
    segmentAccuracies,
    maxStreak,
    playerRank,
    bots,
  } = result;

  const badge = getPerformanceBadge(wpm, accuracy, playerRank, gaveUp);

  // Timeline points for charts
  const chartTimeline = useMemo(() => {
    if (!timeline || timeline.length === 0) {
      return [
        { second: 0, wpm: 0, errors: 0, accuracy: 100 },
        { second: Math.max(1, timeElapsed), wpm, errors, accuracy },
      ];
    }
    return [{ second: 0, wpm: 0, errors: 0, accuracy: 100 }, ...timeline];
  }, [timeline, wpm, errors, accuracy, timeElapsed]);

  const segData = useMemo(() => {
    if (!segmentAccuracies || segmentAccuracies.length === 0) {
      return [
        { segment: '0–25%', accuracy, errors: Math.round(errors * 0.3) },
        { segment: '25–50%', accuracy, errors: Math.round(errors * 0.3) },
        { segment: '50–75%', accuracy, errors: Math.round(errors * 0.2) },
        { segment: '75–100%', accuracy, errors: Math.round(errors * 0.2) },
      ];
    }
    return segmentAccuracies;
  }, [segmentAccuracies, accuracy, errors]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Full race leaderboard
  const leaderboard = useMemo(() => {
    const list = [
      {
        id: 'player',
        name: 'YOU (Player)',
        wpm: Math.round(wpm),
        progress: completionPercent,
        isPlayer: true,
        finishTime: gaveUp ? null : timeElapsed,
        rank: playerRank,
      },
      ...bots.map(b => ({
        id: b.id,
        name: b.name,
        wpm: Math.round(b.wpm),
        progress: Math.round(b.progress),
        isPlayer: false,
        finishTime: b.finishTime,
        rank: b.rank || 4,
      })),
    ];
    list.sort((a, b) => (a.rank || 4) - (b.rank || 4));
    return list;
  }, [wpm, completionPercent, timeElapsed, gaveUp, playerRank, bots]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900 py-10 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ── Give Up Notice if test was abandoned mid-way ───────── */}
        {gaveUp && (
          <div className="bg-amber-500/10 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Flag className="w-6 h-6 flex-shrink-0" />
            </div>
            <div>
              <p className="font-bold text-amber-800 dark:text-amber-200 text-base">
                Race abandoned at {completionPercent}% completion (Position: #{playerRank})
              </p>
              <p className="text-sm text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                You typed {charsTyped} of {totalChars} characters before stopping. All statistics and graphs below reflect your actual typed performance.
              </p>
            </div>
          </div>
        )}

        {/* ── Performance & Placement Banner ──────────────────────── */}
        <div className={`bg-gradient-to-r ${badge.color} rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden`}>
          <div className="text-6xl mb-3 animate-bounce">{badge.emoji}</div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">{badge.title}</h1>
          <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto">{badge.desc}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <span className="bg-black/20 backdrop-blur-md rounded-full px-3.5 py-1">
              Category: {category}
            </span>
            <span className="bg-black/20 backdrop-blur-md rounded-full px-3.5 py-1 capitalize">
              Mode: {difficulty}
            </span>
            <span className="bg-black/20 backdrop-blur-md rounded-full px-3.5 py-1">
              {gaveUp ? `${completionPercent}% completed` : '100% Course Finished'}
            </span>
          </div>
        </div>

        {/* ── Key Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {[
            {
              icon: Zap,
              label: 'Speed (WPM)',
              value: Math.round(wpm),
              color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 ring-purple-200 dark:ring-purple-800',
              iconC: 'text-purple-500',
            },
            {
              icon: Target,
              label: 'Accuracy',
              value: `${Math.round(accuracy)}%`,
              color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-800',
              iconC: 'text-blue-500',
            },
            {
              icon: AlertTriangle,
              label: 'Mismatches',
              value: errors,
              color: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 ring-rose-200 dark:ring-rose-800',
              iconC: 'text-rose-500',
            },
            {
              icon: Flame,
              label: 'Total Mistakes',
              value: totalMistakes || errors,
              color: 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 ring-orange-200 dark:ring-orange-800',
              iconC: 'text-orange-500',
            },
            {
              icon: Clock,
              label: 'Time Taken',
              value: formatTime(timeElapsed),
              color: 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 ring-cyan-200 dark:ring-cyan-800',
              iconC: 'text-cyan-500',
            },
          ].map(({ icon: Icon, label, value, color, iconC }) => (
            <div
              key={label}
              className={`${color} ring-1 rounded-2xl p-4 text-center shadow-sm transition-all hover:scale-105`}
            >
              <Icon className={`w-5 h-5 ${iconC} mx-auto mb-1.5`} />
              <div className="text-2xl font-black tabular-nums">{value}</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-75 mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Race Leaderboard Grid ──────────────────────────────── */}
        <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-200/80 dark:border-gray-700/80">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> Grand Prix Leaderboard
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 text-xs font-semibold uppercase">
                  <th className="pb-3 px-3">Position</th>
                  <th className="pb-3 px-3">Racer</th>
                  <th className="pb-3 px-3">Speed (WPM)</th>
                  <th className="pb-3 px-3">Progress</th>
                  <th className="pb-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 font-medium">
                {leaderboard.map(racer => (
                  <tr
                    key={racer.id}
                    className={`transition-colors ${
                      racer.isPlayer
                        ? 'bg-purple-100/60 dark:bg-purple-950/40 font-bold'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-black ${
                          racer.rank === 1
                            ? 'bg-yellow-400 text-black'
                            : racer.rank === 2
                            ? 'bg-slate-300 text-black'
                            : racer.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        #{racer.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span>{racer.name}</span>
                      {racer.isPlayer && (
                        <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.2 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-purple-600 dark:text-purple-400 font-bold">
                      {racer.wpm} WPM
                    </td>
                    <td className="py-3 px-3">{racer.progress}%</td>
                    <td className="py-3 px-3">
                      {racer.isPlayer && gaveUp ? (
                        <span className="text-amber-500 font-semibold">Gave Up</span>
                      ) : racer.progress >= 100 ? (
                        <span className="text-emerald-500 font-semibold">
                          Finished {racer.finishTime ? `(${racer.finishTime}s)` : ''}
                        </span>
                      ) : (
                        <span className="text-gray-400">Racing</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MULTIPLE GRAPHS ─────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Chart 1: WPM Over Time */}
          <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-200/80 dark:border-gray-700/80">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" /> Graph 1: WPM Acceleration Timeline
            </h2>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={chartTimeline} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis
                  dataKey="second"
                  label={{ value: 'Second', position: 'insideBottom', offset: -2, fill: '#9ca3af' }}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  name="Typing Speed (WPM)"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Errors Over Time */}
          <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-200/80 dark:border-gray-700/80">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Graph 2: Keystroke Errors Progression
            </h2>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={chartTimeline} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="second"
                  label={{ value: 'Second', position: 'insideBottom', offset: -2, fill: '#9ca3af' }}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="errors"
                  name="Current Errors"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fill="url(#errorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3: Accuracy by Segment */}
          <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-200/80 dark:border-gray-700/80">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" /> Graph 3: Accuracy by Course Sector (Quarters)
            </h2>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={segData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="segment" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 12 }} unit="%" />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Accuracy']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                />
                <Legend wrapperStyle={{ paddingTop: '8px' }} />
                <Bar dataKey="accuracy" name="Sector Accuracy %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div className="flex justify-center gap-4 pb-12 pt-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
              rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105 shadow border border-gray-200 dark:border-gray-700"
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button
            onClick={() => navigate('/practice', { state: { difficulty } })}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white
              rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" /> Race Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
