export class GameRoundDto {
  gameRoundId: string;
  gameSessionId: string;
  taskPayload: any;
  userAnswer: string | null;
  scoreAwarded: number | null;
  createdAt: Date;
  updatedAt: Date;
};