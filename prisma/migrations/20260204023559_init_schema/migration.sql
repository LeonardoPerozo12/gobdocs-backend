-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'APROBADA', 'RECHAZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoDocumento" AS ENUM ('GENERADO', 'APROBADO', 'VENCIDO', 'ANULADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TARJETA');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'OPERADOR', 'CIUDADANO');

-- CreateTable
CREATE TABLE "TarifarioDeServicio" (
    "Tarifario_Codigo" SERIAL NOT NULL,
    "Nombre" VARCHAR(255),
    "Descripcion" TEXT,
    "Costo_Por_Servicio" DECIMAL(10,2),

    CONSTRAINT "TarifarioDeServicio_pkey" PRIMARY KEY ("Tarifario_Codigo")
);

-- CreateTable
CREATE TABLE "FormulariosSolicitud" (
    "Formulario_ID" UUID NOT NULL,
    "Form_Definition" JSONB,
    "TipoDocumento_ID" INTEGER,

    CONSTRAINT "FormulariosSolicitud_pkey" PRIMARY KEY ("Formulario_ID")
);

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "TipoDocumento_ID" SERIAL NOT NULL,
    "Nombre" VARCHAR(255),
    "Descripcion" TEXT,

    CONSTRAINT "TipoDocumento_pkey" PRIMARY KEY ("TipoDocumento_ID")
);

-- CreateTable
CREATE TABLE "Documento" (
    "Numero_Documento" INTEGER NOT NULL,
    "Fecha_Emision" DATE,
    "Fecha_Vencimiento" DATE,
    "Nombre_Archivo" VARCHAR(255),
    "Estado" "EstadoDocumento",
    "TipoDocumento_ID" INTEGER,
    "Solicitud_ID" INTEGER,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("Numero_Documento")
);

-- CreateTable
CREATE TABLE "RespuestaFormulario" (
    "Respuesta_ID" UUID NOT NULL,
    "Respuestas" JSONB,
    "Formulario_ID" UUID,

    CONSTRAINT "RespuestaFormulario_pkey" PRIMARY KEY ("Respuesta_ID")
);

-- CreateTable
CREATE TABLE "Institucion" (
    "Institucion_ID" UUID NOT NULL,
    "Nombre" VARCHAR(255),
    "Descripcion" VARCHAR(255),
    "Logo_URL" VARCHAR(255),

    CONSTRAINT "Institucion_pkey" PRIMARY KEY ("Institucion_ID")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "Usuario_ID" UUID NOT NULL,
    "Nombre" TEXT NOT NULL,
    "Cedula" TEXT NOT NULL,
    "Correo" TEXT NOT NULL,
    "Contraseña" TEXT NOT NULL,
    "Activo" BOOLEAN NOT NULL,
    "Rol" "RolUsuario" NOT NULL,
    "Institucion_ID" UUID NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("Usuario_ID")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "Numero_Solicitud" SERIAL NOT NULL,
    "Respuesta" TEXT NOT NULL,
    "Comentarios" TEXT NOT NULL,
    "Fecha_Emision" DATE NOT NULL,
    "Fecha_Cierre" DATE NOT NULL,
    "Fecha_Ultima_Actualizacion" DATE NOT NULL,
    "Estado" "EstadoSolicitud" NOT NULL,
    "Institucion_ID" UUID NOT NULL,
    "Usuario_ID" UUID NOT NULL,
    "Formulario_ID" UUID NOT NULL,
    "Respuesta_ID" UUID NOT NULL,
    "Tarifario_Codigo" INTEGER NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("Numero_Solicitud")
);

-- CreateTable
CREATE TABLE "Pagos" (
    "Pago_ID" UUID NOT NULL,
    "Monto_Pago" DECIMAL(10,2) NOT NULL,
    "Fecha_Pago" TIMESTAMP(0) NOT NULL,
    "Metodo_Pago" "MetodoPago" NOT NULL,
    "Usuario_ID" UUID NOT NULL,
    "Solicitud_ID" INTEGER NOT NULL,

    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("Pago_ID")
);

