import { useState } from 'react';
import {
  createGameSessionApi,
  getGameRoundApi,
  getGameSessionDetailsApi,
} from '../api/game-session.api';
import { GameMode, SupportedLanguage } from '../api/types';
import { useGameSessionStore } from '../model/game-session.store';

export const useGameSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { gameSessionId, createGameRound, setGameSession } = useGameSessionStore();

  const startGame = async () => {
    setIsLoading(true);
    try {
      const sessionResponse = await createGameSessionApi({
        mode: GameMode.PARTIALS,
        language: SupportedLanguage.ENGLISH,
      });

      if (sessionResponse.ok && sessionResponse.data) {
        const session = sessionResponse.data;
        setGameSession({
          gameSessionId: session.gameSessionId,
          userId: session.userId,
          mode: session.mode,
          status: session.status,
          language: session.language,
          score: session.score,
          startedAt: session.startedAt,
          finishesAt: session.finishesAt,
        });

        const roundResponse = await getGameRoundApi({
          gameSessionId: session.gameSessionId,
        });

        if (roundResponse.ok && roundResponse.data) {
          const round = roundResponse.data;
          createGameRound({
            gameRoundId: round.gameRoundId,
            task:
              typeof round.taskPayload.data.task === 'string'
                ? round.taskPayload.data.task
                : round.taskPayload.data.task.join(''),
            userAnswer: round.userAnswer,
            scoreAwarded: round.scoreAwarded,
          });
        }
      }
    } catch (error) {
      console.error('Failed to start game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGameDetails = async () => {
    const res = await getGameSessionDetailsApi(gameSessionId);
    if (res.ok && res.data) {
      setGameSession({
        gameSessionId: res.data.gameSessionId,
        userId: res.data.userId,
        mode: res.data.mode,
        status: res.data.status,
        language: res.data.language,
        score: res.data.score,
        startedAt: res.data.startedAt,
        finishesAt: res.data.finishesAt,
      });
    }
  };

  return {
    isLoading,
    startGame,
    updateGameDetails,
  };
};
