import { Module } from "@nestjs/common";
import { SolicitudInfraModule } from "src/infrastructure/InfraModules/solicitud-infra.module";

@Module({
    imports: [
        SolicitudInfraModule,
    ],
    controllers: [
    ],
    providers: [
    ],
    exports: [
        SolicitudInfraModule,
    ],
})
export class SolicitudModule {}