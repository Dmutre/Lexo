import * as fs from 'fs';
import * as path from 'path';
import { isAbbreviation } from '../../utils/is-abbrevation';

export interface DictionaryStrategy {
  getRandomLetters(count: number): string[];
  getRandomWordPart(length: number): string;
  checkWordExists(word: string): boolean;
}

export abstract class BaseDictionaryStrategy implements DictionaryStrategy {
  protected dictionaryPath: string;

  protected words: Set<string> = new Set();

  constructor(dictionaryName: string) {
    this.dictionaryPath = path.join(process.cwd(), 'dist', 'dictionaries', dictionaryName);
    this.initializeDictionary();
  }

  protected initializeDictionary(): void {
    if (this.words.size === 0) {
      this.words = this.loadDictionary();
    }
  }

  abstract getRandomLetters(count: number): string[];
  abstract getRandomWordPart(length: number): string;

  public checkWordExists(word: string): boolean {
    return this.words.has(word.toLowerCase());
  }

  protected loadDictionary(): Set<string> {
    if (!this.dictionaryPath) {
      throw new Error(
        'Dictionary path is not set. Make sure dictionaryPath is initialized in the constructor.',
      );
    }

    const filePath = path.resolve(this.dictionaryPath);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Dictionary file not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const words = fileContent
      .split('\n')
      .filter((w) => !isAbbreviation(w))
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);

    return new Set(words);
  }

  protected getRandomDictionaryWord(): string {
    const wordsArray = Array.from(this.words);
    const index = Math.floor(Math.random() * wordsArray.length);
    return wordsArray[index];
  }

  protected canFormWord(letters: string[], word: string): boolean {
    const pool = [...letters];

    for (const char of word) {
      const idx = pool.indexOf(char);
      if (idx === -1) return false;
      pool.splice(idx, 1);
    }
    return true;
  }
}
