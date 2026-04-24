import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AuthService } from '../../common/auth/auth.service';
import { UserLoginDto } from '../../common/dtos/user/user.login.dto';
import { ForgotPasswordDto } from '../../common/dtos/auth/forgot-password.dto';
import { ResetPasswordDto } from '../../common/dtos/auth/reset-password.dto';

import { Roles } from 'src/common/auth/roles.decorator';
import { RolUsuario } from '@prisma/client';
import { Public } from 'src/common/auth/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() dto: UserLoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @Roles(RolUsuario.ADMIN, RolUsuario.OPERADOR, RolUsuario.CIUDADANO)
  me(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(
      dto.token,
      dto.newPassword,
    );
  }
}