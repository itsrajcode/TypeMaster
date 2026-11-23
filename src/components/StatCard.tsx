import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  color: 'purple' | 'blue' | 'red' | 'green' | 'orange' | 'cyan';
}

const colorMap = {
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    icon: 'text-purple-500 dark:text-purple-400',
    value: 'text-purple-700 dark:text-purple-300',
    label: 'text-purple-500 dark:text-purple-400',
    ring: 'ring-purple-200 dark:ring-purple-800',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    icon: 'text-blue-500 dark:text-blue-400',
    value: 'text-blue-700 dark:text-blue-300',
    label: 'text-blue-500 dark:text-blue-400',
    ring: 'ring-blue-200 dark:ring-blue-800',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    icon: 'text-red-500 dark:text-red-400',
    value: 'text-red-700 dark:text-red-300',
    label: 'text-red-500 dark:text-red-400',
    ring: 'ring-red-200 dark:ring-red-800',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/30',
    icon: 'text-green-500 dark:text-green-400',
    value: 'text-green-700 dark:text-green-300',
    label: 'text-green-500 dark:text-green-400',
    ring: 'ring-green-200 dark:ring-green-800',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    icon: 'text-orange-500 dark:text-orange-400',
    value: 'text-orange-700 dark:text-orange-300',
    label: 'text-orange-500 dark:text-orange-400',
    ring: 'ring-orange-200 dark:ring-orange-800',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/30',
    icon: 'text-cyan-500 dark:text-cyan-400',
    value: 'text-cyan-700 dark:text-cyan-300',
    label: 'text-cyan-500 dark:text-cyan-400',
    ring: 'ring-cyan-200 dark:ring-cyan-800',
  },
};

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, sub, color }) => {
  const c = colorMap[color];
  return (
    <div className={`${c.bg} ring-1 ${c.ring} rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105`}>
      <Icon className={`w-5 h-5 ${c.icon} mb-1`} />
      <div className={`text-2xl font-black tabular-nums ${c.value}`}>{value}</div>
      <div className={`text-xs font-semibold uppercase tracking-wider ${c.label}`}>{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500">{sub}</div>}
    </div>
  );
};

export default StatCard;
