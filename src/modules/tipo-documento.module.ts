import {Module} from '@nestjs/common';
import { TipoDocumentoInfraModule } from 'src/infrastructure/InfraModules/tipo-documento-infra.module';
import { TipoDocumentoController } from 'src/api/tipo-documento/tipo-documento.controller';
import { TipoDocumentoService } from 'src/application/tipo-documento/tipo-documento.service';

@Module({
    imports: [
        TipoDocumentoInfraModule,
    ],
    controllers: [
        TipoDocumentoController
    ],
    providers: [
        TipoDocumentoService,
        TipoDocumentoInfraModule
    ],
    exports: [
        TipoDocumentoInfraModule,
    ],
})
export class TipoDocumentoModule {}