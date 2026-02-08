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


@Controller('institution')
export class InstitutionController {
  constructor(
    private readonly institutionService: InstitutionService,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() dto: CreateInstitutionDto,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.institutionService.create(dto, logo);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.institutionService.findOne(id);
  }
}
