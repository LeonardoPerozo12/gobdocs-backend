import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from '../../api/auth/auth.controller';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { PrismaService } from '../../infrastructure/db/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'gobdocs_dev_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserRepository,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
