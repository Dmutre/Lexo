import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameSessionRepository } from '../../common/database/repositories/game-session.repository';
import { GameSessionService } from './game-session.service';

@Injectable()
export class GameSessionFinalizer {
  private readonly logger = new Logger(GameSessionFinalizer.name);

  constructor(
    private readonly gameSessionRepository: GameSessionRepository,
    private readonly gameSessionService: GameSessionService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async finalizeExpiredSessions() {
    this.logger.log('Running session finalizer job...');

    const expiredSessions = await this.gameSessionRepository.findExpiredSessions();

    if (!expiredSessions.length) {
      return;
    }

    this.logger.log(`Found ${expiredSessions.length} expired sessions`);

    for (const session of expiredSessions) {
      await this.gameSessionService.finalizeGameSession(session.gameSessionId);
      this.logger.log(`Finalized session ${session.gameSessionId}`);
    }
  }
}
