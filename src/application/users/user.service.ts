import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserRegisterDto } from '../../common/dtos/user/user.register.dto';
import { RolUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OperatorRegisterDto } from 'src/common/dtos/user/user.operator.register';
import { InstitutionRepository } from 'src/infrastructure/repositories/institution.repository';
import { AdminRegisterDto } from 'src/common/dtos/user/user.admin.register.dto';

import { EmailService } from 'src/infrastructure/email/email.service';
import { ExcelService } from '../excel/excel.service';
import { randomBytes } from 'crypto';

type ResultadoCarga = {
  correo: string;
  status: 'success' | 'error';
  reason?: string;
};

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly institutionRepository: InstitutionRepository,
    private readonly emailService: EmailService,
    private readonly excelService: ExcelService,
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

  async getAllUsers() {
    const users = await this.userRepository.findMany({
      include: {
        institucion: true, // opcional pero útil
      },
    });

    // 🔥 quitar contraseñas
    return users.map(({ Contrasena, ...user }) => user);
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

  async bulkCreateOperadores(institucionId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    const data = this.excelService.parseExcel(file);

    const resultados: ResultadoCarga[] = [];

    const institution = await this.institutionRepository.findUnique({
      where: { Institucion_ID: institucionId },
    });

    if (!institution) {
      throw new NotFoundException('Institución no encontrada');
    }
    for (const row of data as any[]) {
      const requiredFields = ['nombre', 'apellido', 'correo', 'cedula'];

      const hasValidStructure = requiredFields.every((field) =>
        row.hasOwnProperty(field),
      );

      if (!hasValidStructure) {
        throw new BadRequestException(
          'Formato de Excel inválido. Columnas requeridas: nombre, apellido, correo, cedula',
        );
      }

      const nombre = row['nombre']?.toString().trim();
      const apellido = row['apellido']?.toString().trim();
      const correo = row['correo']?.toString().trim().toLowerCase();
      const cedula = row['cedula']?.toString().trim();

      if (!nombre || !apellido || !correo || !cedula) {
        resultados.push({
          correo: correo || 'N/A',
          status: 'error',
          reason: 'Datos incompletos',
        });
        continue;
      }

      const tempPassword = randomBytes(6).toString('base64').slice(0, 10);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      const existing = await this.userRepository.findByEmail(correo);

      if (existing) {
        resultados.push({
          correo,
          status: 'error',
          reason: 'Correo ya existe',
        });
        continue;
      }

      try {
        await this.userRepository.create({
          data: {
            Nombre: `${nombre} ${apellido}`,
            Correo: correo,
            Cedula: cedula,
            Contrasena: hashedPassword,
            Rol: 'OPERADOR',
            Institucion_ID: institucionId,
            // DebeCambiarContrasena: true,
          },
        });

        void this.emailService.sendOperatorWelcomeEmail(correo, {
          nombre: `${nombre} ${apellido}`,
          correo,
          password: tempPassword,
        });

        resultados.push({
          correo,
          status: 'success',
        });
      } catch (error) {
        resultados.push({
          correo,
          status: 'error',
          reason: 'Duplicado o error en DB',
        });
      }
    }

    return {
      total: data.length,
      exitosos: resultados.filter((r) => r.status === 'success').length,
      errores: resultados.filter((r) => r.status === 'error'),
    };
  }
}
