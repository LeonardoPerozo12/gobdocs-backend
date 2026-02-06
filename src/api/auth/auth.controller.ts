import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../../common/auth/auth.service';
import { UserLoginDto } from '../../common/dtos/user/user.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: UserLoginDto) {
    return this.authService.login(dto);
  }
}
