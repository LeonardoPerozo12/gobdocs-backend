-- AlterTable
ALTER TABLE "TarifarioDeServicio" ADD COLUMN     "TipoDocumento_ID" INTEGER;

-- AddForeignKey
ALTER TABLE "TarifarioDeServicio" ADD CONSTRAINT "TarifarioDeServicio_TipoDocumento_ID_fkey" FOREIGN KEY ("TipoDocumento_ID") REFERENCES "TipoDocumento"("TipoDocumento_ID") ON DELETE SET NULL ON UPDATE CASCADE;
