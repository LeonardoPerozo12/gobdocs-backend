import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// Ajusta la ruta según dónde esté el archivo:
import { PrismaClient } from './prisma-client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Aquí puedes pasar opciones al constructor si quieres (middlewares, logs, etc.)
  constructor() {
    super();
  }

  async onModuleInit() {
    // Ahora sí existe this.$connect() porque la clase extiende PrismaClient
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
