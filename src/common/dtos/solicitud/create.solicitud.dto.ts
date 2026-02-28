import {
    IsUUID,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServicioSolicitudDto } from './create-servicio-solicitud.dto';

export class CreateSolicitudDto {
    @IsUUID()
    @IsNotEmpty()
    institucionId: string;

    @IsUUID()
    @IsNotEmpty()
    formularioId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServicioSolicitudDto)
    servicios: ServicioSolicitudDto[];

    @IsObject()
    @IsNotEmpty()
    respuestas: Record<string, any>; // JSON del form

    // Si quieres permitir comentarios del ciudadano:
    // @IsOptional()
    // @IsString()
    // comentarios?: string;
}