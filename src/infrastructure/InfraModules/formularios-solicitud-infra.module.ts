import { Module } from "@nestjs/common";
import { PrismaModule } from "../db/prisma.module";
import { FormulariosSolicitudRepository } from "../repositories/formularios-solicitud.repository";

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [
    FormulariosSolicitudRepository,
  ],
  exports: [
    FormulariosSolicitudRepository,
  ],
})
export class FormulariosSolicitudInfraModule {}