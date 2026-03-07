import {Module} from '@nestjs/common';
import { TipoDocumentoInfraModule } from 'src/infrastructure/InfraModules/tipo-documento-infra.module';
import { TipoDocumentoController } from 'src/api/tipo-documento/tipo-documento.controller';
import { TipoDocumentoService } from 'src/application/tipo-documento/tipo-documento.service';
import { InstitutionInfraModule } from 'src/infrastructure/InfraModules/institution-infra.module';

@Module({
    imports: [
        TipoDocumentoInfraModule,
        InstitutionInfraModule,
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