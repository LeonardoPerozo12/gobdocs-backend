/*
  Warnings:

  - Added the required column `Url_Archivo` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Made the column `Fecha_Emision` on table `Documento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Nombre_Archivo` on table `Documento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Estado` on table `Documento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `TipoDocumento_ID` on table `Documento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Solicitud_ID` on table `Documento` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `Institucion_ID` to the `TipoDocumento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Documento" DROP CONSTRAINT "Documento_Solicitud_ID_fkey";

-- DropForeignKey
ALTER TABLE "Documento" DROP CONSTRAINT "Documento_TipoDocumento_ID_fkey";

-- AlterTable
ALTER TABLE "Documento" ADD COLUMN     "Url_Archivo" VARCHAR(500) NOT NULL,
ALTER COLUMN "Fecha_Emision" SET NOT NULL,
ALTER COLUMN "Nombre_Archivo" SET NOT NULL,
ALTER COLUMN "Estado" SET NOT NULL,
ALTER COLUMN "Estado" SET DEFAULT 'GENERADO',
ALTER COLUMN "TipoDocumento_ID" SET NOT NULL,
ALTER COLUMN "Solicitud_ID" SET NOT NULL;

-- AlterTable
ALTER TABLE "TipoDocumento" ADD COLUMN     "Institucion_ID" UUID NOT NULL;

-- CreateTable
CREATE TABLE "DocumentoAdjuntoSolicitud" (
    "DocumentoAdjunto_ID" UUID NOT NULL,
    "Solicitud_ID" INTEGER NOT NULL,
    "Requisito_ID" INTEGER,
    "Nombre_Archivo" VARCHAR(255) NOT NULL,
    "Url_Archivo" VARCHAR(500) NOT NULL,
    "Tipo_Mime" VARCHAR(100),
    "Fecha_Subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentoAdjuntoSolicitud_pkey" PRIMARY KEY ("DocumentoAdjunto_ID")
);

-- CreateTable
CREATE TABLE "RequisitoTipoDocumento" (
    "Requisito_ID" SERIAL NOT NULL,
    "TipoDocumento_ID" INTEGER NOT NULL,
    "TipoDocumento_Requerido_ID" INTEGER,
    "Nombre" VARCHAR(255) NOT NULL,
    "Descripcion" TEXT,
    "EsObligatorio" BOOLEAN NOT NULL DEFAULT true,
    "Requiere_Archivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RequisitoTipoDocumento_pkey" PRIMARY KEY ("Requisito_ID")
);

-- CreateIndex
CREATE INDEX "DocumentoAdjuntoSolicitud_Solicitud_ID_idx" ON "DocumentoAdjuntoSolicitud"("Solicitud_ID");

-- CreateIndex
CREATE INDEX "DocumentoAdjuntoSolicitud_Requisito_ID_idx" ON "DocumentoAdjuntoSolicitud"("Requisito_ID");

-- CreateIndex
CREATE INDEX "RequisitoTipoDocumento_TipoDocumento_ID_idx" ON "RequisitoTipoDocumento"("TipoDocumento_ID");

-- CreateIndex
CREATE INDEX "RequisitoTipoDocumento_TipoDocumento_Requerido_ID_idx" ON "RequisitoTipoDocumento"("TipoDocumento_Requerido_ID");

-- CreateIndex
CREATE INDEX "TipoDocumento_Institucion_ID_idx" ON "TipoDocumento"("Institucion_ID");

-- AddForeignKey
ALTER TABLE "TipoDocumento" ADD CONSTRAINT "TipoDocumento_Institucion_ID_fkey" FOREIGN KEY ("Institucion_ID") REFERENCES "Institucion"("Institucion_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_TipoDocumento_ID_fkey" FOREIGN KEY ("TipoDocumento_ID") REFERENCES "TipoDocumento"("TipoDocumento_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_Solicitud_ID_fkey" FOREIGN KEY ("Solicitud_ID") REFERENCES "Solicitud"("Numero_Solicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoAdjuntoSolicitud" ADD CONSTRAINT "DocumentoAdjuntoSolicitud_Solicitud_ID_fkey" FOREIGN KEY ("Solicitud_ID") REFERENCES "Solicitud"("Numero_Solicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoAdjuntoSolicitud" ADD CONSTRAINT "DocumentoAdjuntoSolicitud_Requisito_ID_fkey" FOREIGN KEY ("Requisito_ID") REFERENCES "RequisitoTipoDocumento"("Requisito_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitoTipoDocumento" ADD CONSTRAINT "RequisitoTipoDocumento_TipoDocumento_ID_fkey" FOREIGN KEY ("TipoDocumento_ID") REFERENCES "TipoDocumento"("TipoDocumento_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitoTipoDocumento" ADD CONSTRAINT "RequisitoTipoDocumento_TipoDocumento_Requerido_ID_fkey" FOREIGN KEY ("TipoDocumento_Requerido_ID") REFERENCES "TipoDocumento"("TipoDocumento_ID") ON DELETE SET NULL ON UPDATE CASCADE;
