import { baseTemplate } from './base.template';

export const solicitudRechazadaTemplate = (
  nombre: string,
  numero: number,
  fecha: string,
  motivo: string
) =>
  baseTemplate(`
    <h2 style="color:#111827; font-size:18px;">Solicitud Rechazada</h2>

    <p style="color:#374151;">
      Estimado(a) <strong>${nombre}</strong>,
    </p>

    <p style="color:#374151;">
      Lamentamos informarle que su solicitud no pudo ser procesada y ha sido rechazada.
      A continuación, se detallan los datos correspondientes:
    </p>

    <table style="width:100%; margin-top:20px; border-collapse:collapse;">
      <tr>
        <td style="padding:8px; font-weight:600; color:#374151;">Número de solicitud:</td>
        <td style="padding:8px; color:#111827;">#${numero}</td>
      </tr>
      <tr>
        <td style="padding:8px; font-weight:600; color:#374151;">Fecha de rechazo:</td>
        <td style="padding:8px; color:#111827;">${fecha}</td>
      </tr>
      <tr>
        <td style="padding:8px; font-weight:600; color:#374151;">Motivo:</td>
        <td style="padding:8px; color:#111827;">${motivo}</td>
      </tr>
    </table>

    <p style="margin-top:20px; color:#374151;">
      Le recomendamos verificar los requisitos y volver a realizar la solicitud con la información correcta.
    </p>

    <p style="margin-top:10px; color:#374151;">
      Si tiene dudas, puede contactar con la institución correspondiente.
    </p>
  `);