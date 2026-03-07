import { Injectable } from "@nestjs/common";
import { FormulariosSolicitud } from "@prisma/client";
import { PrismaService } from "../db/prisma.service";
import { BaseRepository } from "./base.repository";

@Injectable()
export class FormulariosSolicitudRepository extends BaseRepository<
  FormulariosSolicitud,
  PrismaService['formulariosSolicitud']
> {
  constructor(prisma: PrismaService) {
    super(prisma.formulariosSolicitud);
  }
}