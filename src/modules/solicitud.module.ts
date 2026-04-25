import { Module } from "@nestjs/common";
import { SolicitudController } from "src/api/solicitudes/solicitud.controller";
import { SolicitudService } from "src/application/solicitudes/solicitud.service";
import { PrismaService } from "src/infrastructure/db/prisma.service";
import { SolicitudInfraModule } from "src/infrastructure/InfraModules/solicitud-infra.module";
import { EmailModule } from "./email.module";
import { S3Module } from "src/common/helper/s3.module";

@Module({
    imports: [
        SolicitudInfraModule,
        EmailModule, // Para enviar emails desde SolicitudService
        S3Module, // Para subir archivos a S3 desde SolicitudService
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