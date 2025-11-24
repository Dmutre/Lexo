import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KnexModule } from "nest-knexjs";
import { UserRepository } from "./repositories/user.repository";

const providers = [UserRepository];

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'pg',
          connection: {
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            user: configService.get<string>('database.user'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.name'),
          }
        }
      }),
      inject: [ConfigService],
    })
  ],
  providers: [...providers],
  exports: [...providers]
})
export class DatabaseModule {}
