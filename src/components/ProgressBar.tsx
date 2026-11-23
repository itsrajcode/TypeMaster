import React from 'react';

interface ProgressBarProps {
  percent: number; // 0–100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => {
  const clamped = Math.min(100, Math.max(0, percent));

  // Color transitions: red → yellow → green
  const getColor = () => {
    if (clamped < 33)  return 'from-red-400 to-orange-400';
    if (clamped < 66)  return 'from-yellow-400 to-amber-400';
    return 'from-emerald-400 to-green-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Progress</span>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tabular-nums">
          {Math.round(clamped)}%
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor()} transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        >
          {/* Shimmer effect */}
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
