import { IsInt, IsNotEmpty } from 'class-validator';

export class ServicioSolicitudDto {
    @IsInt()
    @IsNotEmpty()
    tarifarioCodigo: number; // FK al tarifario

    @IsInt()
    @IsNotEmpty()
    cantidad: number;
}