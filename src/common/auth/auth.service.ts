import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { UserLoginDto } from '../dtos/user/user.login.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository} from '../../infrastructure/repositories/user.repository';


@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository : UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  //  validate user credentials
  private async validateUser(email: string, password: string) {
    const usuario = await this.userRepository.findByEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.Activo) {
      throw new ForbiddenException('Usuario inactivo');
    }

    const passwordOk = await bcrypt.compare(password, usuario.Contrasena);
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return usuario;
  }

  // login that returns jwt
  async login(dto: UserLoginDto) {
    const usuario = await this.validateUser(dto.email, dto.password);

    const payload: JwtPayload = {
      sub: usuario.Usuario_ID,
      email: usuario.Correo,
      rol: usuario.Rol,
      institucionId: usuario.Institucion_ID,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: usuario.Usuario_ID,
        nombre: usuario.Nombre,
        email: usuario.Correo,
        rol: usuario.Rol,
        institucionId: usuario.Institucion_ID,
      },
    };
  }
}
