/*
  Warnings:

  - You are about to drop the column `Tarifario_Codigo` on the `Solicitud` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_Tarifario_Codigo_fkey";

-- DropIndex
DROP INDEX "Solicitud_Tarifario_Codigo_idx";

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "Tarifario_Codigo";

-- CreateTable
CREATE TABLE "DetalleSolicitud" (
    "Detalle_ID" UUID NOT NULL,
    "Solicitud_ID" INTEGER NOT NULL,
    "Tarifario_Codigo" INTEGER NOT NULL,
    "Cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "DetalleSolicitud_pkey" PRIMARY KEY ("Detalle_ID")
);

-- CreateIndex
CREATE INDEX "DetalleSolicitud_Solicitud_ID_idx" ON "DetalleSolicitud"("Solicitud_ID");

-- CreateIndex
CREATE INDEX "DetalleSolicitud_Tarifario_Codigo_idx" ON "DetalleSolicitud"("Tarifario_Codigo");

-- AddForeignKey
ALTER TABLE "DetalleSolicitud" ADD CONSTRAINT "DetalleSolicitud_Solicitud_ID_fkey" FOREIGN KEY ("Solicitud_ID") REFERENCES "Solicitud"("Numero_Solicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleSolicitud" ADD CONSTRAINT "DetalleSolicitud_Tarifario_Codigo_fkey" FOREIGN KEY ("Tarifario_Codigo") REFERENCES "TarifarioDeServicio"("Tarifario_Codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
