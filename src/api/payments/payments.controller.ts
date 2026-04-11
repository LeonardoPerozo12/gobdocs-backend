import { Controller, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { SolicitudService } from 'src/application/solicitudes/solicitud.service';
import { StripeService } from 'src/application/stripe/stripe.service';
import { TarifarioService } from 'src/application/tarifario/tarifario.service';
import { PrismaService } from 'src/infrastructure/db/prisma.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly tarifarioService: TarifarioService,
    private readonly solicitudService: SolicitudService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('create-intent')
  async createPaymentIntent(
    @Body() body: { detalles: { tarifarioId: number; cantidad: number }[] },
  ) {
    const total = await this.tarifarioService.calcularMonto(body.detalles);

    const paymentIntent = await this.stripeService.createPaymentIntent(
      total * 100,
    );

    return {
      client_secret: paymentIntent.client_secret,
      monto: total,
    };
  }

  @Post('create-intent/:numero_solicitud')
  async createIntent(@Param('numero_solicitud') id: string) {
    const solicitudId = Number(id);

    if (isNaN(solicitudId)) {
      throw new BadRequestException('ID inválido');
    }

    const total =
      await this.solicitudService.calcularMontoDesdeSolicitud(solicitudId);

    const paymentIntent =
      await this.stripeService.createPaymentIntent(total * 100);

    return {
      client_secret: paymentIntent.client_secret,
      monto: total,
    };
  }

  // helper TODO: este método se puede mover a un servicio aparte para evitar repetir lógica con el endpoint de confirmación real
  private async procesarConfirmacion(
    paymentIntentId: string,
    solicitudId: number,
  ) {
    const paymentIntent =
      await this.stripeService.getPaymentIntent(paymentIntentId);

    if (!paymentIntent) {
      throw new BadRequestException('PaymentIntent no encontrado');
    }

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Pago no completado');
    }

    const total =
      await this.solicitudService.calcularMontoDesdeSolicitud(solicitudId);

    const stripeAmount = paymentIntent.amount / 100;

    if (Number(total) !== Number(stripeAmount)) {
      throw new BadRequestException('El monto no coincide');
    }

    return { total };
  }

  // CONFIRM PAYMENT
  @Post('confirm')
  async confirmPayment(@Body() body: any) {
    const { paymentIntentId, solicitudId } = body;

    if (!paymentIntentId || !solicitudId) {
      throw new BadRequestException('Datos incompletos');
    }

    const solicitudIdNum = Number(solicitudId);

    const { total } = await this.procesarConfirmacion(
      paymentIntentId,
      solicitudIdNum,
    );

    const solicitud = await this.prisma.solicitud.findUnique({
      where: { Numero_Solicitud: solicitudIdNum },
    });

    if (!solicitud) {
      throw new BadRequestException('Solicitud no encontrada');
    }

    const pagoExistente = await this.prisma.pagos.findFirst({
      where: { Solicitud_ID: solicitudIdNum },
    });

    if (pagoExistente) {
      throw new BadRequestException('Esta solicitud ya fue pagada');
    }

    const pago = await this.prisma.pagos.create({
      data: {
        Monto_Pago: total,
        Metodo_Pago: 'TARJETA',
        Usuario_ID: solicitud.Usuario_ID,
        Solicitud_ID: solicitud.Numero_Solicitud,
        Fecha_Pago: new Date(),
      },
    });

    await this.prisma.solicitud.update({
      where: { Numero_Solicitud: solicitudIdNum },
      data: {
        Estado: 'EN_PROCESO',
        Fecha_Ultima_Actualizacion: new Date(),
      },
    });

    return {
      success: true,
      pago,
    };
  }
}