import { DictionaryStrategy } from '../../../word/dictionary/strategies/base-dictionary.strategy';
import { BaseGameModeStrategy, GameModeTaskPayload } from './base-game-mode.strategy';

export class RandomLetterStrategy extends BaseGameModeStrategy {
  public readonly gameDuration: number = 90; // 1.5 minutes

  constructor(dictionary: DictionaryStrategy) {
    super(dictionary);
  }

  public prepareTask() {
    const letterCount = 7;
    const letters = this.dictionary.getRandomLetters(letterCount);
    return { data: { task: letters } };
  }

  public validateAnswer(answer: string, { data }: GameModeTaskPayload): boolean {
    const availableLetters: string[] = data.task;
    const word = answer.toLowerCase();

    // Check dictionary existence
    if (!this.dictionary.checkWordExists(word)) {
      return false;
    }

    // Build frequency maps
    const wordFreq: Record<string, number> = {};
    const availableFreq: Record<string, number> = {};

    for (const letter of availableLetters) {
      availableFreq[letter] = (availableFreq[letter] || 0) + 1;
    }

    for (const letter of word) {
      wordFreq[letter] = (wordFreq[letter] || 0) + 1;
    }

    // Compare frequencies
    for (const letter of Object.keys(wordFreq)) {
      const need = wordFreq[letter];
      const have = availableFreq[letter] || 0;

      if (need > have) {
        return false;
      }
    }

    return true;
  }
}
