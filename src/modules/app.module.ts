import { Module } from '@nestjs/common';
import { AppController } from '../api/app/app.controller';
import { AppService } from '../application/app/app.service';
import { PrismaService } from '../infrastructure/db/prisma.service';
import { UserModule } from './user.modules';
import { AuthModule } from '../common/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import {institutionModule} from './institution.module'
import { SolicitudModule } from './solicitud.module';
import { TipoDocumentoModule } from './tipo-documento.module';
import { RequisitoTipoDocumentoModule } from './requisito-tipo-documento.module';
import { FormulariosSolicitudModule } from './formularios-solicitud.module';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  UserModule,
  AuthModule,
  institutionModule,
  RequisitoTipoDocumentoModule,
  TipoDocumentoModule,
  SolicitudModule,
  FormulariosSolicitudModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
