// templates/solicitud-creada.template.ts
import { baseTemplate } from './base.template';

export const solicitudCreadaTemplate = (
  nombre: string,
  numero: number,
  fecha: string,
  estado: string
) =>
  baseTemplate(`
    <h2 style="color:#111827; font-size:18px;">Confirmación de Solicitud</h2>

    <p style="color:#374151;">
      Estimado(a) <strong>${nombre}</strong>,
    </p>

    <p style="color:#374151;">
      Su solicitud ha sido registrada exitosamente en el sistema GobDocs.
      A continuación, se detallan los datos correspondientes:
    </p>

    <table style="width:100%; margin-top:20px; border-collapse:collapse;">
      <tr>
        <td style="padding:8px; font-weight:600; color:#374151;">Número de solicitud:</td>
        <td style="padding:8px; color:#111827;">#${numero}</td>
      </tr>
      <tr>
        <td style="padding:8px; font-weight:600; color:#374151;">Fecha:</td>
        <td style="padding:8px; color:#111827;">${fecha}</td>
      </tr>
      <tr>
        <td style="padding:8px; font-weight:600; color:#374151;">Estado actual:</td>
        <td style="padding:8px; color:#111827;">${estado}</td>
      </tr>
    </table>

    <p style="margin-top:20px; color:#374151;">
      Usted será notificado cuando el estado de su solicitud cambie.
    </p>
  `);