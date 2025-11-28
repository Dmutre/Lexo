import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { BaseRepository } from './base.repository';
import { GameSession } from './game-session.repository';

export type GameRound = {
  gameRoundId: string;
  gameSessionId: string;
  taskPayload: any;
  userAnswer: string | null;
  scoreAwarded: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateGameRoundType = Omit<
  GameRound,
  'gameRoundId' | 'userAnswer' | 'scoreAwarded' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class GameRoundRepository extends BaseRepository {
  readonly tableName = 'GameRounds';

  constructor(@InjectConnection() knex: Knex) {
    super(knex);
  }

  public async createGameRound(data: CreateGameRoundType): Promise<GameRound> {
    return await this.knex<GameRound>(this.tableName)
      .insert(data)
      .returning('*')
      .then((rows) => rows[0]);
  }

  public async updateGameRound(
    gameRoundId: string,
    data: Partial<Pick<GameRound, 'userAnswer' | 'scoreAwarded'>>,
  ): Promise<GameRound> {
    return await this.knex<GameRound>(this.tableName)
      .where({ gameRoundId })
      .update(data)
      .returning('*')
      .then((rows) => rows[0]);
  }

  public async findById(
    gameRoundId: string,
  ): Promise<(GameRound & { session: GameSession }) | null> {
    const result = await this.knex('GameRounds as gr')
      .leftJoin('GameSessions as gs', 'gs.gameSessionId', 'gr.gameSessionId')
      .where('gr.gameRoundId', gameRoundId)
      .select('gr.*', this.knex.raw('to_jsonb(gs.*) as session'))
      .first();

    return result ?? null;
  }

  public async findByGameSessionId(gameSessionId: string): Promise<GameRound[]> {
    return await this.knex<GameRound>(this.tableName)
      .where({ gameSessionId })
      .orderBy('createdAt', 'asc');
  }

  public async getNotAnsweredRoundsByGameSessionId(gameSessionId: string): Promise<GameRound[]> {
    return await this.knex<GameRound>(this.tableName)
      .where({ gameSessionId, userAnswer: null })
      .orderBy('createdAt', 'asc');
  }
}
