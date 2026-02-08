import { Module } from '@nestjs/common';
import { InstitutionService } from '../application/institution/institution.service';
import { InstitutionController } from '../api/institution/institution.controller';
import { InstitutionInfraModule } from '../infrastructure/InfraModules/institution-infra.module';
import { CommonModule } from './common.module'


@Module({
  imports: [
    InstitutionInfraModule,
    CommonModule,
  ],
  controllers: [
    InstitutionController,
  ],
  providers: [
    InstitutionService,
  ],
  exports: [
    InstitutionService,
  ],
})
export class institutionModule {}
