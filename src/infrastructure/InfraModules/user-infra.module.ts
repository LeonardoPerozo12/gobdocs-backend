import { Module } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { PrismaModule } from '../db/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [
    UserRepository,
  ],
  exports: [
    UserRepository,
  ],
})
export class UserInfraModule {}
