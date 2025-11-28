import { GameSessionMode, GameSessionStatus } from "../../../common/database/repositories/game-session.repository";
import { DictionaryType } from "../../word/dictionary/dictionary.factory";

export class GameSessionDto {
  gameSessionId: string;
  userId: string;
  mode: GameSessionMode;
  status: GameSessionStatus;
  finishesAt: Date;
  language: DictionaryType;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};