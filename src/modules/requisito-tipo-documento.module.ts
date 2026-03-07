import { Module } from "@nestjs/common";
import { RequisitoTipoDocumentoService } from "src/application/requisito-tipo-documento/requisito-tipo-documento.service";
import { RequisitoTipoDocumentoController } from "src/api/requisito-tipo-documento/requisito-tipo-documento.controller";
import { RequisitoTipoDocumentoInfraModule } from "src/infrastructure/InfraModules/requisito-tipo-documento-infra.module";
import { TipoDocumentoInfraModule } from "src/infrastructure/InfraModules/tipo-documento-infra.module";

@Module({
  imports: [
    RequisitoTipoDocumentoInfraModule,
    TipoDocumentoInfraModule,
  ],
  controllers: [
    RequisitoTipoDocumentoController,
  ],
  providers: [
    RequisitoTipoDocumentoService,
  ],
  exports: [
    RequisitoTipoDocumentoInfraModule,
  ],
})
export class RequisitoTipoDocumentoModule {}