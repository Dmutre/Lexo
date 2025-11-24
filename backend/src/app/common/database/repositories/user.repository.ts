import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

export type User = {
  userId: string;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  expirience: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserType = Omit<User, 'userId' | 'expirience' | 'createdAt' | 'updatedAt'>;

@Injectable()
export class UserRepository extends BaseRepository {
  readonly tableName = 'Users';

  constructor(@InjectConnection() knex: Knex) {
    super(knex);
  }

  public async createUser(data: CreateUserType): Promise<User> {
    return await this.knex<User>(this.tableName)
      .insert(data)
      .returning('*')
      .then((rows) => rows[0]);
  }

  public async findById(userId: string): Promise<User | null> {
    const user = await this.knex<User>(this.tableName).where({ userId }).first();

    return user ?? null;
  }

  public async findFirst(where: { email?: string; username?: string }): Promise<User | null> {
    const user = await this.knex<User>(this.tableName)
      .where({ ...where })
      .first();

    return user ?? null;
  }

  public async updateUser(
    userId: string,
    data: { username?: string; avatarUrl?: string },
  ): Promise<User> {
    return await this.knex<User>(this.tableName)
      .where({ userId })
      .update(data)
      .returning('*')
      .then((rows) => rows[0]);
  }
}
