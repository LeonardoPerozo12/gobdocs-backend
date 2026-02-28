// src/application/user/user.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../../application/users/user.service';
import { UserRegisterDto } from '../../common/dtos/user/user.register.dto';
import { OperatorRegisterDto } from 'src/common/dtos/user/user.operator.register';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolUsuario } from '@prisma/client';
import { Public } from 'src/common/auth/public.decorator';
import { AdminRegisterDto } from 'src/common/dtos/user/user.admin.register.dto';
// import { UserLoginDto } from '../../common/dtos/user/user.login.dto';

@Controller('usuarios')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Public()
  @Post('registro-ciudadano')
  async registerCitizen(@Body() dto: UserRegisterDto) {
    return this.userService.registerCitzen(dto);
  }

  @Post('registro-operador')
  @Public()
  // @Roles(RolUsuario.ADMIN) // Solo ADMIN puede registrar operadores
  async registerOperator(@Body() dto: OperatorRegisterDto) {
    return this.userService.registerOperator(dto);
  }

  @Roles(RolUsuario.ADMIN)
  @Post('registro-admin')
  async registerAdmin(@Body() dto: AdminRegisterDto) {
    return this.userService.registerAdmin(dto);
  }

//   @Post('login')
//   async login(@Body() dto: UserLoginDto) {
//     return this.userService.login(dto); // esto llama al AuthService por dentro
//   }
}
