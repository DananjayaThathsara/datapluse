import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
  });

  // reads PORT from .env — falls back to 3003
  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Alert service running on http://localhost:${port}`);
}
bootstrap();
