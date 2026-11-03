console.log('[boot] 1 file loaded', process.version);

const { NestFactory } = await import('@nestjs/core');
console.log('[boot] 2 @nestjs/core ok');

const { ValidationPipe } = await import('@nestjs/common');
console.log('[boot] 3 @nestjs/common ok');

const { AppModule } = await import('./app.module.js');
console.log('[boot] 4 AppModule ok');

try {
  const app = await NestFactory.create(AppModule, { cors: true });
  console.log('[boot] 5 Nest created');
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT ?? 3000);
  console.log('[boot] 6 listening');
} catch (error) {
  console.error('[boot] FAILED', error);
  process.exit(1);
}
