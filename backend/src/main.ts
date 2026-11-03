console.log('QQQQQQQQQQQQQQQQQQQQQ');
import { NestFactory } from '@nestjs/core';
console.log('QEEEEEEEEEEEEEEEEEE');
import { AppModule } from './app.module.js';
console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
import { ValidationPipe } from '@nestjs/common';
console.log('ENTRA EN MAIN');

async function bootstrap() {
  console.log('EGGGGGGGGGGGGGGGGGGGGGGGGGG');
  const app = await NestFactory.create(AppModule, { cors: true });
  console.log('GGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
