-- AlterTable
CREATE SEQUENCE documento_numero_documento_seq;
ALTER TABLE "Documento" ALTER COLUMN "Numero_Documento" SET DEFAULT nextval('documento_numero_documento_seq');
ALTER SEQUENCE documento_numero_documento_seq OWNED BY "Documento"."Numero_Documento";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "Activo" SET DEFAULT true;
