/*
  Warnings:

  - A unique constraint covering the columns `[Cedula,Rol]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Usuario_Cedula_key";

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Cedula_Rol_key" ON "Usuario"("Cedula", "Rol");
