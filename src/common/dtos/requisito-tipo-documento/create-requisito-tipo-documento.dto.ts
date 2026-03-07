import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  MinLength,
} from "class-validator";

export class CreateRequisitoTipoDocumentoDto {

  @IsString()
  @MinLength(2)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  esObligatorio?: boolean;

  @IsOptional()
  @IsBoolean()
  requiereArchivo?: boolean;

  @IsOptional()
  @IsInt()
  tipoDocumentoRequeridoId?: number;
}