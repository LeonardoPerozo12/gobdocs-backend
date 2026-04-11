import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/db/prisma.service';

@Controller('tarifarios')
export class TarifariosController {
  constructor(private readonly prisma: PrismaService) {}

    @Get('tipo-documento/:id')
    async getTarifas(@Param('id') id: string) {
        const tipoDocumentoId = Number(id);

        if (isNaN(tipoDocumentoId)) {
            throw new Error('ID inválido');
        }

        return this.prisma.tarifarioDeServicio.findMany({
            where: {
            TipoDocumento_ID: tipoDocumentoId,
            },
        });
    }

    @Post('bulk')
    async createBulkTarifas(
        @Body()
        body: {
        tarifas: {
            nombre: string;
            descripcion?: string;
            costo: number;
            tipoDocumentoId: number;
        }[];
        },
    ) {
        return this.prisma.tarifarioDeServicio.createMany({
            data: body.tarifas.map((t) => ({
                Nombre: t.nombre,
                Descripcion: t.descripcion,
                Costo_Por_Servicio: t.costo,
                TipoDocumento_ID: t.tipoDocumentoId,
            })),
        });
    }
}