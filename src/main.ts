import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);

    app.enableCors({
    origin: [
      'http://localhost:5173',              // tu front local (Vite)
      // 'https://tu-front.vercel.app',       // tu dominio real del front (cuando lo tengas)
    ],
    credentials: true,
  });
}
bootstrap();

