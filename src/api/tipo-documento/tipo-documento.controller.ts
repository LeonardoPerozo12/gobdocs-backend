import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TipoDocumentoService } from '../../application/tipo-documento/tipo-documento.service';
import { CreateTipoDocumentoDto } from '../../common/dtos/tipo-documento/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from '../../common/dtos/tipo-documento/update.tipo-documento.dto';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolUsuario } from '@prisma/client';
import { Public } from 'src/common/auth/public.decorator';

@Controller('document-type')
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  // Crear un nuevo tipo de documento para una institución específica
  @Post('institution/:institutionId')
  @Roles(RolUsuario.ADMIN, RolUsuario.OPERADOR)
  async createForInstitution(
    @Param('institutionId') institutionId: string,
    @Body() dto: CreateTipoDocumentoDto,
  ) {
    return this.tipoDocumentoService.createForInstitution(institutionId, dto);
  }
  @Get()
  @Public()
  async findAll() {
    return this.tipoDocumentoService.findAll();
  }   

  // Obtener todos los tipos de documento de una institución específica
  @Get('institution/:institutionId')
  @Public() // o quítalo si quieres que sea protegido
  async findByInstitution(@Param('institutionId') institutionId: string) {
    return this.tipoDocumentoService.findByInstitution(institutionId);
  }

  // Obtener un tipo de documento por su ID
  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoDocumentoService.findOne(id);
  }
  
  // Actualizar un tipo de documento por su ID
  @Patch(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.OPERADOR)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoDocumentoDto,
  ) {
    return this.tipoDocumentoService.update(id, dto);
  }
}
