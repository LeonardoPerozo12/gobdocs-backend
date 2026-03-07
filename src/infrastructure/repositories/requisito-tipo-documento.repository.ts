import { Injectable } from "@nestjs/common";
import { RequisitoTipoDocumento } from "@prisma/client";
import { PrismaService } from "../db/prisma.service";
import { BaseRepository } from "./base.repository";

@Injectable()
export class RequisitoTipoDocumentoRepository extends BaseRepository<
  RequisitoTipoDocumento,
  PrismaService['requisitoTipoDocumento']
> {
  constructor(prisma: PrismaService) {
    super(prisma.requisitoTipoDocumento);
  }
}