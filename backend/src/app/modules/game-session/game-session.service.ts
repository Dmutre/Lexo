import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GameModeFactory } from './game-mode/game-mode.factory';
import { CreateGameSessionDto } from './dto/create-game-sessioin.dto';
import {
  GameSessionRepository,
  GameSessionStatus,
} from '../../common/database/repositories/game-session.repository';
import { GameRoundRepository } from '../../common/database/repositories/game-round.repository';
import { Logger } from 'nestjs-pino';

@Injectable()
export class GameSessionService {
  constructor(
    private readonly gameModeFactory: GameModeFactory,
    private readonly gameSessionRepository: GameSessionRepository,
    private readonly gameRoundRepository: GameRoundRepository,
    private readonly logger: Logger,
  ) {}

  public async createGameSession(userId: string, { mode, language }: CreateGameSessionDto) {
    const gameModeStrategy = this.gameModeFactory.getStrategy(mode, language);

    const gameSession = await this.gameSessionRepository.createGameSession({
      userId,
      mode,
      language,
      status: GameSessionStatus.ACTIVE,
      finishesAt: gameModeStrategy.getFinishTime(),
    });

    return gameSession;
  }

  public async getGameSessionRound(gameSessionId: string, userId: string) {
    const gameSession = await this.gameSessionRepository.findById(gameSessionId);

    if (!gameSession || gameSession.userId !== userId) {
      throw new BadRequestException('Game session not found or access denied');
    }

    const gameModeStrategy = this.gameModeFactory.getStrategy(
      gameSession.mode,
      gameSession.language,
    );

    const taskData = gameModeStrategy.prepareTask();
    const gameRound = await this.gameRoundRepository.createGameRound({
      gameSessionId: gameSession.gameSessionId,
      taskPayload: taskData,
    });

    return gameRound;
  }

  public async validateGameRoundAnswer(gameRoundId: string, userAnswer: string) {
    const gameRound = await this.gameRoundRepository.findById(gameRoundId);
    if (!gameRound) {
      throw new NotFoundException('Game round not found');
    }

    const gameModeStrategy = this.gameModeFactory.getStrategy(
      gameRound.session.mode,
      gameRound.session.language,
    );

    const nowDate = new Date();
    if (nowDate > gameRound.session.finishesAt) {
      if (gameRound.session.status !== GameSessionStatus.FINISHED) {
        await this.finalizeGameSessionIfNeeded(gameRound.session.gameSessionId);
      }
      throw new BadRequestException('Game session has already finished');
    }

    const isCorrect = gameModeStrategy.validateAnswer(userAnswer, gameRound.taskPayload);
    if (!isCorrect) {
      throw new BadRequestException('Incorrect answer');
    }
    const scoreAwarded = isCorrect ? gameModeStrategy.getScoreForCorrectAnswer(userAnswer) : 0;
    const updatedGameRound = await this.gameRoundRepository.updateGameRound(gameRoundId, {
      userAnswer,
      scoreAwarded,
    });

    return updatedGameRound;
  }

  private async finalizeGameSessionIfNeeded(gameSessionId: string): Promise<void> {
    const gameSession = await this.gameSessionRepository.findSessionWithRounds(gameSessionId);
    if (!gameSession) {
      throw new NotFoundException('Game session not found');
    }

    const nowDate = new Date();
    if (nowDate < gameSession.finishesAt || gameSession.status === GameSessionStatus.FINISHED) {
      this.logger.log('Game session is still active or already finished. No finalization needed.');
      return;
    }

    const totalScore = gameSession.rounds.reduce(
      (acc, round) => acc + (round.scoreAwarded || 0),
      0,
    );

    await this.gameSessionRepository.updateGameSession(gameSessionId, {
      status: GameSessionStatus.FINISHED,
      score: totalScore,
    });
  }
}
