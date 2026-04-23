import { Module } from '@nestjs/common';
import { EmailService } from 'src/infrastructure/email/email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // 🔥 IMPORTANTE pa usarlo en otros módulos
})
export class EmailModule {}