-- CreateIndex
CREATE INDEX "FormulariosSolicitud_TipoDocumento_ID_idx" ON "FormulariosSolicitud"("TipoDocumento_ID");

-- CreateIndex
CREATE INDEX "Documento_Estado_idx" ON "Documento"("Estado");

-- CreateIndex
CREATE INDEX "Documento_TipoDocumento_ID_idx" ON "Documento"("TipoDocumento_ID");

-- CreateIndex
CREATE INDEX "Documento_Solicitud_ID_idx" ON "Documento"("Solicitud_ID");

-- CreateIndex
CREATE INDEX "RespuestaFormulario_Formulario_ID_idx" ON "RespuestaFormulario"("Formulario_ID");

-- CreateIndex
CREATE INDEX "Usuario_Institucion_ID_idx" ON "Usuario"("Institucion_ID");

-- CreateIndex
CREATE INDEX "Solicitud_Estado_idx" ON "Solicitud"("Estado");

-- CreateIndex
CREATE INDEX "Solicitud_Institucion_ID_idx" ON "Solicitud"("Institucion_ID");

-- CreateIndex
CREATE INDEX "Solicitud_Usuario_ID_idx" ON "Solicitud"("Usuario_ID");

-- CreateIndex
CREATE INDEX "Solicitud_Formulario_ID_idx" ON "Solicitud"("Formulario_ID");

-- CreateIndex
CREATE INDEX "Solicitud_Respuesta_ID_idx" ON "Solicitud"("Respuesta_ID");

-- CreateIndex
CREATE INDEX "Solicitud_Tarifario_Codigo_idx" ON "Solicitud"("Tarifario_Codigo");

-- CreateIndex
CREATE INDEX "Pagos_Usuario_ID_idx" ON "Pagos"("Usuario_ID");

-- CreateIndex
CREATE INDEX "Pagos_Solicitud_ID_idx" ON "Pagos"("Solicitud_ID");

-- AddForeignKey
ALTER TABLE "FormulariosSolicitud" ADD CONSTRAINT "FormulariosSolicitud_TipoDocumento_ID_fkey" FOREIGN KEY ("TipoDocumento_ID") REFERENCES "TipoDocumento"("TipoDocumento_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_TipoDocumento_ID_fkey" FOREIGN KEY ("TipoDocumento_ID") REFERENCES "TipoDocumento"("TipoDocumento_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_Solicitud_ID_fkey" FOREIGN KEY ("Solicitud_ID") REFERENCES "Solicitud"("Numero_Solicitud") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespuestaFormulario" ADD CONSTRAINT "RespuestaFormulario_Formulario_ID_fkey" FOREIGN KEY ("Formulario_ID") REFERENCES "FormulariosSolicitud"("Formulario_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_Institucion_ID_fkey" FOREIGN KEY ("Institucion_ID") REFERENCES "Institucion"("Institucion_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_Institucion_ID_fkey" FOREIGN KEY ("Institucion_ID") REFERENCES "Institucion"("Institucion_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_Usuario_ID_fkey" FOREIGN KEY ("Usuario_ID") REFERENCES "Usuario"("Usuario_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_Formulario_ID_fkey" FOREIGN KEY ("Formulario_ID") REFERENCES "FormulariosSolicitud"("Formulario_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_Respuesta_ID_fkey" FOREIGN KEY ("Respuesta_ID") REFERENCES "RespuestaFormulario"("Respuesta_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_Tarifario_Codigo_fkey" FOREIGN KEY ("Tarifario_Codigo") REFERENCES "TarifarioDeServicio"("Tarifario_Codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_Usuario_ID_fkey" FOREIGN KEY ("Usuario_ID") REFERENCES "Usuario"("Usuario_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_Solicitud_ID_fkey" FOREIGN KEY ("Solicitud_ID") REFERENCES "Solicitud"("Numero_Solicitud") ON DELETE RESTRICT ON UPDATE CASCADE;
