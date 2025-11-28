import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { UserRepository } from './repositories/user.repository';
import { GameSessionRepository } from './repositories/game-session.repository';
import { GameRoundRepository } from './repositories/game-round.repository';

const providers = [UserRepository, GameSessionRepository, GameRoundRepository];

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'pg',
          version: '17',
          connection: {
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            user: configService.get<string>('database.user'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.name'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
