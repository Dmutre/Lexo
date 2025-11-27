import { Injectable } from '@nestjs/common';
import { DictionaryStrategy } from './strategies/base-dictionary.strategy';
import { UkrainianDictionaryStrategy } from './strategies/ukrainian-dictionary.strategy';
import { EnglishDictionaryStrategy } from './strategies/english-dictionary.strategy';

export enum DictionaryType {
  ENGLISH = 'ENGLISH',
  UKRAINIAN = 'UKRAINIAN',
}

@Injectable()
export class DictionaryFactory {
  constructor(
    private readonly englishStrategy: EnglishDictionaryStrategy,
    private readonly ukrainianStrategy: UkrainianDictionaryStrategy,
  ) {}

  private readonly strategyMap: Record<DictionaryType, DictionaryStrategy> = {
    [DictionaryType.ENGLISH]: this.englishStrategy,
    [DictionaryType.UKRAINIAN]: this.ukrainianStrategy,
  };

  public getStrategy(type: DictionaryType): DictionaryStrategy {
    const strategy = this.strategyMap[type];
    if (!strategy) {
      throw new Error(`No strategy found for dictionary type: ${type}`);
    }
    return strategy;
  }
}
