import { baseTemplate } from './base.template';

export const operatorWelcomeTemplate = (
  nombre: string,
  correo: string,
  password: string
) =>
  baseTemplate(`
    <h2 style="color:#111827; font-size:18px;">Acceso como Operador</h2>

    <p style="color:#374151;">
      Estimado(a) <strong>${nombre}</strong>,
    </p>

    <p style="color:#374151;">
      Se ha creado una cuenta para usted como <strong>operador</strong> en la plataforma GobDocs.
    </p>

    <table style="width:100%; margin-top:20px; border-collapse:collapse;">
      <tr>
        <td style="padding:8px; font-weight:600;">Usuario:</td>
        <td style="padding:8px;">${correo}</td>
      </tr>
      <tr>
        <td style="padding:8px; font-weight:600;">Contraseña temporal:</td>
        <td style="padding:8px;">${password}</td>
      </tr>
    </table>

    <p style="margin-top:20px; color:#374151;">
      Por motivos de seguridad, deberá cambiar su contraseña al iniciar sesión por primera vez.
    </p>

    <div style="text-align:center; margin-top:25px;">
      <a href="${process.env.FRONTEND_URL}/login"
         style="background:#1a2b5e; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px;">
         Acceder a GobDocs
      </a>
    </div>
  `);