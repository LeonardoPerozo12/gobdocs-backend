import { Injectable } from "@nestjs/common";
import { TipoDocumento } from "@prisma/client";
import { PrismaService } from "../db/prisma.service";
import { BaseRepository } from "./base.repository";

@Injectable()
export class TipoDocumentoRepository extends BaseRepository<
    TipoDocumento,
    PrismaService['tipoDocumento']
> {
    constructor(prisma: PrismaService) {
        super(prisma.tipoDocumento);
    }
}