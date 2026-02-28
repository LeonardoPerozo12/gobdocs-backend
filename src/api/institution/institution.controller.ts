import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { InstitutionService } from '../../application/institution/institution.service';
import { CreateInstitutionDto } from '../../common/dtos/institution/create.institution.dto';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolUsuario } from '@prisma/client';
import { Public } from 'src/common/auth/public.decorator';


@Controller('institution')
export class InstitutionController {
  constructor(
    private readonly institutionService: InstitutionService,
  ) {}

  @Post('create')
  @Public()
  // @Roles(RolUsuario.OPERADOR, RolUsuario.ADMIN)
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() dto: CreateInstitutionDto,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.institutionService.create(dto, logo);
  }

  @Public()
  @Get()
  async getAll() {
    return this.institutionService.findAll();
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.institutionService.findOne(id);
  }
}
