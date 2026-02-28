import { Injectable, NotFoundException } from "@nestjs/common";
import { SolicitudRepository } from "src/infrastructure/repositories/solicitud.repository";
import { EstadoSolicitud } from "@prisma/client";
import { CreateSolicitudDto } from "src/common/dtos/solicitud/create.solicitud.dto";
import { InstitutionRepository } from "src/infrastructure/repositories/institution.repository";

@Injectable()
export class SolicitudService {
    constructor(
        private readonly solicitudRepository: SolicitudRepository,
        private readonly institutionRepository: InstitutionRepository,
    ) {}

    async createSolicitud(userId: string, data: CreateSolicitudDto) {
        
        // Verify if insitution exists
        const solicitud = await this.institutionRepository.findUnique({
            where : {
                Institucion_ID: data.institucionId,
            },
        });

        if(!solicitud){
            throw new NotFoundException('No se encontró la institución');
        }
    }
}