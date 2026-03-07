import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFormularioSolicitudDto {
  @IsNumber()
  TipoDocumento_ID: number;

  @IsString()
  @IsNotEmpty()
  Nombre: string;

  @IsOptional()
  @IsString()
  Descripcion?: string;

  @IsOptional()
  @IsObject()
  Estructura?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  EsActivo?: boolean;
}