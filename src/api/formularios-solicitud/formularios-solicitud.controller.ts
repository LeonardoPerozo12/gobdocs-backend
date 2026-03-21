import {Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { FormulariosSolicitudService } from "src/application/formulario-solicitud/formularios-solicitud.service";
import { Public } from "src/common/auth/public.decorator";
import { CreateFormularioSolicitudDto } from "src/common/dtos/formularios-solicitud/create-formulario-solicitud.dto";
import { UpdateFormularioSolicitudDto } from "src/common/dtos/formularios-solicitud/update-formulario-solicitud.dto";

@Controller("formularios")
export class FormulariosSolicitudController {

  constructor(
    private readonly formulariosService: FormulariosSolicitudService
  ) {}

  @Post()
  create(@Body() dto: CreateFormularioSolicitudDto) {
    return this.formulariosService.create(dto);
  }

  @Get()
  findAll() {
    return this.formulariosService.findAll();
  }

  @Get("tipo-documento/:id")
  @Public()
  findByTipoDocumento(@Param("id") id: string) {
    return this.formulariosService.findByTipoDocumento(Number(id));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.formulariosService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateFormularioSolicitudDto
  ) {
    return this.formulariosService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.formulariosService.remove(id);
  }
}