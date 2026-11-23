// Shared TypeScript types for the TypeMaster typing test and car race game
import { DifficultyLevel } from '../data/practiceTexts';

export interface TimelinePoint {
  second: number;
  wpm: number;
  errors: number;
  accuracy: number;
}

export interface SegmentAccuracy {
  segment: string;
  accuracy: number;
  errors: number;
}

export interface BotRacer {
  id: string;
  name: string;
  color: string;
  carColorName: string;
  wpm: number;
  progress: number;
  finishTime: number | null;
  rank?: number;
}

export interface TestResult {
  wpm: number;
  errors: number;
  totalMistakes: number;
  accuracy: number;
  category: string;
  difficulty: DifficultyLevel;
  timeElapsed: number; // seconds
  charsTyped: number;
  totalChars: number;
  completionPercent: number;
  gaveUp: boolean;
  timeline: TimelinePoint[];
  segmentAccuracies: SegmentAccuracy[];
  maxStreak: number;
  playerRank: number; // 1st, 2nd, 3rd, 4th
  bots: BotRacer[];
}
