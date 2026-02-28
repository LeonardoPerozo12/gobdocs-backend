import { Injectable } from "@nestjs/common";
import { Solicitud } from "@prisma/client";
import { PrismaService } from "../db/prisma.service";
import { BaseRepository } from "./base.repository";

@Injectable()
export class SolicitudRepository extends BaseRepository<
    Solicitud,
    PrismaService['solicitud']
> {
    constructor(prisma: PrismaService) {
        super(prisma.solicitud);
    }

    async findByUserId(usuarioId: string){
        return this.delegate.findMany({
            where: {
                Usuario_ID: usuarioId,
            },
            orderBy: {
                Fecha_Ultima_Actualizacion: 'desc',
            },
        });
    }

    async findByInstitutionId(institucionId: string) {
        return this.delegate.findMany({
            where: {
                Institucion_ID: institucionId,
            },
            orderBy: {
                Fecha_Ultima_Actualizacion: 'desc',
            },
        });
    }
}