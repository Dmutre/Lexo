import { Module } from '@nestjs/common';
import { WordModule } from '../word/word.module';
import { PartialGameModeStrategy } from './game-mode/strategies/partial-game-mode.strategy';
import { RandomLetterStrategy } from './game-mode/strategies/random-letter-game-mode.strategy';
import { GameModeFactory } from './game-mode/game-mode.factory';
import { GameSessionController } from './game-session.controller';

@Module({
  imports: [WordModule],
  providers: [PartialGameModeStrategy, RandomLetterStrategy, GameModeFactory],
  controllers: [GameSessionController],
})
export class GameSessionModule {}
