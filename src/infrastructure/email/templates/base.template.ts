// templates/base.template.ts
export const baseTemplate = (content: string) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color:#f4f6f8; padding:40px 0;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:0; overflow:hidden;">
      
      <!-- 🔥 HEADER AZUL -->
      <div style="background:#1a2b5e; padding:25px 30px; text-align:center;">
        <h1 style="margin:0; color:#ffffff; font-size:22px;">GobDocs</h1>
        <p style="margin:5px 0 0; color:#ffffff; font-size:13px;">
          Plataforma de Gestión de Documentos
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:30px;">
        ${content}
      </div>

      <!-- Footer -->
      <hr style="margin:30px 30px 0; border:none; border-top:1px solid #e5e7eb;" />
      <p style="font-size:12px; color:#9ca3af; text-align:center; padding:20px;">
        Este mensaje fue generado automáticamente por GobDocs.  
        Por favor, no responda a este correo.
      </p>
    </div>
  </div>
`;