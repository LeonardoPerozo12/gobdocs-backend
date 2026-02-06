import { Module } from '@nestjs/common';
import { UserService } from '../application/users/user.service';
import { UserController } from '../api/users/user.controller';
import { UserInfraModule } from '../infrastructure/InfraModules/user-infra.module';
import { AuthModule } from '../common/auth/auth.module';


@Module({
  imports: [
    UserInfraModule, // repos + prisma
    AuthModule,      // AuthService (login / jwt)
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}
