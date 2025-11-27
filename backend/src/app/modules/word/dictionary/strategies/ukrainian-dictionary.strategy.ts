import { Injectable } from '@nestjs/common';
import { BaseDictionaryStrategy } from './base-dictionary.strategy';
import * as path from 'path';

@Injectable()
export class UkrainianDictionaryStrategy extends BaseDictionaryStrategy {
  protected dictionaryPath = path.join(process.cwd(), 'dictionaries', 'ua-dict.txt');

  constructor() {
    super();
  }

  public getRandomLetters(count: number): string[] {
    const wordsArray = Array.from(this.words);

    while (true) {
      const randomWord = this.getRandomDictionaryWord();

      let shuffled = randomWord.split('').sort(() => Math.random() - 0.5);
      shuffled = shuffled.slice(0, count);

      const canFormAny = wordsArray.some((w) => w.length <= count && this.canFormWord(shuffled, w));

      if (canFormAny) return shuffled;
    }
  }

  public getRandomWordPart(length: number): string {
    while (true) {
      const word = this.getRandomDictionaryWord();

      if (word.length < length) continue;

      const start = Math.floor(Math.random() * (word.length - length + 1));
      return word.slice(start, start + length);
    }
  }
}
