import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SolicitudService } from "src/application/solicitudes/solicitud.service";

@Controller("solicitudes")
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  create(@Body() body: any, @Req() req: any) {
    return this.solicitudService.createSolicitud(
      req.user.userId,
      body
    );
  }
}