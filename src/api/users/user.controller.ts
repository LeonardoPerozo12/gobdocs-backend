// src/application/user/user.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Get,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from '../../application/users/user.service';
import { UserRegisterDto } from '../../common/dtos/user/user.register.dto';
import { OperatorRegisterDto } from 'src/common/dtos/user/user.operator.register';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolUsuario } from '@prisma/client';
import { Public } from 'src/common/auth/public.decorator';
import { AdminRegisterDto } from 'src/common/dtos/user/user.admin.register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
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

  // mass upload de operadores desde un archivo Excel
  @Post('operadores/bulk/:institucionId')
  @Roles(RolUsuario.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadOperadores(
    @Param('institucionId') institucionId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.bulkCreateOperadores(institucionId, file);
  }

  @Get('operadores/template')
  @Roles(RolUsuario.ADMIN)
  downloadTemplate(@Res() res: Response) {
    const data = [
      {
        nombre: '',
        apellido: '',
        correo: '',
        cedula: '',
      },
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan@gmail.com',
        cedula: '00112345678',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'data');

    const instructions = [
      { instrucciones: 'No modificar nombres de columnas' },
      { instrucciones: 'No dejar campos vacíos' },
      { instrucciones: 'Correo debe ser válido' },
      { instrucciones: 'Cédula debe ser única' },
      { instrucciones: 'Guardar como .xlsx' },
    ];

    const instructionSheet = XLSX.utils.json_to_sheet(instructions);
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'instrucciones');

    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="plantilla_operadores.xlsx"',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.send(buffer);
  }
}