import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/db/prisma.service';

@Injectable()
export class TarifarioService {
  constructor(private prisma: PrismaService) {}

  async calcularMonto(
    detalles: { tarifarioId: number; cantidad: number }[],
  ) {
    let total = 0;

    for (const item of detalles) {
      const tarifa = await this.prisma.tarifarioDeServicio.findUnique({
        where: { Tarifario_Codigo: item.tarifarioId },
      });

      if (!tarifa || !tarifa.Costo_Por_Servicio) {
        throw new Error(`Tarifa ${item.tarifarioId} no encontrada`);
      }

      total += Number(tarifa.Costo_Por_Servicio) * item.cantidad;
    }

    return total;
  }
}