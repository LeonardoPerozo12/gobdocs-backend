import { Module } from '@nestjs/common';
import { AppController } from './api/app/app.controller';
import { AppService } from './application/app/app.service';
import { PrismaService } from './infrastructure/db/prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
