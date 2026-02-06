import { Module } from '@nestjs/common';
import { AppController } from '../api/app/app.controller';
import { AppService } from '../application/app/app.service';
import { PrismaService } from '../infrastructure/db/prisma.service';
import { UserModule } from './user.modules';
import { AuthModule } from '../common/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  UserModule,
  AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
