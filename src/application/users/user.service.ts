import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserRegisterDto } from '../../common/dtos/user/user.register.dto';
import { RolUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OperatorRegisterDto } from 'src/common/dtos/user/user.operator.register';
import { InstitutionRepository } from 'src/infrastructure/repositories/institution.repository';
import { AdminRegisterDto } from 'src/common/dtos/user/user.admin.register.dto';

// 🔥 IMPORTAR EMAIL SERVICE
import { EmailService } from 'src/infrastructure/email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly institutionRepository: InstitutionRepository,
    private readonly emailService: EmailService, // 👈 INYECTAR
  ) {}

  // ===============================
  // 🟢 REGISTRO CIUDADANO (CON EMAIL)
  // ===============================
  async registerCitzen(data: UserRegisterDto) {
    const email = data.email.trim().toLowerCase();

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Ya hay un usuario con este correo');
    }

    const existingCedula = await this.userRepository.findByCedulaAndRol(
      data.cedula,
      RolUsuario.CIUDADANO,
    );
    if (existingCedula) {
      throw new ConflictException('Ya existe un CIUDADANO con esta cédula');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const fullName = `${data.nombre.trim()} ${data.apellido.trim()}`;

    const usuario = await this.userRepository.create({
      data: {
        Nombre: fullName,
        Cedula: data.cedula,
        Correo: email,
        Contrasena: hashedPassword,
        Rol: RolUsuario.CIUDADANO,
        Activo: true,
      },
    });

    // 🔥 ENVIAR EMAIL (NO BLOQUEANTE)
    this.emailService
      .sendWelcomeEmail(usuario.Correo, usuario.Nombre)
      .catch((error) => {
        console.error('Error enviando email de bienvenida:', error);
      });

    const { Contrasena, ...safeUser } = usuario;
    return safeUser;
  }

  // ===============================
  // 🟡 REGISTRO OPERADOR (SIN EMAIL)
  // ===============================
  async registerOperator(data: OperatorRegisterDto) {
    const email = data.email.trim().toLowerCase();

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Ya hay un usuario con este correo');
    }

    const existingCedula = await this.userRepository.findByCedulaAndRol(
      data.cedula,
      RolUsuario.OPERADOR,
    );
    if (existingCedula) {
      throw new ConflictException('Ya existe un OPERADOR con esta cédula');
    }

    const fullName = `${data.nombre.trim()} ${data.apellido.trim()}`;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const institution = await this.institutionRepository.findUnique({
      where: { Institucion_ID: data.institucionId },
    });

    if (!institution) {
      throw new NotFoundException('Institución no encontrada');
    }

    const usuario = await this.userRepository.create({
      data: {
        Nombre: fullName,
        Cedula: data.cedula,
        Correo: email,
        Contrasena: hashedPassword,
        Rol: RolUsuario.OPERADOR,
        Activo: true,
        Institucion_ID: data.institucionId,
      },
      include: { institucion: true },
    });

    const { Contrasena, ...safeUser } = usuario;
    return safeUser;
  }

  // ===============================
  // 🔵 REGISTRO ADMIN (SIN EMAIL)
  // ===============================
  async registerAdmin(data: AdminRegisterDto) {
    const email = data.email.trim().toLowerCase();

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Ya hay un usuario con este correo');
    }

    const existingCedula = await this.userRepository.findByCedulaAndRol(
      data.cedula,
      RolUsuario.ADMIN,
    );
    if (existingCedula) {
      throw new ConflictException('Ya existe un ADMIN con esta cédula');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const fullName = `${data.nombre.trim()} ${data.apellido.trim()}`;

    const usuario = await this.userRepository.create({
      data: {
        Nombre: fullName,
        Cedula: data.cedula,
        Correo: email,
        Contrasena: hashedPassword,
        Rol: RolUsuario.ADMIN,
      },
    });

    const { Contrasena, ...safeUser } = usuario;
    return safeUser;
  }
}