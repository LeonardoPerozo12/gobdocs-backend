/*
  Warnings:

  - A unique constraint covering the columns `[Cedula]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Correo]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Cedula_key" ON "Usuario"("Cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Correo_key" ON "Usuario"("Correo");
