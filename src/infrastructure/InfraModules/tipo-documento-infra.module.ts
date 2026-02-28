import { Module } from '@nestjs/common';
import { TipoDocumentoRepository } from '../repositories/tipo-documento.repository';
import { PrismaModule } from '../db/prisma.module';

@Module({
    imports: [
        PrismaModule,
    ],
    providers: [
        TipoDocumentoRepository,
    ],
    exports: [
        TipoDocumentoRepository,
    ],
})
export class TipoDocumentoInfraModule {}