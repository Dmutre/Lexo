import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '../../common/database/database.module';

@Module({
  providers: [UserService],
  imports: [DatabaseModule],
  exports: [UserService],
})
export class UserModule {}
