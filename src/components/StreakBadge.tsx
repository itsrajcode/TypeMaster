import React, { useEffect, useState } from 'react';

interface StreakBadgeProps {
  streak: number;
  milestone: number | null;
}

const milestoneMessages: Record<number, { emoji: string; text: string; color: string }> = {
  10:  { emoji: '🔥', text: 'On Fire!',       color: 'from-orange-500 to-red-500' },
  25:  { emoji: '⚡', text: 'Blazing!',        color: 'from-yellow-400 to-orange-500' },
  50:  { emoji: '💎', text: 'Flawless!',       color: 'from-cyan-400 to-blue-500' },
  100: { emoji: '👑', text: 'Unstoppable!',    color: 'from-purple-500 to-pink-500' },
  200: { emoji: '🚀', text: 'Legendary!',      color: 'from-green-400 to-cyan-500' },
};

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, milestone }) => {
  const [visible, setVisible] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);

  useEffect(() => {
    if (milestone !== null && milestoneMessages[milestone]) {
      setCurrentMilestone(milestone);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [milestone]);

  const info = currentMilestone ? milestoneMessages[currentMilestone] : null;

  return (
    <>
      {/* Streak inline display */}
      <div className="flex items-center gap-1.5">
        <span className="text-orange-500 dark:text-orange-400 font-bold text-sm">🔥</span>
        <span className="text-orange-600 dark:text-orange-400 font-bold tabular-nums">{streak}</span>
      </div>

      {/* Milestone toast */}
      {visible && info && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 
            px-6 py-3 rounded-2xl text-white font-bold text-lg shadow-2xl
            bg-gradient-to-r ${info.color}
            animate-streak-pop flex items-center gap-2`}
        >
          <span className="text-2xl">{info.emoji}</span>
          <span>{info.text}</span>
          <span className="text-sm font-normal opacity-90">({currentMilestone} streak!)</span>
        </div>
      )}
    </>
  );
};

export default StreakBadge;
