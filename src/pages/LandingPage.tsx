import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Target, BarChart3, Github, ChevronRight, 
  Keyboard, Trophy, TrendingUp, Flame, Flag, Sparkles
} from 'lucide-react';
import { DifficultyLevel } from '../data/practiceTexts';

// ── Typewriter Interactive Demo ──────────────────────────────────────
const DEMO_SENTENCE = 'Accelerate your typing skills into overdrive and dominate the track.';

const useInteractiveTypewriter = (text: string, speed = 65) => {
  const [displayed, setDisplayed] = useState('');
  const [cursor, setCursor] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'pause' | 'back'>('forward');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (direction === 'forward') {
      if (cursor < text.length) {
        timer = setTimeout(() => {
          setDisplayed(text.slice(0, cursor + 1));
          setCursor(c => c + 1);
        }, speed);
      } else {
        timer = setTimeout(() => {
          setDirection('pause');
        }, 1500);
      }
    } else if (direction === 'pause') {
      timer = setTimeout(() => {
        setDirection('back');
      }, 500);
    } else if (direction === 'back') {
      if (cursor > 0) {
        timer = setTimeout(() => {
          setDisplayed(text.slice(0, cursor - 1));
          setCursor(c => c - 1);
        }, speed / 2);
      } else {
        timer = setTimeout(() => {
          setDirection('forward');
        }, 400);
      }
    }

    return () => clearTimeout(timer);
  }, [cursor, direction, text, speed]);

  return { displayed, cursor, progress: text.length > 0 ? (cursor / text.length) * 100 : 0 };
};

// ── Animated Counter ────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1400;
        const steps = 40;
        const increment = target / steps;
        let current = 0;
        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(interval);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ── Difficulties Info ───────────────────────────────────────────────
const difficulties: {
  id: DifficultyLevel;
  label: string;
  emoji: string;
  speedGuide: string;
  desc: string;
  bots: string;
  badge: string;
  borderColor: string;
}[] = [
  {
    id: 'easy',
    label: 'Easy Mode',
    emoji: '🌱',
    speedGuide: 'Target: 25 - 35+ WPM',
    desc: 'Short, encouraging sentences with everyday vocabulary. Ideal for warming up or beginners.',
    bots: 'Competitor bots: 19 - 32 WPM',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
    borderColor: 'hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20',
  },
  {
    id: 'medium',
    label: 'Medium Mode',
    emoji: '⚡',
    speedGuide: 'Target: 50 - 65+ WPM',
    desc: 'Balanced real-world paragraphs covering technology, nature, space, and literature.',
    bots: 'Competitor bots: 42 - 58 WPM',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
    borderColor: 'hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20',
  },
  {
    id: 'hard',
    label: 'Hard Mode',
    emoji: '🔥',
    speedGuide: 'Target: 75 - 95+ WPM',
    desc: 'Advanced technical terms, scientific literature, and intricate philosophical syntax.',
    bots: 'Competitor bots: 68 - 88 WPM',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300',
    borderColor: 'hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20',
  },
];

