export enum GameMode {
  PARTIALS = 'PARTIALS',
  LETTERS = 'LETTERS',
}

export type GameStatus = 'ACTIVE' | 'FINISHED';

export type SupportedLanguage = 'ENGLISH' | 'UKRAINIAN';

export interface ICreateGameSessionRequest {
  mode: GameMode;
  language: SupportedLanguage;
}

export interface ICreateGameSessionResponse {
  gameSessionId: string;
  userId: string;
  mode: GameMode;
  status: GameStatus;
  finishesAt: string;
  language: SupportedLanguage;
  score: number;
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
export interface IGetGameSessionDetailsResponse extends ICreateGameSessionResponse {}

export interface IGetGameRoundRequest {
  gameSessionId: string;
}

type TaskPayload = {
  data: {
    task: string[] | string;
  };
};

export interface IGetGameRoundResponse {
  gameRoundId: string;
  gameSessionId: string;
  taskPayload: TaskPayload;
  userAnswer: string;
  scoreAwarded: number;
  createdAt: string;
  updatedAt: string;
}

export interface IValidateAnswerRequest {
  gameRoundId: string;
  userAnswer: string;
}

export interface IValidateAnswerResponse {
  gameRoundId: string;
  gameSessionId: string;
  taskPayload: TaskPayload;
  userAnswer: string;
  scoreAwarded: number;
  createdAt: string;
  updatedAt: string;
}
