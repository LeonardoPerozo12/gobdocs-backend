# GobDocs RD – Backend

Backend oficial de **GobDocs RD**, una plataforma digital para la gestión, solicitud y emisión de documentos gubernamentales en la República Dominicana.

Este backend expone una **API RESTful** segura que permite a ciudadanos, instituciones y administradores interactuar con el sistema de forma centralizada, trazable y auditable.

---

## Objetivo del Backend

- Gestionar autenticación y autorización de usuarios.
- Procesar solicitudes de documentos oficiales.
- Integrar pagos electrónicos.
- Emitir documentos digitales verificables.
- Mantener auditoría completa de acciones.
- Servir como capa de negocio para web y mobile apps.

---

## Arquitectura General

- Arquitectura **cliente-servidor**.
- Backend desacoplado del frontend.
- Diseño modular y escalable.
- Enfoque en seguridad, auditoría y trazabilidad.

---

## Stack Tecnológico (Backend)

- **Runtime:** Node.js
- **Lenguaje:** TypeScript
- **Framework:** NestJS
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** JWT + 2FA
- **Arquitectura:** API RESTful
- **Control de versiones:** Git (Azure DevOps Repos)

---

## Módulos del Backend

El backend está diseñado de forma modular:

- **Auth:** Registro, login, JWT, 2FA.
- **Users:** Gestión de perfiles de ciudadanos.
- **Institutions:** Configuración de instituciones y tarifas.
- **Requests:** Solicitudes de documentos y estados.
- **Payments:** Integración con pasarela de pagos.
- **Documents:** Generación y validación de documentos digitales.
- **Admin:** Funcionalidades administrativas y backoffice.
- **Audit Logs:** Registro inmutable de acciones del sistema.
- **Notifications:** Envío de correos y notificaciones.
- **Chatbot:** Asistencia automática y consultas de estado.

---

## Seguridad y Cumplimiento

- Autenticación con 2FA. 
- Protección de datos personales (PII).
- Auditoría completa de operaciones críticas.
- Control de accesos por roles.

---

## Estructura Inicial del Proyecto

```text
gobdocs-backend/
│
├── docs/
│   ├── arquitectura-backend.md
│   └── srs-resumen.md
│
├── src/
│   ├── auth/
│   ├── users/
│   ├── institutions/
│   ├── requests/
│   ├── payments/
│   ├── documents/
│   ├── admin/
│   ├── audit-logs/
│   ├── notifications/
│   ├── chatbot/
│   └── common/
│
├── README.md
└── .gitignore
