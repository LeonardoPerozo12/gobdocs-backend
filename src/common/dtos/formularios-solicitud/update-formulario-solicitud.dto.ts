import { PartialType } from '@nestjs/mapped-types';
import { CreateFormularioSolicitudDto } from './create-formulario-solicitud.dto';

export class UpdateFormularioSolicitudDto extends PartialType(
  CreateFormularioSolicitudDto,
) {}