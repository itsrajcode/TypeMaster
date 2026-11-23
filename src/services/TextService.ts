import { practiceTexts, PracticeText, DifficultyLevel } from '../data/practiceTexts';

class TextService {
  private static instance: TextService;
  private usedTextIds: Set<number> = new Set();

  private constructor() {}

  static getInstance(): TextService {
    if (!TextService.instance) {
      TextService.instance = new TextService();
    }
    return TextService.instance;
  }

  getRandomText(difficulty?: DifficultyLevel): PracticeText {
    // Filter texts by difficulty if specified
    const matchingPool = difficulty
      ? practiceTexts.filter(t => t.difficulty === difficulty)
      : practiceTexts;

    // Reset used texts for this pool if all have been used
    const poolIds = new Set(matchingPool.map(t => t.id));
    const usedInPool = [...this.usedTextIds].filter(id => poolIds.has(id));

    if (usedInPool.length >= matchingPool.length) {
      for (const id of usedInPool) {
        this.usedTextIds.delete(id);
      }
    }

    // Filter out used texts
    const available = matchingPool.filter(t => !this.usedTextIds.has(t.id));
    const targetPool = available.length > 0 ? available : matchingPool;

    const randomIndex = Math.floor(Math.random() * targetPool.length);
    const selected = targetPool[randomIndex];

    this.usedTextIds.add(selected.id);

    return selected;
  }
}

export default TextService;
