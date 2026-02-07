import { Module } from '@nestjs/common';
import { InstitutionService } from '../application/institution/institution.service';
import { institutionController } from '../api/institution/institution.controller';
import { InstitutionInfraModule } from '../infrastructure/InfraModules/institution-infra.module';


@Module({
  imports: [
    InstitutionInfraModule,
  ],
  controllers: [
    institutionController,
  ],
  providers: [
    InstitutionService,
  ],
  exports: [
    InstitutionService,
  ],
})
export class institutionModule {}
