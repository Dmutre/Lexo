import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

export enum GameSessionMode {
  PARTIALS = 'PARTIALS',
  LETTERS = 'LETTERS',
}

export enum GameSessionStatus {
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export type GameSession = {
  gameSessionId: string;
  userId: string;
  mode: GameSessionMode;
  status: GameSessionStatus;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class GameSessionRepository extends BaseRepository {
  readonly tableName = 'GameSessions';

  constructor(@InjectConnection() knex: Knex) {
    super(knex);
  }
}
