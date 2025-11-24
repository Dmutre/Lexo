import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { InjectConnection } from "nest-knexjs";
import { Knex } from "knex";

export type User = {
  userId: string;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  expirience: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserRepository extends BaseRepository {
  readonly tableName = 'Users';

  constructor(@InjectConnection() knex: Knex) {
    super(knex);
  }


}