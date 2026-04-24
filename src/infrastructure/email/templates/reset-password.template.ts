import { baseTemplate } from './base.template';

export const resetPasswordTemplate = (
  nombre: string,
  link: string
) =>
  baseTemplate(`
    <h2 style="color:#111827; font-size:18px;">Restablecer Contraseña</h2>

    <p style="color:#374151;">
      Estimado(a) <strong>${nombre}</strong>,
    </p>

    <p style="color:#374151;">
      Hemos recibido una solicitud para restablecer la contraseña de su cuenta en GobDocs.
    </p>

    <p style="color:#374151;">
      Para continuar con el proceso, haga clic en el siguiente botón:
    </p>

    <div style="text-align:center; margin-top:25px;">
      <a href="${link}"
         style="background:#1a2b5e; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px;">
         Restablecer contraseña
      </a>
    </div>

    <p style="margin-top:20px; color:#374151;">
      Este enlace es válido por un tiempo limitado. Si usted no solicitó este cambio, puede ignorar este mensaje.
    </p>
  `);