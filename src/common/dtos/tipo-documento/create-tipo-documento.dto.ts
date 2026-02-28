import { IsString, IsOptional } from 'class-validator';

export class CreateTipoDocumentoDto {
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;
}
