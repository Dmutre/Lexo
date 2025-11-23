import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  app.useLogger(logger);

  const PORT = configService.get<number>('app.port') || 3000;
  const HOST = configService.get<string>('app.host') || 'localhost';

  await app.listen(PORT, HOST, () => {
    logger.log(`Server running at http://${HOST}:${PORT}`);
  });
}

bootstrap();
