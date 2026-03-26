import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { SolicitudRepository } from "src/infrastructure/repositories/solicitud.repository";
import { EstadoSolicitud } from "@prisma/client";
import { PrismaService } from "src/infrastructure/db/prisma.service";

@Injectable()
export class SolicitudService {
    constructor(
        private readonly solicitudRepository: SolicitudRepository,
        private readonly prisma: PrismaService,
    ) {}

    // 🔥 CREAR SOLICITUD
    async createSolicitud(userId: string, data: any) {

        const { solicitudes } = data;

        if (!solicitudes || !solicitudes.length) {
            throw new NotFoundException('No hay solicitudes');
        }

        const resultados: any[] = [];

        for (const solicitudItem of solicitudes) {

            const { Formulario_ID, respuestas } = solicitudItem;

            if (!Formulario_ID) {
                throw new NotFoundException('Formulario_ID es requerido');
            }

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

            const respuestaCreada = await this.prisma.respuestaFormulario.create({
                data: {
                    Formulario_ID,
                    Respuestas: respuestas,
                },
            });

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

    // 🔥 OBTENER SOLICITUDES DEL USUARIO
    async getSolicitudesByUsuario(usuarioId: string) {
        return this.prisma.solicitud.findMany({
            where: {
                Usuario_ID: usuarioId,
            },
            include: {
                formulario: {
                    include: {
                        tipoDocumento: true,
                    },
                },
                respuesta: true,
                institucion: true,
                documentos: true,
            },
            orderBy: {
                Fecha_Emision: 'desc',
            },
        });
    }

    // 🔥 OBTENER SOLICITUDES POR INSTITUCIÓN
    async getSolicitudesByInstitucion(institucionId: string) {
        return this.prisma.solicitud.findMany({
            where: {
                Institucion_ID: institucionId,
            },
            include: {
                usuario: true,
                formulario: {
                    include: {
                        tipoDocumento: true,
                    },
                },
                respuesta: true,
                documentos: true,
            },
            orderBy: {
                Fecha_Emision: 'desc',
            },
        });
    }

    // 🔥 DETALLE DE SOLICITUD
    async getSolicitudById(numeroSolicitud: number) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: {
                Numero_Solicitud: numeroSolicitud,
            },
            include: {
                usuario: true,
                institucion: true,
                formulario: {
                    include: {
                        tipoDocumento: true,
                    },
                },
                respuesta: true,
                documentos: true,
            },
        });

        if (!solicitud) {
            throw new NotFoundException('Solicitud no encontrada');
        }

        return solicitud;
    }

    // 🔥 EMITIR DOCUMENTO (OPERADOR)
    async emitirDocumento(
        numeroSolicitud: number,
        file: Express.Multer.File,
        comentario?: string,
    ) {

        // 🔥 VALIDACIONES
        if (!file) {
            throw new BadRequestException("Debe subir un archivo");
        }

        if (!comentario || comentario.trim() === "") {
            throw new BadRequestException("El comentario es obligatorio");
        }

        const solicitud = await this.prisma.solicitud.findUnique({
            where: { Numero_Solicitud: numeroSolicitud },
            include: {
                formulario: {
                    include: {
                        tipoDocumento: true,
                    },
                },
            },
        });

        if (!solicitud) {
            throw new NotFoundException("Solicitud no encontrada");
        }

        // 🔥 evitar reprocesar
        if (solicitud.Estado === EstadoSolicitud.APROBADA) {
            throw new BadRequestException("La solicitud ya fue aprobada");
        }

        // 🔥 VALIDACIÓN TS SAFE
        if (!solicitud.formulario?.tipoDocumento) {
            throw new NotFoundException(
                "El formulario no tiene tipo de documento asociado"
            );
        }

        const tipoDocumentoId =
            solicitud.formulario.tipoDocumento.TipoDocumento_ID;

        // 🔥 MOCK S3 (luego reemplazas)
        const fileUrl = `documentos/${numeroSolicitud}-${Date.now()}.pdf`;

        // 🔥 CREAR DOCUMENTO
        await this.prisma.documento.create({
            data: {
                Nombre_Archivo: file.originalname,
                Url_Archivo: fileUrl,
                Fecha_Emision: new Date(),
                Estado: "GENERADO",
                TipoDocumento_ID: tipoDocumentoId,
                Solicitud_ID: numeroSolicitud,
            },
        });

        // 🔥 ACTUALIZAR SOLICITUD
        return this.prisma.solicitud.update({
            where: { Numero_Solicitud: numeroSolicitud },
            data: {
                Estado: EstadoSolicitud.APROBADA,
                Comentarios: comentario, // 🔥 ahora sí se guarda
                Fecha_Cierre: new Date(),
                Fecha_Ultima_Actualizacion: new Date(),
            },
        });
    }
}