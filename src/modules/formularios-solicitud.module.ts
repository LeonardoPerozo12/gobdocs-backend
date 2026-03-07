import { Module } from "@nestjs/common";
import { FormulariosSolicitudService } from "src/application/formulario-solicitud/formularios-solicitud.service";
import { FormulariosSolicitudController } from "src/api/formularios-solicitud/formularios-solicitud.controller";
import { FormulariosSolicitudInfraModule } from "src/infrastructure/InfraModules/formularios-solicitud-infra.module";
import { TipoDocumentoInfraModule } from "src/infrastructure/InfraModules/tipo-documento-infra.module";

@Module({
  imports: [
    FormulariosSolicitudInfraModule,
    TipoDocumentoInfraModule,
  ],
  controllers: [
    FormulariosSolicitudController,
  ],
  providers: [
    FormulariosSolicitudService,
  ],
  exports: [
    FormulariosSolicitudInfraModule,
  ],
})
export class FormulariosSolicitudModule {}