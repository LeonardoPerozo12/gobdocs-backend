// src/infrastructure/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { welcomeTemplate } from './templates/welcome.template';
import { solicitudCreadaTemplate } from './templates/solicitud-creada.template';
import { solicitudAprobadaTemplate } from './templates/solicitud-aprobada.template';
import { solicitudRechazadaTemplate } from './templates/solicitud-rechazada.template';
import { resetPasswordTemplate } from './templates/reset-password.template';
import { passwordChangedTemplate } from './templates/password-changed.template';
import { operatorWelcomeTemplate } from './templates/operator-welcome.template';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    console.log('🔑 RESEND KEY:', process.env.RESEND_API_KEY);
    console.log('📨 EMAIL FROM:', process.env.EMAIL_FROM);
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
      welcomeTemplate(nombre, fecha),
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
    },
  ) {
    const fechaFormateada = this.formatFecha(data.fecha);

    return this.sendEmail(
      to,
      'Confirmación de solicitud',
      solicitudCreadaTemplate(
        data.nombre,
        data.numero,
        fechaFormateada,
        data.estado,
      ),
    );
  }

  async sendAdminInviteEmail(
    to: string,
    data: {
      link: string;
    },
  ) {
    const html = `
      <div style="font-family: Arial; padding:20px;">
        <h2>Invitación a GobDocs</h2>
        <p>Has sido invitado a registrarte como administrador.</p>
        
        <a href="${data.link}" 
          style="
            display:inline-block;
            padding:12px 20px;
            background:#1a2b5e;
            color:white;
            text-decoration:none;
            border-radius:6px;
            margin-top:10px;
          ">
          Crear cuenta de administrador
        </a>

        <p style="margin-top:20px; font-size:12px; color:gray;">
          Si no solicitaste esto, ignora este correo.
        </p>
      </div>
    `;

    return this.sendEmail(to, 'Invitación a GobDocs (Admin)', html);
  }


  // 🔵 Solicitud aprobada
  async sendSolicitudAprobada(
    to: string,
    data: {
      nombre: string;
      numero: number;
      fecha?: Date;
      link: string;
    },
  ) {
    const fechaFormateada = this.formatFecha(data.fecha);

    return this.sendEmail(
      to,
      'Solicitud aprobada',
      solicitudAprobadaTemplate(
        data.nombre,
        data.numero,
        fechaFormateada,
        data.link,
      ),
    );
  }
  async sendSolicitudRechazada(
    to: string,
    data: {
      nombre: string;
      numero: number;
      fecha?: Date;
      motivo: string;
    },
  ) {
    const fechaFormateada = this.formatFecha(data.fecha);

    return this.sendEmail(
      to,
      'Solicitud rechazada',
      solicitudRechazadaTemplate(
        data.nombre,
        data.numero,
        fechaFormateada,
        data.motivo,
      ),
    );
  }
  async sendResetPasswordEmail(
    to: string,
    data: {
      nombre: string;
      link: string;
    },
  ) {
    return this.sendEmail(
      to,
      'Restablecer contraseña',
      resetPasswordTemplate(data.nombre, data.link),
    );
  }
  async sendPasswordChangedEmail(
    to: string,
    data: {
      nombre: string;
    },
  ) {
    return this.sendEmail(
      to,
      'Contraseña actualizada',
      passwordChangedTemplate(data.nombre),
    );
  }
  async sendOperatorWelcomeEmail(
    to: string,
    data: {
      nombre: string;
      correo: string;
      password: string;
    },
  ) {
    return this.sendEmail(
      to,
      'Acceso como operador en GobDocs',
      operatorWelcomeTemplate(data.nombre, data.correo, data.password),
    );
  }
}
