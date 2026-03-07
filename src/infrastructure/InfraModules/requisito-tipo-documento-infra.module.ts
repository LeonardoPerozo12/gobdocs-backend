import { Module } from "@nestjs/common";
import { PrismaModule } from "../db/prisma.module";
import { RequisitoTipoDocumentoRepository } from "../repositories/requisito-tipo-documento.repository";

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [
    RequisitoTipoDocumentoRepository,
  ],
  exports: [
    RequisitoTipoDocumentoRepository,
  ],
})
export class RequisitoTipoDocumentoInfraModule {}