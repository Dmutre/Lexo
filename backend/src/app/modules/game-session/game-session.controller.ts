import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GameSessionService } from './game-session.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { UserRequest } from '../../common/types/user-request';
import { CreateGameSessionDto } from './dto/create-game-sessioin.dto';

@UseGuards(AuthGuard)
@Controller('game-session')
export class GameSessionController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @Post()
  createGameSession(@Req() request: UserRequest, @Body() body: CreateGameSessionDto) {
    return this.gameSessionService.createGameSession(request.user.userId, body);
  }
}
