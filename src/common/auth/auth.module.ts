import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../../api/auth/auth.controller';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { EmailModule } from 'src/modules/email.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'gobdocs_dev_secret',
      signOptions: { expiresIn: '1h' },
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserRepository,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
