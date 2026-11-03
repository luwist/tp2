import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, { cors: true });

//   app.enableCors();
//   app.useGlobalPipes(new ValidationPipe({ transform: true }));

//   await app.listen(process.env.PORT ?? 3000);
// }

async function bootstrap() {
  console.log('[boot] starting, node', process.version);
  console.log('[boot] MONGO_URI defined:', !!process.env.MONGO_URI);

  const app = await NestFactory.create(AppModule, { cors: true });
  console.log('[boot] Nest created');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 3000);
  console.log('[boot] listening');
}

try {
  await bootstrap();
} catch (error) {
  console.error('Failed to start application:', error);
  process.exit(1);
}
