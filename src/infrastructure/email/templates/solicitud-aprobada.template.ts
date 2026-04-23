// templates/solicitud-aprobada.template.ts
import { baseTemplate } from './base.template';

export const solicitudAprobadaTemplate = (
  nombre: string,
  numero: number,
  fecha: string,
  link: string
) =>
  baseTemplate(`
    <h2 style="color:#111827; font-size:18px;">Solicitud Aprobada</h2>

    <p style="color:#374151;">
      Estimado(a) <strong>${nombre}</strong>,
    </p>

    <p style="color:#374151;">
      Nos complace informarle que su solicitud ha sido aprobada.
    </p>

    <table style="width:100%; margin-top:20px; border-collapse:collapse;">
      <tr>
        <td style="padding:8px; font-weight:600;">Número de solicitud:</td>
        <td style="padding:8px;">#${numero}</td>
      </tr>
      <tr>
        <td style="padding:8px; font-weight:600;">Fecha de aprobación:</td>
        <td style="padding:8px;">${fecha}</td>
      </tr>
    </table>

    <div style="text-align:center; margin-top:25px;">
      <a href="${link}"
         style="background:#1a2b5e; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px;">
         Descargar documento
      </a>
    </div>

    <p style="margin-top:20px; color:#374151;">
      Si presenta inconvenientes, puede contactar con la institución correspondiente.
    </p>
  `);