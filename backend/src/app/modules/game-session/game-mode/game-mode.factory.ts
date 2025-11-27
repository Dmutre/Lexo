import { Injectable } from '@nestjs/common';
import { PartialGameModeStrategy } from './strategies/partial-game-mode.strategy';
import { RandomLetterStrategy } from './strategies/random-letter-game-mode.strategy';
import { GameSessionMode } from '../../../common/database/repositories/game-session.repository';
import { BaseGameModeStrategy } from './strategies/base-game-mode.strategy';
import { DictionaryFactory, DictionaryType } from '../../word/dictionary/dictionary.factory';

@Injectable()
export class GameModeFactory {
  constructor(private readonly dictionaryFactory: DictionaryFactory) {}

  public getStrategy(mode: GameSessionMode, lang: DictionaryType): BaseGameModeStrategy {
    const dictionary = this.dictionaryFactory.getStrategy(lang);

    const strategyMap = {
      [GameSessionMode.PARTIALS]: () => new PartialGameModeStrategy(dictionary),
      [GameSessionMode.LETTERS]: () => new RandomLetterStrategy(dictionary),
    };

    const builder = strategyMap[mode];
    if (!builder) {
      throw new Error(`Unknown game mode: ${mode}`);
    }

    return builder();
  }
}
