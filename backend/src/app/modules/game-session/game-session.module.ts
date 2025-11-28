import { Module } from '@nestjs/common';
import { WordModule } from '../word/word.module';
import { DatabaseModule } from '../../common/database/database.module';
import { PartialGameModeStrategy } from './game-mode/strategies/partial-game-mode.strategy';
import { RandomLetterStrategy } from './game-mode/strategies/random-letter-game-mode.strategy';
import { GameModeFactory } from './game-mode/game-mode.factory';
import { GameSessionController } from './game-session.controller';
import { GameSessionService } from './game-session.service';
import { GameSessionFinalizer } from './game-session-finilizer.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [WordModule, DatabaseModule, AuthModule],
  providers: [
    PartialGameModeStrategy,
    RandomLetterStrategy,
    GameModeFactory,
    GameSessionService,
    GameSessionFinalizer,
  ],
  controllers: [GameSessionController],
})
export class GameSessionModule {}
