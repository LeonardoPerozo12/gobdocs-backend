// import dns from 'dns';
// dns.setDefaultResultOrder('ipv4first');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import "reflect-metadata";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();