import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({})
class TestModule {}

async function bootstrap() {
  const app = await NestFactory.create(TestModule);
  const port = process.env.PORT ;
  await app.listen(port);
  console.log(`Test server running on http://localhost:${port}`);
}

bootstrap();
