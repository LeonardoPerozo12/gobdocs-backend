import { Module } from "@nestjs/common";
import { SolicitudRepository } from "../repositories/solicitud.repository";
import { PrismaModule } from '../db/prisma.module';

@Module({
    imports: [
        PrismaModule,
    ],
    providers: [
        SolicitudRepository,
    ],
    exports: [
        SolicitudRepository,
    ],
})
export class SolicitudInfraModule {}