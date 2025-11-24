import { Injectable } from '@nestjs/common';
import {
  CreateUserType,
  User,
  UserRepository,
} from '../../common/database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(data: CreateUserType): Promise<User> {
    return await this.userRepository.createUser(data);
  }

  public async getUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findFirst({ email });
  }

  public async checkUserExistence(args: { email?: string; username?: string }): Promise<boolean> {
    const user = await this.userRepository.findFirst({
      email: args.email,
      username: args.username,
    });
    return !!user;
  }

  public async updateUser(
    userId: string,
    data: { username?: string; avatarUrl?: string },
  ): Promise<User> {
    return await this.userRepository.updateUser(userId, data);
  }
}
