import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

export abstract class BaseRepository {
  abstract readonly tableName: string;

  constructor(@InjectConnection() protected readonly knex: Knex) {}
}
