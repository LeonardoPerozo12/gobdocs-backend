
import { EstadoSolicitud } from "@prisma/client";

export class UpdateEstadoSolicitudDto {
  estado: EstadoSolicitud;
  comentario?: string;
}