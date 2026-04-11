import { PaymentsController } from "src/api/payments/payments.controller";
import { StripeService } from "src/application/stripe/stripe.service";
import { Module } from '@nestjs/common';
import { TarifarioService } from "src/application/tarifario/tarifario.service";
import { PrismaModule } from "src/infrastructure/db/prisma.module";
import { SolicitudModule } from "./solicitud.module";


@Module({
    imports: [PrismaModule, SolicitudModule ],
    controllers: [PaymentsController],
    providers: [StripeService, TarifarioService ],
})
export class PaymentsModule {}