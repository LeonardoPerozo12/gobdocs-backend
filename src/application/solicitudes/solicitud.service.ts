import { Injectable, NotFoundException } from "@nestjs/common";
import { SolicitudRepository } from "src/infrastructure/repositories/solicitud.repository";
import { EstadoSolicitud } from "@prisma/client";
import { CreateSolicitudDto } from "src/common/dtos/solicitud/create.solicitud.dto";
import { PrismaService } from "src/infrastructure/db/prisma.service";

@Injectable()
export class SolicitudService {
    constructor(
        private readonly solicitudRepository: SolicitudRepository,
        private readonly prisma: PrismaService, // 
    ) {}

   async createSolicitud(userId: string, data: any) {

        const { solicitudes } = data;

        if (!solicitudes || !solicitudes.length) {
            throw new NotFoundException('No hay solicitudes');
        }

        const resultados: any[] = [];

        for (const solicitudItem of solicitudes) {

            const { Formulario_ID, respuestas } = solicitudItem;

            console.log("🟡 Procesando solicitud:", solicitudItem);

            if (!Formulario_ID) {
                throw new NotFoundException('Formulario_ID es requerido');
            }

            // 🔥 1. Buscar formulario
            const formulario = await this.prisma.formulariosSolicitud.findUnique({
                where: { Formulario_ID },
                include: {
                    tipoDocumento: true,
                },
            });

            if (!formulario) {
                throw new NotFoundException('Formulario no encontrado');
            }

            const institucionId = formulario.tipoDocumento?.Institucion_ID;

            if (!institucionId) {
                throw new NotFoundException('El formulario no tiene institución');
            }

            const now = new Date();

            // 🔥 2. Crear respuesta
            const respuestaCreada = await this.prisma.respuestaFormulario.create({
                data: {
                    Formulario_ID,
                    Respuestas: respuestas,
                },
            });

            // 🔥 3. Crear solicitud
            const solicitudCreada = await this.prisma.solicitud.create({
                data: {
                    Usuario_ID: userId,
                    Institucion_ID: institucionId,
                    Formulario_ID,
                    Respuesta_ID: respuestaCreada.Respuesta_ID,

                    Estado: EstadoSolicitud.PENDIENTE,
                    Respuesta: '',
                    Comentarios: '',
                    Fecha_Emision: now,
                    Fecha_Cierre: now,
                    Fecha_Ultima_Actualizacion: now,
                },
                include: {
                    respuesta: true,
                },
            });

            resultados.push(solicitudCreada);
        }

        return resultados;
    }
}