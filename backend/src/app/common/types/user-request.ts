import { User } from '../database/repositories/user.repository';

export type UserRequest = Request & {
  user: User;
};
