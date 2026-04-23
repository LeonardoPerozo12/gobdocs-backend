import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { SolicitudRepository } from "src/infrastructure/repositories/solicitud.repository";
import { EstadoSolicitud } from "@prisma/client";
import { PrismaService } from "src/infrastructure/db/prisma.service";

// 🔥 IMPORTAR EMAIL
import { EmailService } from "src/infrastructure/email/email.service";

@Injectable()
export class SolicitudService {
    constructor(
        private readonly solicitudRepository: SolicitudRepository,
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
    ) {}

    // CREAR SOLICITUD
    async createSolicitud(userId: string, data: any) {
        const { solicitudes } = data;

        if (!solicitudes || !solicitudes.length) {
            throw new NotFoundException('No hay solicitudes');
        }

        const usuario = await this.prisma.usuario.findUnique({
            where: { Usuario_ID: userId },
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const resultados: any[] = [];

        for (const solicitudItem of solicitudes) {
            const { Formulario_ID, respuestas, detalles } = solicitudItem;

            if (!Formulario_ID) {
                throw new NotFoundException('Formulario_ID es requerido');
            }

            if (!detalles || !detalles.length) {
                throw new BadRequestException('Debe incluir detalles de tarifas');
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
            });

            const tarifariosIds = detalles.map((d: any) => d.tarifarioId);

            const tarifarios = await this.prisma.tarifarioDeServicio.findMany({
                where: {
                    Tarifario_Codigo: {
                        in: tarifariosIds,
                    },
                },
            });

            if (tarifarios.length !== detalles.length) {
                throw new BadRequestException('Uno o más tarifarios no existen');
            }

            for (const detalle of detalles) {
                await this.prisma.detalleSolicitud.create({
                    data: {
                        Solicitud_ID: solicitudCreada.Numero_Solicitud,
                        Tarifario_Codigo: detalle.tarifarioId,
                        Cantidad: detalle.cantidad,
                    },
                });
            }

            const total = tarifarios.reduce((acc, t) => {
                const item = detalles.find((d: any) => d.tarifarioId === t.Tarifario_Codigo);
                return acc + Number(t.Costo_Por_Servicio) * (item?.cantidad || 1);
            }, 0);

            resultados.push({
                ...solicitudCreada,
                monto_estimado: total,
            });

            // 🔥 EMAIL: SOLICITUD CREADA
            this.emailService
                .sendSolicitudCreada(usuario.Correo, {
                    nombre: usuario.Nombre,
                    numero: solicitudCreada.Numero_Solicitud,
                    estado: solicitudCreada.Estado,
                })
                .catch((error) => {
                    console.error(
                        `Error enviando email de solicitud #${solicitudCreada.Numero_Solicitud}:`,
                        error,
                    );
                });
        }

        return resultados;
    }

    // OBTENER SOLICITUDES DEL USUARIO
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

    // 🔥 NUEVO MÉTODO RESTAURADO (ESTO TE ARREGLA EL ERROR)
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

    // EMITIR DOCUMENTO (OPERADOR)
    async emitirDocumento(
        numeroSolicitud: number,
        file: Express.Multer.File,
        comentario?: string,
    ) {

        if (!file) {
            throw new BadRequestException("Debe subir un archivo");
        }

        if (!comentario || comentario.trim() === "") {
            throw new BadRequestException("El comentario es obligatorio");
        }

        const solicitud = await this.prisma.solicitud.findUnique({
            where: { Numero_Solicitud: numeroSolicitud },
            include: {
                usuario: true,
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

        if (solicitud.Estado === EstadoSolicitud.APROBADA) {
            throw new BadRequestException("La solicitud ya fue aprobada");
        }

        if (!solicitud.formulario?.tipoDocumento) {
            throw new NotFoundException(
                "El formulario no tiene tipo de documento asociado"
            );
        }

        const tipoDocumentoId =
            solicitud.formulario.tipoDocumento.TipoDocumento_ID;

        const fileUrl = `documentos/${numeroSolicitud}-${Date.now()}.pdf`;

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

        const solicitudActualizada = await this.prisma.solicitud.update({
            where: { Numero_Solicitud: numeroSolicitud },
            data: {
                Estado: EstadoSolicitud.APROBADA,
                Comentarios: comentario,
                Fecha_Cierre: new Date(),
                Fecha_Ultima_Actualizacion: new Date(),
            },
        });

        // 🔥 EMAIL: SOLICITUD APROBADA
        this.emailService
            .sendSolicitudAprobada(solicitud.usuario.Correo, {
                nombre: solicitud.usuario.Nombre,
                numero: solicitud.Numero_Solicitud,
                link: fileUrl,
            })
            .catch((error) => {
                console.error(
                    `Error enviando email de aprobación #${numeroSolicitud}:`,
                    error,
                );
            });

        return solicitudActualizada;
    }

    async calcularMontoDesdeSolicitud(solicitudId: number) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { Numero_Solicitud: solicitudId },
            include: {
                detalles: {
                    include: {
                        tarifario: true,
                    },
                },
            },
        });

        if (!solicitud) {
            throw new NotFoundException('Solicitud no encontrada');
        }

        return solicitud.detalles.reduce((acc, d) => {
            return acc + Number(d.tarifario.Costo_Por_Servicio) * d.Cantidad;
        }, 0);
    }
}