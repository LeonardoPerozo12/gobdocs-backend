// src/infrastructure/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

// 🔹 Importar plantillas
import { welcomeTemplate } from './templates/welcome.template';
import { solicitudCreadaTemplate } from './templates/solicitud-creada.template';
import { solicitudAprobadaTemplate } from './templates/solicitud-aprobada.template';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    console.log("🔑 RESEND KEY:", process.env.RESEND_API_KEY);
    console.log("📨 EMAIL FROM:", process.env.EMAIL_FROM);
    this.resend = new Resend(process.env.RESEND_API_KEY!);
  }

  // 🔹 Método base reutilizable
  async sendEmail(to: string, subject: string, html: string) {
    try {
      const response = await this.resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to,
        subject,
        html,
      });

      console.log('📧 Email enviado:', response);
      return response;
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      throw error;
    }
  }

  // 🔹 Helper para formatear fecha
  private formatFecha(date: Date = new Date()): string {
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // ===============================
  // 🔥 CASOS DE USO GOBDOCS
  // ===============================

  // 🟢 Registro de usuario
  async sendWelcomeEmail(to: string, nombre: string) {
    const fecha = this.formatFecha();

    return this.sendEmail(
      to,
      'Registro exitoso en GobDocs',
      welcomeTemplate(nombre, fecha)
    );
  }

  // 🟡 Solicitud creada
  async sendSolicitudCreada(
    to: string,
    data: {
      nombre: string;
      numero: number;
      fecha?: Date;
      estado: string;
    }
  ) {
    const fechaFormateada = this.formatFecha(data.fecha);

    return this.sendEmail(
      to,
      'Confirmación de solicitud',
      solicitudCreadaTemplate(
        data.nombre,
        data.numero,
        fechaFormateada,
        data.estado
      )
    );
  }

  // 🔵 Solicitud aprobada
  async sendSolicitudAprobada(
    to: string,
    data: {
      nombre: string;
      numero: number;
      fecha?: Date;
      link: string;
    }
  ) {
    const fechaFormateada = this.formatFecha(data.fecha);

    return this.sendEmail(
      to,
      'Solicitud aprobada',
      solicitudAprobadaTemplate(
        data.nombre,
        data.numero,
        fechaFormateada,
        data.link
      )
    );
  }
}