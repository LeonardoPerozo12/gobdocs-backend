import { Module } from '@nestjs/common';
import { AppController } from './api/app/app.controller';
import { AppService } from './application/app/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
