import { DictionaryStrategy } from '../../../word/dictionary/strategies/base-dictionary.strategy';

export interface GameModeTaskPayload {
  data: Record<string, any>;
}

export interface GameModeStrategy {
  prepareTask(): GameModeTaskPayload;
  validateAnswer(answer: string, payload: GameModeTaskPayload): boolean;
  getScoreForCorrectAnswer(answer: string): number;
}

export abstract class BaseGameModeStrategy implements GameModeStrategy {
  protected abstract gameDuration: number; // in seconds
  constructor(protected readonly dictionary: DictionaryStrategy) {}
  abstract prepareTask(): GameModeTaskPayload;
  abstract validateAnswer(answer: string, payload: GameModeTaskPayload): boolean;
  public getFinishTime(): Date {
    return new Date(Date.now() + this.gameDuration * 1000);
  }
  public getScoreForCorrectAnswer(answer: string): number {
    return answer.length * 10;
  }
}
