import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { RegistrationDto } from './dto/registration.dto';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { User } from '../../common/database/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from './dto/tokens.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt.payload';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async registerUser(data: RegistrationDto) {
    await this.validateUserExistence(data.email, data.username);

    const hashedPassword = await this.hashPassword(data.password);

    const newUser = await this.userService.createUser({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      avatarUrl: data.avatarUrl,
    });

    return this.generateTokens(newUser);
  }

  private async generateTokens(user: User): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateRefreshToken(user: User) {
    const refreshTtl = this.configService.get('auth.jwtRefreshTTL');
    const refreshToken = this.jwtService.sign<JwtPayload>(
      { sub: user.userId, isRefreshToken: true },
      { expiresIn: refreshTtl },
    );
    return refreshToken;
  }

  private async generateAccessToken(user: User) {
    const accessTtl = this.configService.get('auth.jwtAccessTTL');
    const accessToken = this.jwtService.sign<JwtPayload>(
      { sub: user.userId },
      { expiresIn: accessTtl },
    );
    return accessToken;
  }

  private async validateUserExistence(email?: string, username?: string): Promise<void> {
    const userExists = await this.userService.checkUserExistence({ email, username });
    if (userExists) {
      throw new HttpException('User with given email or username already exists', 400);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex'); // 16 байт солі
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, key] = storedHash.split(':');

    const hashedBuffer = Buffer.from(key, 'hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    return timingSafeEqual(hashedBuffer, derivedKey);
  }

  public async loginUser({ email, password }: LoginDto): Promise<TokensDto> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens(user);
  }

  public async getUserInfo(userId: string): Promise<any> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userInfo } = user;

    return userInfo;
  }

  public async refreshTokens(refreshToken: string): Promise<TokensDto> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);

      if (!payload.isRefreshToken) {
        throw new BadRequestException('Invalid refresh token');
      }

      const user = await this.userService.getUserById(payload.sub);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  public async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return payload;
    } catch (error) {
      throw new BadRequestException('Invalid access token');
    }
  }
}
