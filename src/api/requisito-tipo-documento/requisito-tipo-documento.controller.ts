import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { RequisitoTipoDocumentoService } from '../../application/requisito-tipo-documento/requisito-tipo-documento.service';
import { CreateRequisitoTipoDocumentoDto } from 'src/common/dtos/requisito-tipo-documento/create-requisito-tipo-documento.dto';
import { UpdateRequisitoTipoDocumentoDto } from 'src/common/dtos/requisito-tipo-documento/update-requisito-tipo-documento.dto';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolUsuario } from '@prisma/client';
import { Public } from 'src/common/auth/public.decorator';


@Controller('document-requirement')
export class RequisitoTipoDocumentoController {
  constructor(
    private readonly requisitoService: RequisitoTipoDocumentoService,
  ) {}

  @Post('document-type/:tipoDocumentoId')
  @Roles(RolUsuario.ADMIN, RolUsuario.OPERADOR)
  create(
    @Param('tipoDocumentoId', ParseIntPipe) tipoDocumentoId: number,
    @Body() dto: CreateRequisitoTipoDocumentoDto,
  ) {
    return this.requisitoService.create(tipoDocumentoId, dto);
  }

  @Get('document-type/:tipoDocumentoId')
  @Public()
  findByTipoDocumento(
    @Param('tipoDocumentoId', ParseIntPipe) tipoDocumentoId: number,
  ) {
    return this.requisitoService.findByTipoDocumento(tipoDocumentoId);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.OPERADOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRequisitoTipoDocumentoDto,
  ) {
    return this.requisitoService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.requisitoService.remove(id);
  }
}