import { client } from '@/shared/api/base-api';
import {
  ICreateGameSessionResponse,
  ICreateGameSessionRequest,
  IGetGameSessionDetailsResponse,
  IGetGameRoundRequest,
  IGetGameRoundResponse,
  IValidateAnswerResponse,
  IValidateAnswerRequest,
} from './types';

export const createGameSessionApi = async (gameConfig: ICreateGameSessionRequest) => {
  const res = await client<ICreateGameSessionResponse>('game-session', {
    method: 'POST',
    body: JSON.stringify(gameConfig),
  });
  return res;
};

export const getGameSessionDetailsApi = async (gameSessionId: string) => {
  const res = await client<IGetGameSessionDetailsResponse>(`game-session/${gameSessionId}`);
  return res;
};

export const getGameRoundApi = async (body: IGetGameRoundRequest) => {
  const res = await client<IGetGameRoundResponse>('game-session/round', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res;
};

export const validateAnswerApi = async (body: IValidateAnswerRequest) => {
  const res = await client<IValidateAnswerResponse>('game-session/validate', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res;
};
