// templates/welcome.template.ts
import { baseTemplate } from './base.template';

export const welcomeTemplate = (nombre: string, fecha: string) =>
  baseTemplate(`
    <h2 style="color:#111827;">Registro Exitoso</h2>

    <p>Estimado(a) <strong>${nombre}</strong>,</p>

    <p>
      Su cuenta ha sido creada correctamente en la plataforma GobDocs.
    </p>

    <p>
      Fecha de registro: ${fecha}
    </p>

    <p>
      Ya puede acceder al sistema y gestionar sus solicitudes de documentos.
    </p>
  `);