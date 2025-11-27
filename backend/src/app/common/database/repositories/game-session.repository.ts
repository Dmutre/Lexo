import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { DictionaryType } from '../../../modules/word/dictionary/dictionary.factory';
import { GameRound } from './game-round.repository';

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
  finishesAt: Date;
  language: DictionaryType;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateGameSessionType = Omit<
  GameSession,
  'gameSessionId' | 'score' | 'createdAt' | 'updatedAt'
>;

export type UpdateGameSessionType = Partial<{
  status: GameSessionStatus;
  score: number;
}>;

@Injectable()
export class GameSessionRepository extends BaseRepository {
  readonly tableName = 'GameSessions';

  constructor(@InjectConnection() knex: Knex) {
    super(knex);
  }

  public async createGameSession(data: CreateGameSessionType): Promise<GameSession> {
    return await this.knex<GameSession>(this.tableName)
      .insert(data)
      .returning('*')
      .then((rows) => rows[0]);
  }

  public async findById(gameSessionId: string): Promise<GameSession | null> {
    const session = await this.knex<GameSession>(this.tableName).where({ gameSessionId }).first();

    return session ?? null;
  }

  public async updateGameSession(
    gameSessionId: string,
    data: UpdateGameSessionType,
  ): Promise<GameSession | null> {
    const session = await this.findById(gameSessionId);

    if (!session) {
      return null;
    }

    return await this.knex<GameSession>(this.tableName)
      .where({ gameSessionId })
      .update(data)
      .returning('*')
      .then((rows) => rows[0]);
  }

  public async findSessionWithRounds(
    gameSessionId: string,
  ): Promise<(GameSession & { rounds: GameRound[] }) | null> {
    const session = await this.knex('GameSessions').where({ gameSessionId }).first();

    if (!session) return null;

    const rounds = await this.knex('GameRounds')
      .where({ sessionId: gameSessionId })
      .orderBy('createdAt', 'asc');

    return {
      ...session,
      rounds,
    };
  }
}
