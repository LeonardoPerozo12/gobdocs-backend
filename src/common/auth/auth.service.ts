import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// import { PrismaService } from '../../infrastructure/db/prisma.service';
import { UserLoginDto } from '../dtos/user/user.login.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { ForgotPasswordDto } from '../dtos/auth/forgot-password.dto';
import { EmailService } from 'src/infrastructure/email/email.service';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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

  async forgotPassword(dto: ForgotPasswordDto) {
    const usuario = await this.userRepository.findByEmail(dto.email);

    if (!usuario) {
      return { message: 'Si el correo existe, recibirá instrucciones' };
    }

    const token = this.jwtService.sign(
      { sub: usuario.Usuario_ID, type: 'reset' },
      { expiresIn: '15m' },
    );

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await this.emailService.sendResetPasswordEmail(usuario.Correo, {
      nombre: usuario.Nombre,
      link: resetLink,
    });

    return {
      message: 'Si el correo existe, recibirá instrucciones',
    };
  }
  async resetPassword(token: string, newPassword: string) {
    let payload: any;

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    
    if (payload.type !== 'reset') {
      throw new UnauthorizedException('Token inválido');
    }
    const usuario = await this.userRepository.findUnique({
      where: { Usuario_ID: payload.sub },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const isSame = await bcrypt.compare(newPassword, usuario.Contrasena);

    if (isSame) {
      throw new BadRequestException('La nueva contraseña debe ser diferente');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update({
      where: { Usuario_ID: usuario.Usuario_ID },
      data: {
        Contrasena: hashedPassword,
      },
    });

    await this.emailService.sendPasswordChangedEmail(usuario.Correo, {
      nombre: usuario.Nombre,
    });
    return {
      message: 'Contraseña restablecida correctamente',
    };
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
