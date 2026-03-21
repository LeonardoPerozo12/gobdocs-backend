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
    Formulario_ID: string; // 🔥 ahora coincide con Prisma

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServicioSolicitudDto)
    servicios: ServicioSolicitudDto[];

    @IsObject()
    @IsNotEmpty()
    respuestas: Record<string, any>; // 🔥 JSON dinámico
}