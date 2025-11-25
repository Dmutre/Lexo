import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { BaseRepository } from './base.repository';

@Injectable()
export class GameRoundRepository extends BaseRepository {
  readonly tableName = 'GameRounds';

  constructor(@InjectConnection() knex: Knex) {
    super(knex);
  }
}
