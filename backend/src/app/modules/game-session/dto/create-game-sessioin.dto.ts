import { IsEnum } from 'class-validator';
import { GameSessionMode } from '../../../common/database/repositories/game-session.repository';
import { DictionaryType } from '../../word/dictionary/dictionary.factory';

export class CreateGameSessionDto {
  @IsEnum(GameSessionMode)
  mode: GameSessionMode;

  @IsEnum(DictionaryType)
  language: DictionaryType;
}
