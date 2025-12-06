import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GameModeFactory } from './game-mode/game-mode.factory';
import { CreateGameSessionDto } from './dto/create-game-sessioin.dto';
import {
  GameSession,
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

  private async validateGameSessionActuality(gameSessionId: string): Promise<GameSession> {
    const gameSession = await this.gameSessionRepository.findById(gameSessionId);

    if (!gameSession) {
      throw new NotFoundException('Game session not found');
    }

    const nowDate = new Date();
    if (nowDate > gameSession.finishesAt) {
      if (gameSession.status !== GameSessionStatus.FINISHED) {
        await this.finalizeGameSession(gameSessionId);
      }
      throw new BadRequestException('Game session has already finished');
    }

    return gameSession;
  }

  public async getGameSessionRound(gameSessionId: string, userId: string) {
    const session = await this.validateGameSessionActuality(gameSessionId);

    if (session.userId !== userId) {
      throw new BadRequestException('Game session not found or access denied');
    }

    return this.generateNextRound(session);
  }

  public async validateGameRoundAnswer(gameRoundId: string, userAnswer: string, userId: string) {
    const gameRound = await this.gameRoundRepository.findById(gameRoundId);
    if (!gameRound) {
      throw new NotFoundException('Game round not found');
    }

    if (gameRound.session.userId !== userId) {
      throw new BadRequestException('Access denied to this game round');
    }

    await this.validateGameSessionActuality(gameRound.session.gameSessionId);

    const gameModeStrategy = this.gameModeFactory.getStrategy(
      gameRound.session.mode,
      gameRound.session.language,
    );

    const isCorrect = gameModeStrategy.validateAnswer(userAnswer, gameRound.taskPayload);

    if (!isCorrect) {
      throw new BadRequestException('Incorrect answer');
    }

    const scoreAwarded = gameModeStrategy.getScoreForCorrectAnswer(userAnswer);

    await this.gameRoundRepository.updateGameRound(gameRoundId, {
      userAnswer,
      scoreAwarded,
    });

    const validSession = await this.validateGameSessionActuality(gameRound.session.gameSessionId);

    if (!validSession) {
      throw new NotFoundException('Game session destroyed unexpectedly');
    }

    if (new Date() > validSession.finishesAt) {
      await this.finalizeGameSession(validSession.gameSessionId);
      throw new BadRequestException('Game session has finished');
    }

    return this.generateNextRound(validSession);
  }

  private async generateNextRound(session: GameSession) {
    const existingRounds = await this.gameRoundRepository.getNotAnsweredRoundsByGameSessionId(
      session.gameSessionId,
    );

    if (existingRounds.length > 0) {
      return existingRounds[0];
    }

    const strategy = this.gameModeFactory.getStrategy(session.mode, session.language);

    const taskPayload = strategy.prepareTask();

    return await this.gameRoundRepository.createGameRound({
      gameSessionId: session.gameSessionId,
      taskPayload,
    });
  }

  public async getGameSession(gameSessionId: string, userId: string) {
    const gameSession = await this.gameSessionRepository.findSessionWithRounds(gameSessionId);

    if (!gameSession || gameSession.userId !== userId) {
      throw new NotFoundException('Game session not found or access denied');
    }

    return gameSession;
  }

  public async finalizeUserGameSession(
    gameSessionId: string,
    userId: string,
  ): Promise<GameSession> {
    const gameSession = await this.gameSessionRepository.findById(gameSessionId);

    if (!gameSession || gameSession.userId !== userId) {
      throw new NotFoundException('Game session not found or access denied');
    }

    if (gameSession.status === GameSessionStatus.FINISHED) {
      return gameSession;
    }

    await this.finalizeGameSession(gameSessionId);
    const finalizedSession = await this.gameSessionRepository.findById(gameSessionId);

    if (!finalizedSession) {
      throw new NotFoundException('Game session not found after finalization');
    }

    return finalizedSession;
  }

  public async finalizeGameSession(gameSessionId: string): Promise<void> {
    const gameSession = await this.gameSessionRepository.findSessionWithRounds(gameSessionId);
    if (!gameSession) {
      throw new NotFoundException('Game session not found');
    }

    if (gameSession.status === GameSessionStatus.FINISHED) {
      this.logger.log('Game session is still active or already finished. No finalization needed.');
      throw new BadRequestException('Game session is already finished');
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
