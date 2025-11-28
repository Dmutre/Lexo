import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ValidateAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  gameRoundId: string;

  @IsString()
  @IsNotEmpty()
  userAnswer: string;
}
