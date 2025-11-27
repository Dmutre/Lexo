import { DictionaryStrategy } from '../../../word/dictionary/strategies/base-dictionary.strategy';
import { BaseGameModeStrategy, GameModeTaskPayload } from './base-game-mode.strategy';

export class PartialGameModeStrategy extends BaseGameModeStrategy {
  public readonly gameDuration: number = 60; // 60 seconds

  constructor(dictionary: DictionaryStrategy) {
    super(dictionary);
  }

  public prepareTask(): GameModeTaskPayload {
    const partLength = 3;
    const wordPart = this.dictionary.getRandomWordPart(partLength);
    return { data: { task: wordPart } };
  }

  public validateAnswer(answer: string, { data }: GameModeTaskPayload): boolean {
    const { task } = data;
    const wordContainsPart = answer.toLowerCase().includes(task.toLowerCase());
    const wordExists = this.dictionary.checkWordExists(answer);
    return wordContainsPart && wordExists;
  }
}
