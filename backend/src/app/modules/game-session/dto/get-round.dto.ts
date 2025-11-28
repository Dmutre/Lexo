import { IsNotEmpty, IsString } from 'class-validator';

export class GetRoundDto {
  @IsString()
  @IsNotEmpty()
  gameSessionId: string;
}
