import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GameSessionService } from './game-session.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { UserRequest } from '../../common/types/user-request';
import { CreateGameSessionDto } from './dto/create-game-sessioin.dto';
import { ValidateAnswerDto } from './dto/validate-answer.dto';
import { GetRoundDto } from './dto/get-round.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GameSessionDto } from './dto/game-session.dto';
import { GameRoundDto } from './dto/game-round.dto';

@ApiTags('game-session')
@UseGuards(AuthGuard)
@Controller('game-session')
export class GameSessionController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game session' })
  public createGameSession(
    @Req() request: UserRequest,
    @Body() body: CreateGameSessionDto,
  ): Promise<GameSessionDto> {
    return this.gameSessionService.createGameSession(request.user.userId, body);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get game session details with rounds' })
  @ApiParam({ name: 'id', description: 'Game session ID' })
  public getGameSession(
    @Req() request: UserRequest,
    @Param('id') gameSessionId: string,
  ): Promise<GameSessionDto> {
    return this.gameSessionService.getGameSession(gameSessionId, request.user.userId);
  }

  @Post('/round')
  @ApiOperation({ summary: 'Get a new game round for the session' })
  public getGameSessionRound(
    @Req() request: UserRequest,
    @Body() body: GetRoundDto,
  ): Promise<GameRoundDto> {
    return this.gameSessionService.getGameSessionRound(body.gameSessionId, request.user.userId);
  }

  @Post('/round/validate')
  @ApiOperation({ summary: 'Validate answer for a game round' })
  public validateGameRoundAnswer(
    @Req() request: UserRequest,
    @Body() body: ValidateAnswerDto,
  ): Promise<GameRoundDto> {
    return this.gameSessionService.validateGameRoundAnswer(
      body.gameRoundId,
      body.userAnswer,
      request.user.userId,
    );
  }

  @Put('/:id/finalize')
  @ApiOperation({ summary: 'Manually finalize a game session' })
  @ApiParam({ name: 'id', description: 'Game session ID' })
  public finalizeGameSession(
    @Req() request: UserRequest,
    @Param('id') gameSessionId: string,
  ): Promise<GameSessionDto> {
    return this.gameSessionService.finalizeUserGameSession(gameSessionId, request.user.userId);
  }
}
