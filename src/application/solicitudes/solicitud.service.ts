import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { SolicitudRepository } from "src/infrastructure/repositories/solicitud.repository";
import { EstadoSolicitud, EstadoDocumento } from "@prisma/client";
import { PrismaService } from "src/infrastructure/db/prisma.service";
import { EmailService } from "src/infrastructure/email/email.service";
import { UpdateEstadoSolicitudDto } from "src/common/dtos/solicitud/update-estado-solicitud.dto";
import { S3Service } from "src/common/helper/s3.helper";

@Injectable()
export class SolicitudService {
    constructor(
        private readonly solicitudRepository: SolicitudRepository,
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
        private readonly s3Service: S3Service,
    ) {}

    // =========================
    // CREAR SOLICITUD
    // =========================
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
                include: { tipoDocumento: true },
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
                    Tarifario_Codigo: { in: tarifariosIds },
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

            this.emailService
                .sendSolicitudCreada(usuario.Correo, {
                    nombre: usuario.Nombre,
                    numero: solicitudCreada.Numero_Solicitud,
                    estado: solicitudCreada.Estado,
                })
                .catch(console.error);
        }

        return resultados;
    }

    // =========================
    // MAPEAR DOCUMENTOS → URLS
    // =========================
    private async attachSignedUrls(solicitudes: any[]) {
        return Promise.all(
            solicitudes.map(async (s) => {
                const docs = await Promise.all(
                    (s.documentos || []).map(async (doc: any) => {
                        let url: string | null = null;

                        if (doc.Url_Archivo) {
                            url = await this.s3Service.getSignedGetUrl(doc.Url_Archivo, 60 * 60);
                        }

                        return {
                            ...doc,
                            url,
                        };
                    })
                );

                return {
                    ...s,
                    documentos: docs,
                };
            })
        );
    }

    // =========================
    // GET USUARIO
    // =========================
    async getSolicitudesByUsuario(usuarioId: string) {
        const solicitudes = await this.prisma.solicitud.findMany({
            where: { Usuario_ID: usuarioId },
            include: {
                formulario: { include: { tipoDocumento: true } },
                respuesta: true,
                institucion: true,
                documentos: true,
            },
            orderBy: { Fecha_Emision: 'desc' },
        });

        return this.attachSignedUrls(solicitudes);
    }

    // =========================
    // GET INSTITUCIÓN
    // =========================
    async getSolicitudesByInstitucion(institucionId: string) {
        const solicitudes = await this.prisma.solicitud.findMany({
            where: { Institucion_ID: institucionId },
            include: {
                usuario: true,
                formulario: { include: { tipoDocumento: true } },
                respuesta: true,
                documentos: true,
            },
            orderBy: { Fecha_Emision: 'desc' },
        });

        return this.attachSignedUrls(solicitudes);
    }

    // =========================
    // DETALLE
    // =========================
    async getSolicitudById(numeroSolicitud: number) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { Numero_Solicitud: numeroSolicitud },
            include: {
                usuario: true,
                institucion: true,
                formulario: { include: { tipoDocumento: true } },
                respuesta: true,
                documentos: true,
            },
        });

        if (!solicitud) {
            throw new NotFoundException('Solicitud no encontrada');
        }

        const [result] = await this.attachSignedUrls([solicitud]);
        return result;
    }

    // =========================
    // EMITIR DOCUMENTO (S3)
    // =========================
    async emitirDocumento(
        numeroSolicitud: number,
        file: Express.Multer.File,
        comentario?: string,
    ) {

        if (!file) throw new BadRequestException("Debe subir un archivo");
        if (!comentario?.trim()) throw new BadRequestException("El comentario es obligatorio");

        const solicitud = await this.prisma.solicitud.findUnique({
            where: { Numero_Solicitud: numeroSolicitud },
            include: {
                usuario: true,
                formulario: { include: { tipoDocumento: true } },
            },
        });

        if (!solicitud) throw new NotFoundException("Solicitud no encontrada");

        if (solicitud.Estado === EstadoSolicitud.APROBADA) {
            throw new BadRequestException("La solicitud ya fue aprobada");
        }

        if (!solicitud.formulario?.tipoDocumento) {
            throw new NotFoundException("El formulario no tiene tipo de documento asociado");
        }

        const tipoDocumentoId =
            solicitud.formulario.tipoDocumento!.TipoDocumento_ID;

        // 🔥 SUBIR A S3
        const extension = file.originalname.split('.').pop();
        const key = `documentos/${numeroSolicitud}-${Date.now()}.${extension}`;

        const { key: storedKey } = await this.s3Service.uploadFile({
            buffer: file.buffer,
            key,
            contentType: file.mimetype,
        });

        // 🔥 GUARDAR
        await this.prisma.documento.create({
            data: {
                Nombre_Archivo: file.originalname,
                Url_Archivo: storedKey,
                Fecha_Emision: new Date(),
                Estado: EstadoDocumento.GENERADO,
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

        // 🔥 URL PARA EMAIL
        const signedUrl = await this.s3Service.getSignedGetUrl(storedKey, 60 * 60);

        this.emailService
            .sendSolicitudAprobada(solicitud.usuario.Correo, {
                nombre: solicitud.usuario.Nombre,
                numero: solicitud.Numero_Solicitud,
                link: signedUrl,
            })
            .catch(console.error);

        return solicitudActualizada;
    }

    // =========================
    // RECHAZAR
    // =========================
    async rechazarSolicitud(numeroSolicitud: number, dto: UpdateEstadoSolicitudDto) {
        const { estado, comentario } = dto;

        if (estado === EstadoSolicitud.PENDIENTE) {
            throw new BadRequestException("Para rechazar una solicitud, el estado debe ser RECHAZADA");
        }

        if (!comentario?.trim()) {
            throw new BadRequestException("El comentario es obligatorio");
        }

        const solicitud = await this.prisma.solicitud.findUnique({
            where: { Numero_Solicitud: numeroSolicitud },
            include: { usuario: true },
        });

        if (!solicitud) throw new NotFoundException("Solicitud no encontrada");

        if (solicitud.Estado === EstadoSolicitud.APROBADA) {
            throw new BadRequestException("No se puede rechazar una solicitud aprobada");
        }

        if (solicitud.Estado === EstadoSolicitud.RECHAZADA) {
            throw new BadRequestException("La solicitud ya fue rechazada");
        }

        const updatedSolicitud = await this.prisma.solicitud.update({
            where: { Numero_Solicitud: numeroSolicitud },
            data: {
                Estado: EstadoSolicitud.RECHAZADA,
                Comentarios: comentario,
                Fecha_Cierre: new Date(),
                Fecha_Ultima_Actualizacion: new Date(),
            },
        });

        this.emailService
            .sendSolicitudRechazada(solicitud.usuario.Correo, {
                nombre: solicitud.usuario.Nombre,
                numero: solicitud.Numero_Solicitud,
                motivo: comentario,
            })
            .catch(console.error);

        return updatedSolicitud;
    }

    // =========================
    // MONTO
    // =========================
    async calcularMontoDesdeSolicitud(solicitudId: number) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { Numero_Solicitud: solicitudId },
            include: {
                detalles: {
                    include: { tarifario: true },
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