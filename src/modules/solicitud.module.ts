import { Module } from "@nestjs/common";
import { SolicitudController } from "src/api/solicitudes/solicitud.controller";
import { SolicitudService } from "src/application/solicitudes/solicitud.service";
import { PrismaService } from "src/infrastructure/db/prisma.service";
import { SolicitudInfraModule } from "src/infrastructure/InfraModules/solicitud-infra.module";

@Module({
    imports: [
        SolicitudInfraModule,
    ],
    controllers: [
        SolicitudController
    ],
    providers: [
        SolicitudService,
        PrismaService,
    ],
    exports: [
        SolicitudInfraModule,
        SolicitudService,
    ],
})
export class SolicitudModule {}