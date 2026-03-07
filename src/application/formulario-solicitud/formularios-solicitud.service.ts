import { Injectable, NotFoundException } from "@nestjs/common";
import { FormulariosSolicitudRepository } from "src/infrastructure/repositories/formularios-solicitud.repository";
import { CreateFormularioSolicitudDto } from "src/common/dtos/formularios-solicitud/create-formulario-solicitud.dto";
import { UpdateFormularioSolicitudDto } from "src/common/dtos/formularios-solicitud/update-formulario-solicitud.dto";


@Injectable()
export class FormulariosSolicitudService {

  constructor(
    private readonly formulariosRepo: FormulariosSolicitudRepository
  ) {}

  async create(dto: CreateFormularioSolicitudDto) {
    return this.formulariosRepo.create({
      data: dto,
    });
  }

  async findAll() {
    return this.formulariosRepo.findMany();
  }

  async findOne(id: string) {
    const formulario = await this.formulariosRepo.findUnique({
      where: {
        Formulario_ID: id,
      },
    });

    if (!formulario) {
      throw new NotFoundException(`Formulario ${id} no encontrado`);
    }

    return formulario;
  }

  async update(id: string, dto: UpdateFormularioSolicitudDto) {

    await this.findOne(id);

    return this.formulariosRepo.update({
      where: {
        Formulario_ID: id,
      },
      data: dto,
    });
  }
  async findByTipoDocumento(tipoDocumentoId: number) {
    return this.formulariosRepo.findFirst({
        where: {
        TipoDocumento_ID: tipoDocumentoId,
        },
    });
    }

  async remove(id: string) {
    await this.findOne(id);

    return this.formulariosRepo.delete({
      where: {
        Formulario_ID: id,
      },
    });
  }
}