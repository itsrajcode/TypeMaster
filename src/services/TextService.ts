import { practiceTexts } from '../data/practiceTexts';

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

  getRandomText(): { category: string; text: string } {
    // Reset used texts if all have been used
    if (this.usedTextIds.size === practiceTexts.length) {
      this.usedTextIds.clear();
    }

    // Filter out used texts
    const availableTexts = practiceTexts.filter(text => !this.usedTextIds.has(text.id));
    
    // Get random text from available ones
    const randomIndex = Math.floor(Math.random() * availableTexts.length);
    const selectedText = availableTexts[randomIndex];
    
    // Mark as used
    this.usedTextIds.add(selectedText.id);
    
    return {
      category: selectedText.category,
      text: selectedText.text
    };
  }
}

export default TextService;