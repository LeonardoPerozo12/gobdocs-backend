import { baseTemplate } from './base.template';

export const passwordChangedTemplate = (nombre: string) =>
  baseTemplate(`
    <h2 style="color:#111827; font-size:18px;">Contraseña actualizada</h2>

    <p style="color:#374151;">
      Estimado(a) <strong>${nombre}</strong>,
    </p>

    <p style="color:#374151;">
      Su contraseña ha sido actualizada correctamente.
    </p>

    <p style="margin-top:20px; color:#374151;">
      Si usted no realizó este cambio, le recomendamos contactar inmediatamente con soporte.
    </p>
  `);