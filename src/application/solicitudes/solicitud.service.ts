import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EstadoSolicitud, EstadoDocumento } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/db/prisma.service';
import { EmailService } from 'src/infrastructure/email/email.service';
import { UpdateEstadoSolicitudDto } from 'src/common/dtos/solicitud/update-estado-solicitud.dto';
import { S3Service } from 'src/common/helper/s3.helper';

@Injectable()
export class SolicitudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly s3Service: S3Service,
  ) {}

  async createSolicitud(userId: string, data: any) {
    const { solicitudes } = data;

    if (!solicitudes?.length) {
      throw new NotFoundException('No hay solicitudes');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { Usuario_ID: userId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const resultados: any[] = [];

    for (const item of solicitudes) {
      const { Formulario_ID, respuestas, detalles } = item;

      if (!Formulario_ID) {
        throw new NotFoundException('Formulario_ID es requerido');
      }

      if (!detalles?.length) {
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

      const respuesta = await this.prisma.respuestaFormulario.create({
        data: {
          Formulario_ID,
          Respuestas: respuestas,
        },
      });

      const solicitud = await this.prisma.solicitud.create({
        data: {
          Usuario_ID: userId,
          Institucion_ID: institucionId,
          Formulario_ID,
          Respuesta_ID: respuesta.Respuesta_ID,
          Estado: EstadoSolicitud.PENDIENTE,
          Respuesta: '',
          Comentarios: '',
          Fecha_Emision: now,
          Fecha_Cierre: null,
          Fecha_Ultima_Actualizacion: now,
        },
      });

      const tarifarios = await this.prisma.tarifarioDeServicio.findMany({
        where: {
          Tarifario_Codigo: {
            in: detalles.map((d: any) => d.tarifarioId),
          },
        },
      });

      await Promise.all(
        detalles.map((d: any) =>
          this.prisma.detalleSolicitud.create({
            data: {
              Solicitud_ID: solicitud.Numero_Solicitud,
              Tarifario_Codigo: d.tarifarioId,
              Cantidad: d.cantidad,
            },
          }),
        ),
      );

      resultados.push(solicitud);

      void this.emailService.sendSolicitudCreada(usuario.Correo, {
        nombre: usuario.Nombre,
        numero: solicitud.Numero_Solicitud,
        estado: solicitud.Estado,
      });
    }

    return resultados;
  }

  async emitirDocumento(
    numeroSolicitud: number,
    file: Express.Multer.File,
    comentario?: string,
  ) {
    if (!file) throw new BadRequestException('Debe subir un archivo');
    if (!comentario?.trim())
      throw new BadRequestException('El comentario es obligatorio');

    const solicitud = await this.prisma.solicitud.findUnique({
      where: { Numero_Solicitud: numeroSolicitud },
      include: {
        usuario: true,
        formulario: { include: { tipoDocumento: true } },
      },
    });

    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    if (
      solicitud.Estado === EstadoSolicitud.APROBADA ||
      solicitud.Estado === EstadoSolicitud.RECHAZADA
    ) {
      throw new BadRequestException('Solicitud cerrada');
    }

    const tipoDocumentoId =
      solicitud.formulario?.tipoDocumento?.TipoDocumento_ID;

    const key = `documentos/${numeroSolicitud}-${Date.now()}.pdf`;

    const { key: storedKey } = await this.s3Service.uploadFile({
      buffer: file.buffer,
      key,
      contentType: file.mimetype,
    });

    await this.prisma.documento.create({
      data: {
        Nombre_Archivo: file.originalname,
        Url_Archivo: storedKey,
        Fecha_Emision: new Date(),
        Estado: EstadoDocumento.GENERADO,
        TipoDocumento_ID: tipoDocumentoId!,
        Solicitud_ID: numeroSolicitud,
      },
    });

    const updated = await this.prisma.solicitud.update({
      where: { Numero_Solicitud: numeroSolicitud },
      data: {
        Estado: EstadoSolicitud.APROBADA,
        Comentarios: comentario,
        Fecha_Cierre: new Date(),
        Fecha_Ultima_Actualizacion: new Date(),
      },
    });

    const url = await this.s3Service.getSignedGetUrl(storedKey, 3600);

    void this.emailService.sendSolicitudAprobada(solicitud.usuario.Correo, {
      nombre: solicitud.usuario.Nombre,
      numero: solicitud.Numero_Solicitud,
      link: url,
    });

    return updated;
  }

  async rechazarSolicitud(
    numeroSolicitud: number,
    dto: UpdateEstadoSolicitudDto,
  ) {
    const { comentario } = dto;

    if (!comentario?.trim()) {
      throw new BadRequestException('Comentario obligatorio');
    }

    const solicitud = await this.prisma.solicitud.findUnique({
      where: { Numero_Solicitud: numeroSolicitud },
      include: { usuario: true },
    });

    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    if (
      solicitud.Estado === EstadoSolicitud.APROBADA ||
      solicitud.Estado === EstadoSolicitud.RECHAZADA
    ) {
      throw new BadRequestException('Solicitud cerrada');
    }

    const updated = await this.prisma.solicitud.update({
      where: { Numero_Solicitud: numeroSolicitud },
      data: {
        Estado: EstadoSolicitud.RECHAZADA,
        Comentarios: comentario,
        Fecha_Cierre: new Date(),
        Fecha_Ultima_Actualizacion: new Date(),
      },
    });

    void this.emailService.sendSolicitudRechazada(solicitud.usuario.Correo, {
      nombre: solicitud.usuario.Nombre,
      numero: solicitud.Numero_Solicitud,
      motivo: comentario,
    });

    return updated;
  }
  // =========================
  // GET SOLICITUDES USUARIO
  // =========================
  async getSolicitudesByUsuario(usuarioId: string) {
    return this.prisma.solicitud.findMany({
      where: { Usuario_ID: usuarioId },
      include: {
        formulario: { include: { tipoDocumento: true } },
        respuesta: true,
        institucion: true,
        documentos: true,
      },
      orderBy: { Fecha_Emision: 'desc' },
    });
  }

  // =========================
  // GET SOLICITUDES INSTITUCION
  // =========================
  async getSolicitudesByInstitucion(institucionId: string) {
    return this.prisma.solicitud.findMany({
      where: { Institucion_ID: institucionId },
      include: {
        usuario: true,
        formulario: { include: { tipoDocumento: true } },
        respuesta: true,
        documentos: true,
      },
      orderBy: { Fecha_Emision: 'desc' },
    });
  }

  // =========================
  // GET DETALLE
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

    return solicitud;
  }

  // =========================
  // CALCULAR MONTO
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