const features = [
  {
    icon: Flag,
    title: 'Top-Bar Car Race Circuit',
    description: 'Your typing speed directly propels your race car across a live 4-lane horizontal highway against rival bots.',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    icon: Zap,
    title: '3 Calibrated Modes',
    description: 'Easy, Medium, and Hard tiers featuring calibrated bot WPM speeds, completion times, and tailored paragraphs.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Target,
    title: 'Precision Keystroke Audit',
    description: 'Dual error tracking: monitors current mismatches plus cumulative mistakes across the entire run.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Flame,
    title: 'Streak Multipliers',
    description: 'Keep your rhythm unbroken to unlock celebratory streak milestones at 10, 25, 50, and 100 characters.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: BarChart3,
    title: 'Triple Analytical Graphs',
    description: 'Deep post-race analytics with WPM acceleration line chart, error growth area chart, and sector accuracy bars.',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: TrendingUp,
    title: 'Mid-Race Exit Support',
    description: 'Give up anytime and immediately receive accurate metrics based on exactly where you stopped on the track.',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

// ── LandingPage Component ───────────────────────────────────────────
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const { displayed, cursor, progress } = useInteractiveTypewriter(DEMO_SENTENCE, 65);

  const handleStart = (diff = selectedDifficulty) => {
    navigate('/practice', { state: { difficulty: diff } });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* ── Top Navigation Bar ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/75 dark:bg-gray-950/75 border-b border-gray-200/80 dark:border-gray-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 dark:from-purple-400 dark:via-indigo-400 dark:to-cyan-400">
              TypeMaster
            </span>
          </div>

          <div className="flex items-center gap-4 pr-14">
            <button
              onClick={() => handleStart()}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Flag className="w-3.5 h-3.5" /> Race Now
            </button>
            <button
              onClick={() => window.open('https://github.com/itsrajcode/TypeMaster', '_blank')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-400/20 to-blue-400/20 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-full px-4 py-1.5 text-xs font-bold mb-6 border border-purple-200 dark:border-purple-800/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Next-Gen Gamified Typing Speed Circuit
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight leading-tight">
            Race Your Speed.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 dark:from-purple-400 dark:via-indigo-400 dark:to-cyan-400">
              Master Every Keystroke.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Compete on a live full-screen car racing track powered directly by your real-time typing speed. Track live WPM, build combo streaks, and analyze your performance with comprehensive charts.
          </p>

          {/* ── IMPROVED TEXT VIEW & LIVE RACETRACK DEMO ────────────── */}
          <div className="max-w-2xl mx-auto mb-12 bg-white/95 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-200/90 dark:border-gray-800 backdrop-blur-md overflow-hidden text-left">
            {/* Terminal Top Window Bar */}
            <div className="bg-gray-100 dark:bg-gray-800/90 px-4 py-2.5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono font-medium text-gray-500 dark:text-gray-400">
                  typemaster-grand-prix-simulator.tsx
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                  ⚡ 76 WPM
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  🎯 99% ACC
                </span>
              </div>
            </div>

            {/* Mini Race Highway Preview */}
            <div className="bg-slate-950 py-3 px-4 sm:px-6 relative border-b border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                <span>START</span>
                <span className="text-purple-400 font-bold">LANE 1: YOU (Player)</span>
                <span>FINISH 🏁</span>
              </div>
              {/* Road track */}
              <div className="relative h-9 bg-slate-900 rounded-lg border border-slate-800 flex items-center px-2 overflow-hidden">
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-b border-dashed border-slate-700 pointer-events-none" />
                {/* Moving Car Graphic */}
                <div
                  className="absolute transition-all duration-150 ease-out flex items-center gap-1.5"
                  style={{ left: `calc(10px + ${progress * 0.8}%)` }}
                >
                  <span className="text-xs">🏎️</span>
                  <span className="text-[10px] bg-purple-600 text-white font-black px-1.5 py-0.2 rounded shadow">
                    YOU #{progress > 50 ? '1st' : '2nd'}
                  </span>
                </div>
              </div>
            </div>

            {/* Crisp, Smooth Text View */}
            <div className="p-6">
              <div className="text-xs uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 mb-2 flex items-center justify-between">
                <span>Live Typing Prompt View</span>
                <span className="font-mono text-gray-400">{Math.round(progress)}% Complete</span>
              </div>
              <div className="text-lg sm:text-xl font-mono leading-relaxed select-none">
                {DEMO_SENTENCE.split('').map((char, idx) => {
                  let cls = 'text-gray-400 dark:text-gray-500';
                  if (idx < cursor) {
                    cls = 'text-emerald-600 dark:text-emerald-400 font-bold';
                  } else if (idx === cursor) {
                    cls = 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 rounded px-0.5 border-b-2 border-purple-500 animate-pulse';
                  }
                  return (
                    <span key={idx} className={cls}>
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 3-MODE SELECTION SECTION ───────────────────────────── */}
          <div className="mb-10 text-left">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Choose Your Racing Mode
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Predefined competitor bot speeds and calibrated text difficulty
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {difficulties.map(d => {
                const isSelected = selectedDifficulty === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDifficulty(d.id)}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 shadow-lg scale-102 ring-2 ring-purple-300 dark:ring-purple-700'
                        : `bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${d.borderColor}`
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{d.emoji}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${d.badge}`}>
                          {d.label}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                        {d.speedGuide}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        {d.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                      🏁 {d.bots}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Start Race Action CTA ──────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleStart()}
              className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-lg rounded-2xl shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-purple-500/30 flex items-center gap-2"
            >
              <span>Launch Car Race Test</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => window.open('https://github.com/itsrajcode/TypeMaster', '_blank')}
              className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 font-bold text-lg rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105 shadow flex items-center gap-2"
            >
              <Github className="w-5 h-5" /> View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* ── Global Stats Counter ─────────────────────────────────── */}
      <section className="bg-white/70 dark:bg-gray-900/60 border-y border-gray-200/80 dark:border-gray-800 py-12 px-4 transition-colors">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Active Typists', target: 12000, suffix: '+' },
            { label: 'Races Completed', target: 1500000, suffix: '+' },
            { label: 'Avg WPM Gain', target: 45, suffix: '%' },
            { label: 'Practice Paragraphs', target: 100, suffix: '+' },
          ].map(({ label, target, suffix }) => (
            <div key={label} className="p-4 rounded-xl">
              <div className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 mb-1">
                <AnimatedCounter target={target} suffix={suffix} />
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3">
              Engineered for Speed, Accuracy, and Fun
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
              Real-time telemetry, calibrated competitor speeds, and rich post-race visualizations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800
                  rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 text-white shadow-md`}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="text-center text-gray-500 dark:text-gray-400 pb-12 pt-6 border-t border-gray-200/80 dark:border-gray-800 px-4 text-xs">
        <p className="mb-1">© 2026 TypeMaster. All rights reserved.</p>
        <p className="font-semibold">
          Crafted with passion for speed typists by{' '}
          <a
            href="https://github.com/itsrajcode"
            target="_blank"
            rel="noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Raj
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
