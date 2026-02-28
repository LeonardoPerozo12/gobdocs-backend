// src/common/dtos/tipo-documento/update.tipo-documento.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDocumentoDto } from './create-tipo-documento.dto';

export class UpdateTipoDocumentoDto extends PartialType(CreateTipoDocumentoDto) {}