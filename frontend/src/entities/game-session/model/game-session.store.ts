import { create } from 'zustand';
import { GameMode, GameStatus, SupportedLanguage } from '../api/types';

interface IGameRound {
  gameRoundId: string;
  task: string;
  userAnswer: string;
  scoreAwarded: number;
}

interface IGameSessionState {
  gameSessionId: string;
  userId: string;
  mode: GameMode;
  status: GameStatus;
  language: SupportedLanguage;
  score: number;
  startedAt: string;
  finishesAt: string;
  round: IGameRound;
}

type GameSessionActions = {
  setGameSession: (sessionData: InitialGameSessionStateType) => void;
  clearGameSession: () => void;
  createGameRound: (roundData: IGameRound) => void;
  setScore: (score: number) => void;
  setGameStatus: (status: GameStatus) => void;
};

type InitialGameSessionStateType = Omit<IGameSessionState, 'round'>;

const initialState: InitialGameSessionStateType = {
  gameSessionId: '',
  userId: '',
  mode: GameMode.PARTIALS,
  status: GameStatus.FINISHED,
  language: SupportedLanguage.ENGLISH,
  score: 0,
  startedAt: '',
  finishesAt: '',
};

const initialRoundState: IGameRound = {
  gameRoundId: '',
  task: '',
  userAnswer: '',
  scoreAwarded: 0,
};

export const useGameSessionStore = create<IGameSessionState & GameSessionActions>((set) => ({
  ...initialState,
  round: initialRoundState,

  setGameSession: (sessionData: InitialGameSessionStateType) =>
    set(() => ({
      ...sessionData,
    })),

  clearGameSession: () =>
    set(() => ({
      ...initialState,
    })),

  createGameRound: (roundData: IGameRound) =>
    set(() => ({
      round: roundData,
    })),

  setScore: (score: number) =>
    set(() => ({
      score,
    })),

  setGameStatus: (status: GameStatus) =>
    set(() => ({
      status,
    })),
}));
