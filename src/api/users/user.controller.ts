// src/application/user/user.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../../application/users/user.service';
import { UserRegisterDto } from '../../common/dtos/user/user.register.dto';
// import { UserLoginDto } from '../../common/dtos/user/user.login.dto';

@Controller('usuarios')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registro-ciudadano')
  async registerCitizen(@Body() dto: UserRegisterDto) {
    return this.userService.registerCitzen(dto);
  }

//   @Post('login')
//   async login(@Body() dto: UserLoginDto) {
//     return this.userService.login(dto); // esto llama al AuthService por dentro
//   }
}
