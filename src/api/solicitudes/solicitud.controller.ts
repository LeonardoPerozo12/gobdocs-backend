import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SolicitudService } from 'src/application/solicitudes/solicitud.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/auth/roles.decorator';
import { EstadoSolicitud, RolUsuario } from '@prisma/client';
import { UpdateEstadoSolicitudDto } from 'src/common/dtos/solicitud/update-estado-solicitud.dto';

@Controller('solicitudes')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  // 🔥 CREAR SOLICITUD
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: any, @Req() req: any) {
    return this.solicitudService.createSolicitud(req.user.userId, body);
  }

  // 🔥 MIS SOLICITUDES (CIUDADANO)
  @Get('mis-solicitudes')
  @UseGuards(AuthGuard('jwt'))
  getMisSolicitudes(@Req() req: any) {
    return this.solicitudService.getSolicitudesByUsuario(req.user.userId);
  }

  // 🔥 SOLICITUDES POR INSTITUCIÓN (BACKOFFICE)
  @Get('institucion')
  @UseGuards(AuthGuard('jwt'))
  getSolicitudesByInstitucion(@Req() req: any) {
    return this.solicitudService.getSolicitudesByInstitucion(
      req.user.institucionId,
    );
  }
  

  // DETALLE DE UNA SOLICITUD
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getSolicitudById(@Param('id') id: string) {
    return this.solicitudService.getSolicitudById(Number(id));
  }

  // EMITIR DOCUMENTO (OPERADOR)
  @Post(':id/documento')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  emitirDocumento(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('comentario') comentario: string,
  ) {
    return this.solicitudService.emitirDocumento(Number(id), file, comentario);
  }

  // Reject solicitud (OPERADOR)
  @Patch(':id/rechazar')
  @Roles(RolUsuario.OPERADOR)
  rechazarSolicitud(
    @Param('id') id: string,
    @Body() dto: UpdateEstadoSolicitudDto,
  ) {
    if (!dto) {
      throw new BadRequestException('Debes enviar un comentario');
    }

    dto.estado = EstadoSolicitud.RECHAZADA;

    return this.solicitudService.rechazarSolicitud(Number(id), dto);
  }

  // CANCELAR SOLICITUD (CIUDADANO)
  @Patch(':id/cancelar')
  @UseGuards(AuthGuard('jwt'))
  cancelarSolicitud(@Param('id') id: string, @Req() req: any) {
    return this.solicitudService.cancelarSolicitud(
      Number(id),
      req.user.userId
    );
  }
}
