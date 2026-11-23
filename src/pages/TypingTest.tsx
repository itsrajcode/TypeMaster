import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Target, Clock, AlertTriangle, RotateCcw, Flag } from 'lucide-react';
import TextService from '../services/TextService';
import { DifficultyLevel } from '../data/practiceTexts';
import RaceTrack from '../components/RaceTrack';
import StreakBadge from '../components/StreakBadge';
import { TimelinePoint, SegmentAccuracy, BotRacer } from '../types/testTypes';

const MILESTONE_STREAKS = [10, 25, 50, 100, 200];

// Predefined bot speeds (WPM) and profiles by mode
const BOT_PROFILES: Record<
  DifficultyLevel,
  { id: string; name: string; color: string; carColorName: string; wpm: number }[]
> = {
  easy: [
    { id: 'bot-1', name: 'Speedy Fox', color: '#10b981', carColorName: 'Emerald', wpm: 32 },
    { id: 'bot-2', name: 'Thunder Bolt', color: '#eab308', carColorName: 'Gold', wpm: 26 },
    { id: 'bot-3', name: 'Cruiser Pip', color: '#f97316', carColorName: 'Orange', wpm: 19 },
  ],
  medium: [
    { id: 'bot-1', name: 'Apex Phantom', color: '#06b6d4', carColorName: 'Cyan', wpm: 58 },
    { id: 'bot-2', name: 'Turbo Drift', color: '#f59e0b', carColorName: 'Amber', wpm: 50 },
    { id: 'bot-3', name: 'Urban Cruiser', color: '#ec4899', carColorName: 'Pink', wpm: 42 },
  ],
  hard: [
    { id: 'bot-1', name: 'Hyper Cyber', color: '#38bdf8', carColorName: 'Neon Blue', wpm: 88 },
    { id: 'bot-2', name: 'Nitro Beast', color: '#ef4444', carColorName: 'Crimson', wpm: 78 },
    { id: 'bot-3', name: 'Shadow Vortex', color: '#c084fc', carColorName: 'Purple', wpm: 68 },
  ],
};

const TypingTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode / Difficulty (default from location state or medium)
  const initialDifficulty = (location.state?.difficulty as DifficultyLevel) || 'medium';
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);

  // ── Text state ────────────────────────────────────────────────────
  const [practiceText, setPracticeText] = useState<{ id: number; category: string; difficulty: DifficultyLevel; text: string }>({
    id: 0,
    category: '',
    difficulty: 'medium',
    text: '',
  });

  // ── Typing state ──────────────────────────────────────────────────
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  // ── Timing ────────────────────────────────────────────────────────
  const startTimeRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0); // seconds
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Stats ─────────────────────────────────────────────────────────
  const [wpm, setWpm] = useState(0);
  const [currentErrors, setCurrentErrors] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [milestone, setMilestone] = useState<number | null>(null);
  const prevMilestoneRef = useRef<number>(0);

  // ── Bot Racers State ──────────────────────────────────────────────
  const [bots, setBots] = useState<BotRacer[]>([]);

  // ── Timeline snapshots ────────────────────────────────────────────
  const timelineRef = useRef<TimelinePoint[]>([]);
  const snapshotInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Refs ──────────────────────────────────────────────────────────
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);

  // ── Initialize Text & Bots ────────────────────────────────────────
  const initTest = useCallback((selectedDiff: DifficultyLevel) => {
    const textService = TextService.getInstance();
    const txt = textService.getRandomText(selectedDiff);
    setPracticeText(txt);
    setInput('');
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setWpm(0);
    setCurrentErrors(0);
    setTotalMistakes(0);
    setAccuracy(100);
    setStreak(0);
    setMaxStreak(0);
    setMilestone(null);
    prevMilestoneRef.current = 0;
    timelineRef.current = [];

    // Initialize bots with their predefined speeds
    const profiles = BOT_PROFILES[selectedDiff];
    setBots(
      profiles.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color,
        carColorName: p.carColorName,
        wpm: p.wpm,
        progress: 0,
        finishTime: null,
      }))
    );

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    initTest(difficulty);
  }, [difficulty, initTest]);

  // ── Timer & Bot Progress Simulation ───────────────────────────────
  const stopTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (snapshotInterval.current) clearInterval(snapshotInterval.current);
  }, []);

  const startTimers = useCallback(() => {
    startTimeRef.current = Date.now();

    // High frequency update (100ms) for smooth race car movement and timer
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const currentElapsed = Math.max(0.1, (now - startTimeRef.current) / 1000);
      setElapsed(Math.floor(currentElapsed));

      // Update bot progress based on their predefined speed
      const totalChars = practiceText.text.length || 1;
      setBots(prevBots =>
        prevBots.map(bot => {
          if (bot.progress >= 100) return bot;
          // Bot speed in chars/second = (wpm * 5) / 60
          const charsTyped = (bot.wpm * 5 / 60) * currentElapsed;
          const progress = Math.min(100, (charsTyped / totalChars) * 100);
          const finishTime = progress >= 100 && bot.finishTime === null ? Math.round(currentElapsed) : bot.finishTime;
          return {
            ...bot,
            progress,
            finishTime,
          };
        })
      );
    }, 100);

    // Second-by-second snapshot for analytics charts
    snapshotInterval.current = setInterval(() => {
      const sec = Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000));
      setWpm(latestWpm => {
        setCurrentErrors(latestErr => {
          setAccuracy(latestAcc => {
            timelineRef.current.push({
              second: sec,
              wpm: latestWpm,
              errors: latestErr,
              accuracy: latestAcc,
            });
            return latestAcc;
          });
          return latestErr;
        });
        return latestWpm;
      });
    }, 1000);
  }, [practiceText.text.length]);

  // ── Calculate Live Player & Bot Ranks ─────────────────────────────
  const playerProgress = practiceText.text.length > 0 ? (input.length / practiceText.text.length) * 100 : 0;

  const { playerRank, rankedBots } = useMemo(() => {
    const list = [
      { id: 'player', progress: playerProgress },
      ...bots.map(b => ({ id: b.id, progress: b.progress })),
    ];
    // Sort descending by progress
    list.sort((a, b) => b.progress - a.progress);
    const pRank = list.findIndex(item => item.id === 'player') + 1;

    // Attach rank to bots
    const updatedBots = bots.map(b => {
      const r = list.findIndex(item => item.id === b.id) + 1;
      return { ...b, rank: r };
    });

    return { playerRank: pRank, rankedBots: updatedBots };
  }, [playerProgress, bots]);

  // ── Compute segment accuracies ────────────────────────────────────
  const computeSegments = useCallback((typedInput: string, fullText: string): SegmentAccuracy[] => {
    const segSize = Math.ceil(fullText.length / 4);
    const labels = ['0–25%', '25–50%', '50–75%', '75–100%'];
    return labels.map((label, i) => {
      const start = i * segSize;
      const end = Math.min((i + 1) * segSize, fullText.length);
      const segText = fullText.slice(start, end);
      const segInput = typedInput.slice(start, end);
      let errors = 0;
      for (let j = 0; j < segInput.length; j++) {
        if (segInput[j] !== segText[j]) errors++;
      }
      const acc = segInput.length > 0 ? Math.round(((segInput.length - errors) / segInput.length) * 100) : 100;
      return { segment: label, accuracy: acc, errors };
    });
  }, []);

  // ── Finish or Give Up Handlers ────────────────────────────────────
  const handleComplete = useCallback(
    (typedInput: string, gaveUp: boolean) => {
      stopTimers();
      setFinished(true);

      const timeElapsed = Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000));
      const words = typedInput.trim().split(/\s+/).filter(Boolean).length;
      const minutes = timeElapsed / 60;
      const finalWpm = minutes > 0 ? Math.round(words / minutes) : 0;

      let errs = 0;
      for (let i = 0; i < typedInput.length; i++) {
        if (typedInput[i] !== practiceText.text[i]) errs++;
      }
      const acc = typedInput.length > 0
        ? Math.round(((typedInput.length - errs) / typedInput.length) * 100)
        : 0;

      const completionPercent = Math.round((typedInput.length / practiceText.text.length) * 100);

      // Final snapshot
      timelineRef.current.push({
        second: timeElapsed,
        wpm: finalWpm,
        errors: errs,
        accuracy: acc,
      });

      navigate('/results', {
        state: {
          wpm: finalWpm,
          errors: errs,
          totalMistakes,
          accuracy: acc,
          category: practiceText.category,
          difficulty,
          timeElapsed,
          charsTyped: typedInput.length,
          totalChars: practiceText.text.length,
          completionPercent,
          gaveUp,
          timeline: timelineRef.current,
          segmentAccuracies: computeSegments(typedInput, practiceText.text),
          maxStreak,
          playerRank,
          bots: rankedBots,
        },
      });
    },
    [
      stopTimers,
      practiceText,
      totalMistakes,
      difficulty,
      maxStreak,
      playerRank,
      rankedBots,
      navigate,
      computeSegments,
    ]
  );

  // ── Input change handler ──────────────────────────────────────────
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (finished) return;
      const newInput = e.target.value;

      if (newInput.length > practiceText.text.length) return;

      if (!started) {
        setStarted(true);
        startTimers();
      }

      setInput(newInput);

      // Current errors
      let errCount = 0;
      for (let i = 0; i < newInput.length; i++) {
        if (newInput[i] !== practiceText.text[i]) errCount++;
      }
      setCurrentErrors(errCount);

      // Cumulative mistake count
      const lastIdx = newInput.length - 1;
      if (lastIdx >= 0 && newInput.length > input.length) {
        if (newInput[lastIdx] !== practiceText.text[lastIdx]) {
          setTotalMistakes(prev => prev + 1);
        }
      }

      // Accuracy
      const acc = newInput.length > 0
        ? Math.round(((newInput.length - errCount) / newInput.length) * 100)
        : 100;
      setAccuracy(acc);

      // Streak logic
      const lastChar = newInput[lastIdx];
      const targetChar = practiceText.text[lastIdx];
      if (newInput.length > input.length) {
        if (lastChar === targetChar) {
          setStreak(prev => {
            const next = prev + 1;
            setMaxStreak(m => Math.max(m, next));
            const nextMilestone = MILESTONE_STREAKS.find(
              ms => next >= ms && prevMilestoneRef.current < ms
            );
            if (nextMilestone) {
              prevMilestoneRef.current = nextMilestone;
              setMilestone(nextMilestone);
              setTimeout(() => setMilestone(null), 100);
            }
            return next;
          });
        } else {
          setStreak(0);
        }
      } else {
        setStreak(0);
      }

      // WPM
      const timeElapsed = Math.max(1, (Date.now() - startTimeRef.current) / 1000);
      const words = newInput.trim().split(/\s+/).filter(Boolean).length;
      const wpmVal = Math.round(words / (timeElapsed / 60));
      setWpm(wpmVal);

      // Auto-finish when done
      if (newInput.length >= practiceText.text.length) {
        handleComplete(newInput, false);
      }

      // Auto-scroll active char
      if (textDisplayRef.current) {
        const spans = textDisplayRef.current.querySelectorAll('span');
        const activeSpan = spans[newInput.length];
        if (activeSpan) {
          activeSpan.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    },
    [finished, practiceText, started, input.length, startTimers, handleComplete]
  );

  // Cleanup on unmount
  useEffect(() => () => stopTimers(), [stopTimers]);

  // Format time
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-purple-50/30 to-slate-100 dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950 flex flex-col transition-colors duration-300">
      {/* ── TOP SECTION: Full-Width Horizontal Car Racing Game ────── */}
      <RaceTrack
        playerProgress={playerProgress}
        playerWpm={wpm}
        playerRank={playerRank}
        bots={rankedBots}
        started={started}
        difficulty={difficulty}
      />

      {/* ── BOTTOM SECTION: Modern, Clean, Non-Cluttered Typing Space ─ */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header Row: Difficulty Selector & Live Clean HUD */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-200/80 dark:border-gray-800">
            {/* Mode Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mode:
              </span>
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    if (difficulty !== lvl) {
                      setDifficulty(lvl);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    difficulty === lvl
                      ? 'bg-purple-600 text-white shadow-md scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {lvl === 'easy' ? '🌱 Easy' : lvl === 'medium' ? '⚡ Medium' : '🔥 Hard'}
                </button>
              ))}
              <span className="ml-2 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/50 px-2.5 py-1 rounded-full">
                {practiceText.category}
              </span>
            </div>

            {/* Minimalist Key Stats Badges */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <Zap className="w-4 h-4" />
                <span className="text-lg font-black tabular-nums">{wpm}</span>
                <span className="text-xs font-semibold uppercase opacity-75">WPM</span>
              </div>

              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Target className="w-4 h-4" />
                <span className="text-lg font-black tabular-nums">{accuracy}%</span>
                <span className="text-xs font-semibold uppercase opacity-75">ACC</span>
              </div>

              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-lg font-black tabular-nums">{currentErrors}</span>
                <span className="text-xs font-semibold uppercase opacity-75">ERR</span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-500">
                <StreakBadge streak={streak} milestone={milestone} />
              </div>

              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-base font-bold tabular-nums">{formatTime(elapsed)}</span>
              </div>
            </div>
          </div>

          {/* ── Typing Text Card with SLIGHTLY LARGER, SMOOTH TEXT ──── */}
          <div
            onClick={() => textareaRef.current?.focus()}
            className="cursor-text relative bg-white/85 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl 
              p-6 sm:p-8 border border-gray-200/90 dark:border-gray-700/80 shadow-xl 
              hover:border-purple-300 dark:hover:border-purple-600/50 transition-all duration-300"
          >
            {/* Smooth Large Text Display (text-xl to text-2xl as requested) */}
            <div
              ref={textDisplayRef}
              className="text-xl sm:text-2xl leading-relaxed sm:leading-loose font-mono tracking-wide 
                max-h-60 overflow-y-auto select-none pr-2 scroll-smooth"
            >
              {practiceText.text.split('').map((char, index) => {
                let colorClass = 'text-gray-400 dark:text-gray-500';

                if (index < input.length) {
                  colorClass =
                    input[index] === char
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-rose-500 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 rounded px-0.5';
                } else if (index === input.length) {
                  colorClass =
                    'text-gray-900 dark:text-white bg-purple-200/80 dark:bg-purple-900/60 rounded px-0.5 border-b-2 border-purple-500 animate-pulse';
                }

                return (
                  <span key={index} className={colorClass}>
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Seamless Typing Input - Click anywhere in card to type */}
            <textarea
              ref={textareaRef}
              className="absolute inset-0 opacity-0 cursor-text resize-none"
              value={input}
              onChange={handleInput}
              onPaste={e => e.preventDefault()}
              autoFocus
              disabled={finished}
              aria-label="Typing test input"
            />

            {!started && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-sans">
                <span>🏎️ Start typing any key to launch the race!</span>
                <span>Click text card anytime to regain focus</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Modern Bottom Action Bar ────────────────────────────── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-3">
            {/* Give Up Button */}
            <button
              onClick={() => handleComplete(input, true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200
                bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800
                hover:bg-rose-500 hover:text-white active:scale-95 shadow-sm flex items-center gap-2"
            >
              <Flag className="w-4 h-4" />
              {!started || input.length === 0 ? '← Exit to Home' : '🏳️ Give Up & View Results'}
            </button>

            {/* Restart Button */}
            <button
              onClick={() => initTest(difficulty)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200
                bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700
                active:scale-95 flex items-center gap-2 border border-gray-200 dark:border-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              New Text
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span>
              {input.length} / {practiceText.text.length} chars
            </span>
            <div className="w-24 sm:w-36 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-200"
                style={{ width: `${playerProgress}%` }}
              />
            </div>
            <span className="font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              {Math.round(playerProgress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
