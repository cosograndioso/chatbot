import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Controller, Get } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
void bootstrap(); // ✅ Corretto secondo ESLint

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return '✅ Server NestJS attivo. Gateway WebSocket pronto!';
  }
}
