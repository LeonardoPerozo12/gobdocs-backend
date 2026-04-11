import { Module } from '@nestjs/common';
import { TarifariosController } from 'src/api/tarifas/tarifarios.controller';
import { TarifarioService } from 'src/application/tarifario/tarifario.service';
import { PrismaModule } from 'src/infrastructure/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TarifariosController],
  providers: [TarifarioService],
  exports: [TarifarioService],
})
export class TarifarioModule {}