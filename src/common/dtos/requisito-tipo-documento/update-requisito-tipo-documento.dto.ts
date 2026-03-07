import { PartialType } from '@nestjs/mapped-types';
import { CreateRequisitoTipoDocumentoDto } from './create-requisito-tipo-documento.dto';

export class UpdateRequisitoTipoDocumentoDto extends PartialType(
  CreateRequisitoTipoDocumentoDto,
) {}