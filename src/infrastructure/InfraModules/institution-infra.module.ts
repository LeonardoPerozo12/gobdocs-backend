import { Module } from '@nestjs/common';
import { InstitutionRepository } from '../repositories/institution.repository';
import { PrismaModule } from '../db/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [
    InstitutionRepository,
  ],
  exports: [
    InstitutionRepository,
  ],
})
export class InstitutionInfraModule {}
