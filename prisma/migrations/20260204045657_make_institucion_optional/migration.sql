-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_Institucion_ID_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "Institucion_ID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_Institucion_ID_fkey" FOREIGN KEY ("Institucion_ID") REFERENCES "Institucion"("Institucion_ID") ON DELETE SET NULL ON UPDATE CASCADE;
